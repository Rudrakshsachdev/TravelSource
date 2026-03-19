import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchHoneymoonTrips } from "../../services/api";
import styles from "./HoneymoonTrips.module.css";

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

const HeartOutlineIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
);

const ArrowIcon = ({ direction }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {direction === "left"
      ? <polyline points="15 18 9 12 15 6" />
      : <polyline points="9 18 15 12 9 6" />}
  </svg>
);

/* ── Animated heart particle (Retained from orginal design) ── */
const HeartParticle = ({ delay, left, size, duration }) => (
  <svg
      style={{
          position: "absolute",
          left: `${left}%`,
          top: "-5%",
          width: `${size}px`,
          height: `${size}px`,
          opacity: 0,
          animation: `heart-float ${duration}s ease-in ${delay}s infinite`,
          pointerEvents: "none",
          fill: "rgba(232, 62, 140, 0.4)", /* Romantic pink matching new UI */
      }}
      viewBox="0 0 24 24"
  >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      <style>{`
    @keyframes heart-float {
      0% { transform: translateY(0) scale(0.8); opacity: 0; }
      10% { opacity: 0.5; }
      50% { transform: translateY(-40vh) scale(1) translateX(15px); }
      90% { opacity: 0.2; }
      100% { transform: translateY(-80vh) scale(0.6) translateX(-10px); opacity: 0; }
    }
  `}</style>
  </svg>
);

/* ── Skeleton card for loading state ────────────────────────── */

const SkeletonCard = () => (
  <div className={styles.skelCard}>
    <div className={styles.skelShimmer} />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════ */

const HoneymoonTrips = () => {
  const [trips, setTrips] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  /* ── Data fetching ──────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchHoneymoonTrips();
        if (data.config?.is_enabled && data.trips.length > 0) {
          setConfig(data.config);
          setTrips(data.trips);
        }
      } catch { /* section won't render */ }
      finally { setLoading(false); }
    })();
  }, []);

  /* ── Generate floating hearts ───────────────────────────────── */
  const hearts = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        delay: Math.random() * 8,
        left: Math.random() * 100,
        size: 10 + Math.random() * 14,
        duration: 6 + Math.random() * 6,
    }));
  }, []);

  /* ── Intersection observer for entrance animation ───────────── */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true); },
      { threshold: 0.08 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [loading]);

  /* ── Scroll state tracking ──────────────────────────────────── */
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [trips, updateScrollState]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -360 : 360,
      behavior: "smooth",
    });
  };

  /* ── Formatting ─────────────────────────────────────────────── */
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

  /* ── Loading skeleton ───────────────────────────────────────── */
  if (loading) {
    return (
      <section className={styles.section} ref={sectionRef}>
        <div className={styles.inner}>
          <div className={styles.headerArea}>
            <div className={styles.skelBar} style={{ width: 180, height: 12 }} />
            <div className={styles.skelBar} style={{ width: 300, height: 32, marginTop: 12 }} />
            <div className={styles.skelBar} style={{ width: 240, height: 14, marginTop: 10 }} />
          </div>
          <div className={styles.scrollArea}>
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  if (!config?.is_enabled || trips.length === 0) return null;

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
    >
      {/* Retained Romantic floating particles */}
      <div className={styles.particlesContainer}>
          {hearts.map((h) => (
              <HeartParticle key={h.id} {...h} />
          ))}
      </div>

      {/* Decorative top romantic accent */}
      <div className={styles.topAccent} />

      <div className={styles.inner}>
        {/* ── Header row ─────────────────────────────────────── */}
        <div className={styles.headerRow}>
          <div className={styles.headerArea}>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              Honeymoon Collection
            </span>
            <h2 className={styles.heading}>
              {config.title || "Romantic Escapes"}
            </h2>
            {config.subtitle && (
              <p className={styles.subheading}>{config.subtitle}</p>
            )}
          </div>

          {/* Navigation */}
          <div className={styles.navGroup}>
            <button
              className={`${styles.navBtn} ${!canScrollLeft ? styles.navBtnDisabled : ""}`}
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              className={`${styles.navBtn} ${!canScrollRight ? styles.navBtnDisabled : ""}`}
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <ArrowIcon direction="right" />
            </button>
            <Link to="/honeymoon-trips" className={styles.viewAllBtn}>
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </div>

        {/* ── Scroll container ───────────────────────────────── */}
        <div className={styles.scrollWrap}>
          {/* Edge fades */}
          {canScrollLeft && <div className={styles.fadeLt} />}
          {canScrollRight && <div className={styles.fadeRt} />}

          <div className={styles.scrollArea} ref={scrollRef}>
            {trips.map((trip) => (
              <article
                key={trip.id}
                className={styles.card}
                onClick={() => navigate(`/trips/${trip.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/trips/${trip.id}`)}
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
                  <span className={styles.badge}>Dreamy</span>
                )}

                {/* Content overlay */}
                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{trip.title}</h3>

                  <span className={styles.locChip}>
                    <PinIcon />
                    {trip.location || "Multiple Destinations"}
                    {trip.state ? `, ${trip.state}` : ""}
                  </span>

                  <div className={styles.metaStrip}>
                    <span className={styles.metaTag}>
                      <ClockIcon />
                      {trip.duration_days
                        ? `${trip.duration_days} Days${trip.duration_nights > 0 ? " / " + trip.duration_nights + " Nights" : ""}`
                        : "Romantic"}
                    </span>

                    <span className={styles.metaDot} />

                    <span className={styles.metaTag}>
                      <HeartOutlineIcon />
                      Couples Only
                    </span>
                  </div>

                  <div className={styles.cardFoot}>
                    <span className={styles.price}>{fmt(trip.price)}</span>

                    <span className={styles.stars}>
                      <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                      <span className={styles.reviewCount}>(Couples)</span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HoneymoonTrips;
