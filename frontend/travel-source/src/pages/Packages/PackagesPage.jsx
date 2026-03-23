import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTrips } from "../../services/api";
import styles from "./PackagesPage.module.css";

import InternationalTrips from "../../components/Trips/InternationalTrips";
import HimalayanTreks from "../../components/Trips/HimalayanTreks";
import FestivalTrips from "../../components/Trips/FestivalTrips";
import CommunityTrips from "../../components/Trips/CommunityTrips";

import { PopularDestinations } from "../../components/PopularDestinations/PopularDestinations";
import { NightAdventure } from "../../components/NightAdventure/NightAdventure";



/* ── Tiny SVG icon components ────────────────────────────────── */

const StarIcon = () => (
  <svg viewBox="0 0 24 24" className={styles.starSvg}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const PinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
);

/* ── Skeleton card for loading state ────────────────────────── */

const SkeletonCard = () => (
  <div className={styles.skelCard}>
    <div className={styles.skelShimmer} />
  </div>
);

const PackagesPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    (async () => {
      try {
        const data = await fetchTrips();
        setTrips(data);
      } catch (err) {
        setError(err.message || "Failed to load packages.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmt = useCallback(
    (p) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(p),
    [],
  );

  return (
    <main style={{ backgroundColor: "#f8fafb", minHeight: "100vh" }}>
      <div className={styles.pageContainer}>
        {/* Decorative top accent */}
        <div className={styles.topAccent} />

        <div className={styles.inner}>
          {/* Page Header */}
          <header className={styles.pageHeader}>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              Exclusive Collections
            </span>
            <h1 className={styles.heading}>All Travel Packages</h1>
            <p className={styles.subheading}>
              Hand-crafted journeys designed for unforgettable experiences. 
              Choose your theme and start exploring all our curated destinations.
            </p>
          </header>

          {/* Content */}
          {loading ? (
            <div className={styles.grid}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <h2>Oops! Something went wrong.</h2>
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className={styles.retryBtn}>
                Try Again
              </button>
            </div>
          ) : trips.length === 0 ? (
            <div className={styles.emptyState}>
              <h2>No packages available right now.</h2>
              <p>Please check back later for new exclusive collections!</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {trips.map((trip, idx) => (
                <article
                  key={trip.id}
                  className={styles.card}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/trips/${trip.id}`)}
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  {/* Full-cover image */}
                  <div className={styles.imgWrap}>
                    <img
                      src={trip.image}
                      alt={trip.title}
                      className={styles.img}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* Gradient layers */}
                  <div className={styles.gradientTop} />
                  <div className={styles.gradientBot} />

                  {/* Badge */}
                  {trip.is_featured && (
                    <span className={styles.badge}>Best Seller</span>
                  )}

                  {/* Content overlay */}
                  <div className={styles.content}>
                    <h3 className={styles.cardTitle}>{trip.title}</h3>

                    <span className={styles.locChip}>
                      <PinIcon />
                      {trip.location || "Multiple Destinations"}
                    </span>

                    <div className={styles.metaStrip}>
                      <span className={styles.metaTag}>
                        <ClockIcon />
                        {trip.duration_days
                          ? `${trip.duration_days} Days${trip.duration_nights > 0 ? " / " + trip.duration_nights + " Nights" : ""}`
                          : "6N/7D"}
                      </span>

                      <span className={styles.metaDot} />

                      <span className={styles.metaTag}>
                        <CalendarIcon />
                        Flexible
                      </span>
                    </div>

                    <div className={styles.cardFoot}>
                      <span className={styles.price}>{fmt(trip.price)}</span>

                      <span className={styles.stars}>
                        <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                        <span className={styles.reviewCount}>(10k+)</span>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      

      {/* Categories Row Sections */}
      <div style={{ paddingBottom: "100px" }}>
        <InternationalTrips />
        <HimalayanTreks />
        <FestivalTrips />
        <CommunityTrips />
      </div>

      {/* Curated Highlight Sections */}
      <div>
        <PopularDestinations />
        <NightAdventure />
      </div>
    </main>
  );
};


export default PackagesPage;
