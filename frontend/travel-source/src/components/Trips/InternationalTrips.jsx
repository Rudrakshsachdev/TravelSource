import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchInternationalTrips } from "../../services/api";
import styles from "./InternationalTrips.module.css";

const InternationalTrips = () => {
  const [trips, setTrips] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const navigate = useNavigate();

  // Fetch data from backend
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchInternationalTrips();
        if (data.config && data.config.is_enabled && data.trips.length > 0) {
          setConfig(data.config);
          setTrips(data.trips);
        }
      } catch {
        // Silently fail — section just won't render
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // IntersectionObserver for entrance animation
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loading]);

  // Format price in INR
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }, []);

  // Don't render if disabled, loading, or no trips
  if (loading || !config || !config.is_enabled || trips.length === 0) {
    return null;
  }

  // Animation speed from backend config (default 60s)
  const scrollSpeed = config.scroll_speed || 60;

  // Duplicate trips for seamless infinite loop
  const displayTrips = [...trips, ...trips];

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
    >
      {/* Subtle background decoration */}
      <div className={styles.bgDecor}>
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />
        <div className={styles.bgLine} />
      </div>

      {/* Section header */}
      <div className={styles.header}>
        <span className={styles.label}>
          <span className={styles.labelDot} />
          International Collection
        </span>
        <h2 className={styles.title}>
          {config.title || "Explore International Trips"}
        </h2>
        {config.subtitle && (
          <p className={styles.subtitle}>{config.subtitle}</p>
        )}
      </div>

      {/* Scrolling track */}
      <div
        className={styles.trackWrapper}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient edge fades */}
        <div className={styles.edgeFadeLeft} />
        <div className={styles.edgeFadeRight} />

        <div
          ref={trackRef}
          className={styles.track}
          style={{
            animationDuration: `${scrollSpeed}s`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {displayTrips.map((trip, i) => (
            <div
              key={`${trip.id}-${i}`}
              className={styles.card}
              onClick={() => navigate(`/trips/${trip.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/trips/${trip.id}`)
              }
            >
              {/* Image */}
              <div className={styles.cardImageWrap}>
                <img
                  src={trip.image}
                  alt={trip.title}
                  className={styles.cardImage}
                  loading="lazy"
                  decoding="async"
                />
                {/* Overlay gradient */}
                <div className={styles.cardOverlay} />

                {/* Country badge */}
                {trip.country && (
                  <span className={styles.countryBadge}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    {trip.country}
                  </span>
                )}

                {/* Price tag */}
                <span className={styles.priceTag}>
                  {formatPrice(trip.price)}
                  {trip.duration_days && (
                    <span className={styles.priceDuration}>
                      / {trip.duration_days}D
                    </span>
                  )}
                </span>
              </div>

              {/* Card content */}
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{trip.title}</h3>
                {trip.short_description && (
                  <p className={styles.cardDesc}>{trip.short_description}</p>
                )}
                <span className={styles.cardCta}>
                  Explore
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InternationalTrips;
