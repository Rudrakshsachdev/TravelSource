import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchInternationalTrips, fetchIndiaTrips } from "../../services/api";
import styles from "./TrendingDestinations.module.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:8000";

const getImgUrl = (path) => {
  if (!path || !path.trim()) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

/* Pill-shaped card colours — cycled through */
const TINT_COLORS = [
  "rgba(236, 72, 153, 0.25)",
  "rgba(37, 99, 235, 0.25)",
  "rgba(16, 185, 129, 0.25)",
  "rgba(245, 158, 11, 0.25)",
  "rgba(139, 92, 246, 0.25)",
  "rgba(239, 68, 68, 0.25)",
  "rgba(6, 182, 212, 0.25)",
  "rgba(234, 88, 12, 0.25)",
];

export const TrendingDestinations = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [activeTab, setActiveTab] = useState("international");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Fetch trips when toggle changes */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        const data =
          activeTab === "international"
            ? await fetchInternationalTrips()
            : await fetchIndiaTrips();

        if (!cancelled) {
          // Both endpoints return { config, trips } or just an array
          const list = Array.isArray(data) ? data : data.trips ?? [];
          setTrips(list);
        }
      } catch {
        if (!cancelled) setTrips([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [activeTab]);

  /* Scroll helpers */
  const scroll = useCallback((dir) => {
    scrollRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  }, []);

  /* Render helpers */
  const renderSkeletons = () => (
    <div className={styles.loadingWrap}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.skeleton} />
      ))}
    </div>
  );

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.heading}>Trending Destinations</h2>

          <div className={styles.toggle}>
            <button
              className={`${styles.toggleBtn} ${activeTab === "international" ? styles.toggleBtnActive : ""}`}
              onClick={() => setActiveTab("international")}
            >
              International
            </button>
            <button
              className={`${styles.toggleBtn} ${activeTab === "domestic" ? styles.toggleBtnActive : ""}`}
              onClick={() => setActiveTab("domestic")}
            >
              Domestic
            </button>
          </div>
        </div>

        {/* Carousel */}
        {loading ? (
          renderSkeletons()
        ) : trips.length === 0 ? (
          <div className={styles.emptyState}>
            No {activeTab === "international" ? "international" : "domestic"} destinations found yet.
          </div>
        ) : (
          <div className={styles.carouselWrap}>
            <button className={`${styles.arrowBtn} ${styles.arrowLeft}`} onClick={() => scroll(-1)} aria-label="Scroll left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>

            <div className={styles.carousel} ref={scrollRef}>
              {trips.map((trip, idx) => (
                <div
                  key={trip.id}
                  className={styles.card}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/trips/${trip.id}`)}
                >
                  <img
                    src={getImgUrl(trip.image)}
                    alt={trip.title}
                    className={styles.cardImage}
                    loading="lazy"
                  />
                  <div className={styles.cardOverlay} />
                  <div
                    className={styles.cardTint}
                    style={{ background: `linear-gradient(180deg, ${TINT_COLORS[idx % TINT_COLORS.length]} 0%, transparent 100%)` }}
                  />
                  <span className={styles.cardName}>{trip.country || trip.state || trip.location || trip.title}</span>
                </div>
              ))}
            </div>

            <button className={`${styles.arrowBtn} ${styles.arrowRight}`} onClick={() => scroll(1)} aria-label="Scroll right">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        )}

        {/* CTA */}
        <div className={styles.ctaWrap}>
          <button className={styles.ctaBtn} onClick={() => navigate("/international-trips")}>
            Explore Now
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
};
