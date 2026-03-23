/* ═══════════════════════════════════════════════════════════════
   TripsList — Orchestrator
   Composes all modular trip components into one page.
   ═══════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { fetchTrips, fetchFeaturedTrips } from "../../services/api";
import styles from "./TripsList.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import usePersonalization from "../../hooks/usePersonalization";

// Showcase section components
import PanoramaBanner from "./PanoramaBanner";
import ModernHero from "./ModernHero";
import HeroCards from "./HeroCards";
import InternationalTrips from "./InternationalTrips";
import IndiaTrips from "./IndiaTrips";
import HimachalTrips from "./HimachalTrips";
import UttarakhandTrips from "./UttarakhandTrips";
import NorthIndiaTrips from "./NorthIndiaTrips";
import HoneymoonTrips from "./HoneymoonTrips";
import HimalayanTreks from "./HimalayanTreks";
import BackpackingTrips from "./BackpackingTrips";
import SummerTreks from "./SummerTreks";
import MonsoonTreks from "./MonsoonTreks";
import CommunityTrips from "./CommunityTrips";
import FestivalTrips from "./FestivalTrips";
import AdventureTrips from "./AdventureTrips";
import LongWeekendTrips from "./LongWeekendTrips";
import CategoryNav from "./CategoryNav";
import AnimatedMap from "../AnimatedMap/AnimatedMap";
import PersonalizationSection from "./PersonalizationSection";
import { PopularDestinations } from "../PopularDestinations";

// Extracted modular components
import TripsLoadingState from "./TripsLoadingState";
import TripsErrorState from "./TripsErrorState";
import TripsSearchBar from "./TripsSearchBar";
import TripsGrid from "./TripsGrid";
import FeaturedShowcase from "./FeaturedShowcase";

// Search utilities
import {
  SEARCH_STOP_WORDS,
  MONTH_ALIASES,
  normalizeSearchText,
  getTokenVariants,
  buildTripSearchBlob,
  tripMatchesType,
} from "./searchUtils";

const TripsList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState(null);
  const tripsPerPage = 6;

  const {
    interests,
    setInterests,
    recommended,
    recentlyViewed,
    loadingRec,
    recordView,
  } = usePersonalization(trips);

  const urlSearchQuery = searchParams.get("search") || "";
  const urlDestinationFilter = normalizeSearchText(
    searchParams.get("destination") || "",
  );
  const urlTripTypeFilter = normalizeSearchText(
    searchParams.get("tripType") || "",
  );
  const urlMonthFilter = normalizeSearchText(searchParams.get("month") || "");

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
    setCurrentPage(1);
  }, [urlSearchQuery, urlDestinationFilter, urlTripTypeFilter, urlMonthFilter]);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        if (!activeCategory) {
          setLoading(true);
        }
        const data = await fetchTrips(activeCategory);
        setTrips(data);
      } catch {
        setError("Unable to load trips.");
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, [activeCategory]);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await fetchFeaturedTrips();
        setFeaturedTrips(data);
      } catch {
        // silently fail — section just won't show
      } finally {
        setFeaturedLoading(false);
      }
    };
    loadFeatured();
  }, []);

  const handleCategoryChange = (slug) => {
    setActiveCategory(slug);
    setCurrentPage(1);
    setTimeout(() => {
      const tripsSection = document.getElementById("trips-grid");
      if (tripsSection) {
        tripsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // ── Filter and sort trips ──
  const filteredTrips = trips.filter((trip) => {
    const searchBlob = buildTripSearchBlob(trip);

    if (searchQuery) {
      const normalizedQuery = normalizeSearchText(searchQuery);
      if (!normalizedQuery) return true;

      const queryTokens = normalizedQuery
        .split(" ")
        .filter((token) => token && !SEARCH_STOP_WORDS.has(token));

      const effectiveTokens = queryTokens.length
        ? queryTokens
        : normalizedQuery.split(" ").filter(Boolean);

      const matchesTextSearch = effectiveTokens.every((token) =>
        getTokenVariants(token).some((variant) =>
          searchBlob.includes(variant),
        ),
      );

      if (!matchesTextSearch) return false;
    }

    if (urlDestinationFilter && !searchBlob.includes(urlDestinationFilter))
      return false;

    if (
      urlTripTypeFilter &&
      !tripMatchesType(trip, urlTripTypeFilter, searchBlob)
    )
      return false;

    if (urlMonthFilter) {
      const monthTokens = MONTH_ALIASES[urlMonthFilter] || [urlMonthFilter];
      const monthMatched = monthTokens.some((token) =>
        searchBlob.includes(token),
      );
      if (!monthMatched) return false;
    }

    return true;
  });

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "duration-long":
        return b.duration_days - a.duration_days;
      case "duration-short":
        return a.duration_days - b.duration_days;
      default:
        return 0;
    }
  });

  // ── Pagination ──
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = sortedTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(sortedTrips.length / tripsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);

    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set("search", value.trim());
    } else {
      nextParams.delete("search");
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("search");
    setSearchParams(nextParams, { replace: true });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveFilter("all");
    setSortBy("featured");
    setCurrentPage(1);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("search");
    nextParams.delete("destination");
    nextParams.delete("tripType");
    nextParams.delete("month");
    setSearchParams(nextParams, { replace: true });
  };

  // ── Early returns for loading / error ──
  if (loading) return <TripsLoadingState />;
  if (error) return <TripsErrorState />;

  return (
    <div id="trips" className={styles.luxuryTripsPage}>
      {/* Ambient Background */}
      <div className={styles.luxuryBackground}>
        <div className={styles.backgroundGlow}></div>
        <div className={styles.backgroundGrid}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.orbitRing}></div>
        <div className={styles.orbitRing}></div>
      </div>

      {/* Hero & Showcases */}
      <PanoramaBanner />
      <ModernHero />
      <HeroCards />
      <PopularDestinations />
      <CategoryNav onCategoryChange={handleCategoryChange} />
      <InternationalTrips />
      <IndiaTrips />
      <HimachalTrips />
      <UttarakhandTrips />
      <HoneymoonTrips />
      <HimalayanTreks />
      <BackpackingTrips />
      <SummerTreks />
      <MonsoonTreks />
      <CommunityTrips />
      <FestivalTrips />
      <AdventureTrips />
      <LongWeekendTrips />
      <NorthIndiaTrips />
      <AnimatedMap />

      {/* Search & Filter */}
      <TripsSearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onSearchClear={handleSearchClear}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onClearAll={clearFilters}
      />

      {/* Trip Cards Grid + Pagination */}
      <TripsGrid
        sortedTrips={sortedTrips}
        currentTrips={currentTrips}
        currentPage={currentPage}
        totalPages={totalPages}
        indexOfFirstTrip={indexOfFirstTrip}
        indexOfLastTrip={indexOfLastTrip}
        onPageChange={handlePageChange}
        searchQuery={searchQuery}
        onClearFilters={clearFilters}
        recordView={recordView}
      />

      {/* Personalization Section */}
      {sortedTrips.length > 0 && (
        <div className={styles.personalizationWrapper}>
          <PersonalizationSection
            interests={interests}
            setInterests={setInterests}
            recommended={recommended}
            recentlyViewed={recentlyViewed}
            loadingRec={loadingRec}
            recordView={recordView}
          />
        </div>
      )}

      {/* Featured Showcase + Stats */}
      {sortedTrips.length > 0 && (
        <div className={styles.featuredWrapper}>
          <FeaturedShowcase
            featuredTrips={featuredTrips}
            featuredLoading={featuredLoading}
          />
        </div>
      )}

      {/* Floating CTA */}
      <div className={styles.floatingCTA}>
        <button className={styles.floatingButton}>
          <span className={styles.floatingIcon}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className={styles.floatingText}>Create Custom Journey</span>
        </button>
      </div>
    </div>
  );
};

export default TripsList;
