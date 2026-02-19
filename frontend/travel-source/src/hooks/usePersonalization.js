import { useState, useEffect, useCallback, useRef } from "react";
import { recordTripView, fetchRecommendedTrips } from "../services/api";

const LS_INTERESTS = "tp_interests";
const LS_VIEWED = "tp_viewed_ids";
const MAX_RECENT = 10;

export const INTEREST_OPTIONS = [
  {
    id: "beach",
    label: "Beach & Islands",
    icon: "🏖️",
    keywords: [
      "beach",
      "island",
      "coast",
      "ocean",
      "bali",
      "maldives",
      "santorini",
      "goa",
    ],
  },
  {
    id: "adventure",
    label: "Adventure",
    icon: "🧗",
    keywords: [
      "adventure",
      "trek",
      "hike",
      "climb",
      "safari",
      "wild",
      "valley",
    ],
  },
  {
    id: "culture",
    label: "Culture & History",
    icon: "🏛️",
    keywords: [
      "culture",
      "history",
      "heritage",
      "temple",
      "museum",
      "ancient",
      "kyoto",
      "rome",
      "delhi",
    ],
  },
  {
    id: "luxury",
    label: "Luxury",
    icon: "💎",
    keywords: ["luxury", "premium", "exclusive", "resort", "villa", "spa"],
  },
  {
    id: "nature",
    label: "Nature & Wildlife",
    icon: "🌿",
    keywords: ["nature", "wildlife", "forest", "jungle", "park", "reserve"],
  },
  {
    id: "mountains",
    label: "Mountains",
    icon: "🏔️",
    keywords: ["mountain", "himalaya", "alpine", "peak", "glacier", "valley"],
  },
  {
    id: "city",
    label: "City Breaks",
    icon: "🏙️",
    keywords: ["city", "urban", "tokyo", "paris", "dubai", "singapore"],
  },
  {
    id: "spiritual",
    label: "Spiritual",
    icon: "🙏",
    keywords: [
      "spiritual",
      "temple",
      "meditation",
      "yoga",
      "pilgrimage",
      "sacred",
    ],
  },
];

function scoreTrip(trip, interests, avgViewedPrice) {
  const text =
    `${trip.title} ${trip.location} ${trip.description || ""}`.toLowerCase();
  let score = 0;

  // Interest keyword matching
  for (const interestId of interests) {
    const opt = INTEREST_OPTIONS.find((o) => o.id === interestId);
    if (!opt) continue;
    for (const kw of opt.keywords) {
      if (text.includes(kw)) score += 2;
    }
  }

  // Price proximity bonus
  if (avgViewedPrice > 0) {
    const diff = Math.abs(trip.price - avgViewedPrice) / avgViewedPrice;
    if (diff < 0.2) score += 4;
    else if (diff < 0.4) score += 2;
    else if (diff < 0.6) score += 1;
  }

  return score;
}

const usePersonalization = (allTrips) => {
  const [interests, setInterestsState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_INTERESTS)) || [];
    } catch {
      return [];
    }
  });

  const [viewedIds, setViewedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_VIEWED)) || [];
    } catch {
      return [];
    }
  });

  const [recommended, setRecommended] = useState([]);
  const [loadingRec, setLoadingRec] = useState(false);
  const hasFetched = useRef(false);

  // Derived: recently viewed trips (most recent first)
  const recentlyViewed = [...viewedIds]
    .reverse()
    .map((id) => allTrips.find((t) => t.id === id))
    .filter(Boolean)
    .slice(0, 6);

  // ── Helper: compute recommendations client-side ──────────────────────────
  const computeClientRec = useCallback(
    (trips, currentViewedIds, currentInterests) => {
      const viewedSet = new Set(currentViewedIds);
      const recent = [...currentViewedIds]
        .reverse()
        .map((id) => trips.find((t) => t.id === id))
        .filter(Boolean);
      const avgPrice = recent.length
        ? recent.reduce((s, t) => s + t.price, 0) / recent.length
        : 0;
      return trips
        .filter((t) => !viewedSet.has(t.id))
        .map((t) => ({
          ...t,
          _score: scoreTrip(t, currentInterests, avgPrice),
        }))
        .sort((a, b) => b._score - a._score)
        .slice(0, 6);
    },
    [],
  );

  // ── Fetch from backend on first load ─────────────────────────────────────
  useEffect(() => {
    if (!allTrips.length || hasFetched.current) return;
    hasFetched.current = true;

    const load = async () => {
      setLoadingRec(true);
      try {
        const data = await fetchRecommendedTrips(viewedIds);
        const avgPrice = recentlyViewed.length
          ? recentlyViewed.reduce((s, t) => s + t.price, 0) /
            recentlyViewed.length
          : 0;
        const scored = data
          .map((t) => ({ ...t, _score: scoreTrip(t, interests, avgPrice) }))
          .sort((a, b) => b._score - a._score);
        setRecommended(scored.slice(0, 6));
      } catch {
        setRecommended(computeClientRec(allTrips, viewedIds, interests));
      } finally {
        setLoadingRec(false);
      }
    };
    load();
  }, [allTrips.length]); // eslint-disable-line

  // ── Recompute when interests change ─────────────────────────────────────
  useEffect(() => {
    if (!allTrips.length) return;
    setRecommended(computeClientRec(allTrips, viewedIds, interests));
  }, [interests]); // eslint-disable-line

  // ── Public actions ───────────────────────────────────────────────────────
  const setInterests = useCallback((next) => {
    setInterestsState(next);
    localStorage.setItem(LS_INTERESTS, JSON.stringify(next));
  }, []);

  const recordView = useCallback((tripId) => {
    setViewedIds((prev) => {
      const next = [...prev.filter((id) => id !== tripId), tripId].slice(
        -MAX_RECENT,
      );
      localStorage.setItem(LS_VIEWED, JSON.stringify(next));
      // Update recommendations by removing this trip
      setRecommended((recs) => recs.filter((t) => t.id !== tripId));
      return next;
    });
    recordTripView(tripId); // server-side record (no-op if not logged in)
  }, []);

  return {
    interests,
    setInterests,
    viewedIds,
    recentlyViewed,
    recommended,
    loadingRec,
    recordView,
    hasPersonalization: interests.length > 0 || viewedIds.length > 0,
  };
};

export default usePersonalization;
