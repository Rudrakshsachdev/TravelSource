import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllFestivalTrips } from "../../services/api";
import styles from "./FestivalTripsPage.module.css";

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

const SunIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
);

/* ── Skeleton card for loading state ────────────────────────── */

const SkeletonCard = () => (
  <div className={styles.skelCard}>
    <div className={styles.skelShimmer} />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   Festival Trips Full Page Component
   ═══════════════════════════════════════════════════════════════ */

const FestivalTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    (async () => {
      try {
        const data = await fetchAllFestivalTrips();
        setTrips(data);
      } catch (err) {
        setError(err.message || "Failed to load Festival excursions.");
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
    <div className={styles.pageContainer}>
      {/* Decorative top vibrant accent */}
      <div className={styles.topAccent} />

      <div className={styles.inner}>
        {/* Page Header */}
        <header className={styles.pageHeader}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Festival Collection
          </span>
          <h1 className={styles.heading}>Celebrate the Extraordinary</h1>
          <p className={styles.subheading}>
            Immerse yourself in vibrant cultures, stunning celebrations, and world-class 
            festivals. Handpicked experiences for the festive traveler.
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
            <h2>No festival getaways available right now.</h2>
            <p>Please check back later for upcoming celebrations!</p>
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
                  <span className={styles.badge}>Dazzling</span>
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
                        ? `${trip.duration_days - 1}N/${trip.duration_days}D`
                        : "Festive"}
                    </span>

                    <span className={styles.metaDot} />

                    <span className={styles.metaTag}>
                      <SunIcon />
                      Celebration
                    </span>
                  </div>

                  <div className={styles.cardFoot}>
                    <span className={styles.price}>{fmt(trip.price)}</span>

                    <span className={styles.stars}>
                      <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                      <span className={styles.reviewCount}>(Festivals)</span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FestivalTripsPage;
