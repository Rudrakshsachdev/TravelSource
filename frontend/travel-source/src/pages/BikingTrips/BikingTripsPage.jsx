import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllBikingTrips } from "../../services/api";
import styles from "./BikingTripsPage.module.css";

/* ── Tiny SVG icon components ────────────────────────────────── */

const StarIcon = () => (
  <svg viewBox="0 0 24 24" className={styles.starSvg} aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const PinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

const BikeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
  </svg>
);

/* ── Skeleton card for loading state ────────────────────────── */

const SkeletonCard = () => (
  <div className={styles.skelCard}>
    <div className={styles.skelShimmer} />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   Biking Expeditions Full Page Component
   ═══════════════════════════════════════════════════════════════ */

const BikingTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const data = await fetchAllBikingTrips();
        setTrips(data);
      } catch (err) {
        setError(err.message || "Failed to load Biking trips.");
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
      <div className={styles.topAccent} />

      <div className={styles.inner}>
        <header className={styles.pageHeader}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Biking Collection
          </span>
          <h1 className={styles.heading}>Biking Expeditions</h1>
          <p className={styles.subheading}>
            Master the winding roads and mountain passes. From the Leh-Manali highway to the coastal roads of South India, 
            embark on a journey where the destination is just an excuse for the ride.
          </p>
        </header>

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
            <h2>No biking expeditions available right now.</h2>
            <p>Gear up! We are preparing some epic new routes for you.</p>
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
                <div className={styles.imgWrap}>
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className={styles.img}
                    loading="lazy"
                  />
                </div>

                <div className={styles.gradientTop} />
                <div className={styles.gradientBot} />

                {trip.is_featured && (
                  <span className={styles.badge}>Expedition</span>
                )}

                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{trip.title}</h3>

                  <span className={styles.locChip}>
                    <PinIcon />
                    {trip.location || "North India"}
                  </span>

                  <div className={styles.metaStrip}>
                    <span className={styles.metaTag}>
                      <ClockIcon />
                      {trip.duration_days
                        ? `${trip.duration_days} Days / ${trip.duration_nights} Nights`
                        : "Long Ride"}
                    </span>

                    <span className={styles.metaDot} />

                    <span className={styles.metaTag}>
                      <BikeIcon />
                      Pro Series
                    </span>
                  </div>

                  <div className={styles.cardFoot}>
                    <span className={styles.price}>{fmt(trip.price)}</span>

                    <span className={styles.stars}>
                      <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                      <span className={styles.reviewCount}>(Premium)</span>
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

export default BikingTripsPage;
