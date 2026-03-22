import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllHimachalTrips } from "../../services/api";
import styles from "./HimachalTripsPage.module.css";

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

/* ═══════════════════════════════════════════════════════════════
   Himachal Trips Full Page Component
   ═══════════════════════════════════════════════════════════════ */

const HimachalTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    (async () => {
      try {
        const data = await fetchAllHimachalTrips();
        setTrips(data);
      } catch (err) {
        setError(err.message || "Failed to load Himachal trips.");
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
      {/* Decorative top accent */}
      <div className={styles.topAccent} />

      <div className={styles.inner}>
        {/* Page Header */}
        <header className={styles.pageHeader}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Himachal Pradesh
          </span>
          <h1 className={styles.heading}>Explore the Abode of Snow</h1>
          <p className={styles.subheading}>
            Discover the majestic valleys, serene monasteries, and towering peaks of Himachal Pradesh.
            Curated trips for the perfect mountain escape.
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
            <h2>No trips available right now.</h2>
            <p>Please check back later for new exclusive destinations in Himachal!</p>
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
                  <span className={styles.badge}>Featured</span>
                )}

                {/* Content overlay */}
                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{trip.title}</h3>

                  <span className={styles.locChip}>
                    <PinIcon />
                    {trip.location || "Himachal Pradesh"}
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
                      All Year
                    </span>
                  </div>

                  <div className={styles.cardFoot}>
                    <span className={styles.price}>{fmt(trip.price)}</span>

                    <span className={styles.stars}>
                      <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                      <span className={styles.reviewCount}>(Best rated)</span>
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

export default HimachalTripsPage;
