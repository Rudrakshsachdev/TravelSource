import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchIndiaTrips } from "../../services/api";
import styles from "./IndiaTrips.module.css";

const IndiaTrips = () => {
  const [trips, setTrips] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const navigate = useNavigate();

  // Fetch data from backend
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchIndiaTrips();
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
      { threshold: 0.08 },
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
      {/* Cinematic background layers */}
      <div className={styles.bgDecor}>
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />
        <div className={styles.bgOrb3} />
        <div className={styles.bgMesh} />
        <div className={styles.bgLine} />
        <div className={styles.bgLine2} />
      </div>

      {/* Decorative top border accent */}
      <div className={styles.topAccent} />

      {/* Section header */}
      <div className={styles.header}>
        <div className={styles.labelRow}>
          <span className={styles.labelLine} />
          <span className={styles.label}>
            <span className={styles.labelDot} />
            India Collection
          </span>
          <span className={styles.labelLine} />
        </div>
        <h2 className={styles.title}>
          {config.title || "Explore India Trips"}
        </h2>
        {config.subtitle && (
          <p className={styles.subtitle}>{config.subtitle}</p>
        )}
        <div className={styles.headerUnderline}>
          <span className={styles.underlineDot} />
        </div>
      </div>

      {/* Scrolling track */}
      <div
        className={styles.trackWrapper}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Deep gradient edge fades */}
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
              className={`${styles.card} ${activeCard === `${trip.id}-${i}` ? styles.cardActive : ""}`}
              onClick={() => navigate(`/trips/${trip.id}`)}
              onMouseEnter={() => setActiveCard(`${trip.id}-${i}`)}
              onMouseLeave={() => setActiveCard(null)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/trips/${trip.id}`)
              }
            >
              {/* Glow ring on hover */}
              <div className={styles.cardGlow} />

              {/* Image container */}
              <div className={styles.cardImageWrap}>
                <img
                  src={trip.image}
                  alt={trip.title}
                  className={styles.cardImage}
                  loading="lazy"
                  decoding="async"
                />
                {/* Multi-layer overlay */}
                <div className={styles.cardOverlay} />
                <div className={styles.cardOverlayVignette} />

                {/* State / Region badge */}
                {trip.state && (
                  <span className={styles.stateBadge}>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {trip.state}
                  </span>
                )}

                {/* Duration pill on image */}
                {trip.duration_days && (
                  <span className={styles.durationPill}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {trip.duration_days} Days
                  </span>
                )}

                {/* Price tag — floating bottom-right */}
                <div className={styles.priceWrap}>
                  <span className={styles.priceFrom}>from</span>
                  <span className={styles.priceAmount}>
                    {formatPrice(trip.price)}
                  </span>
                </div>

                {/* Bottom image content overlay */}
                <div className={styles.imageContent}>
                  <h3 className={styles.cardTitle}>{trip.title}</h3>
                  <div className={styles.cardLocation}>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {trip.location}
                    {trip.state ? `, ${trip.state}` : ""}
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className={styles.cardBody}>
                {trip.short_description && (
                  <p className={styles.cardDesc}>{trip.short_description}</p>
                )}
                <div className={styles.cardFooter}>
                  <span className={styles.cardCta}>
                    Explore Trip
                    <svg
                      width="15"
                      height="15"
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
                  <span className={styles.cardDivider} />
                  <span className={styles.cardPriceSmall}>
                    {formatPrice(trip.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className={styles.bottomWave}>
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60V30C240 5 480 0 720 10C960 20 1200 45 1440 30V60H0Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
};

export default IndiaTrips;
