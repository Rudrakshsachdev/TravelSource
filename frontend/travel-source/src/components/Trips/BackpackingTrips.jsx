import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchBackpackingTrips } from "../../services/api";
import styles from "./BackpackingTrips.module.css";

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

const BackpackIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.5 8.5C5.5 5.5 8 3 12 3c4 0 6.5 2.5 6.5 5.5v12a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-12z" />
      <path d="M9 3v2" />
      <path d="M15 3v2" />
      <path d="M9 14h6" />
      <path d="M9 18h6" />
      <path d="M3 10v10" />
      <path d="M21 10v10" />
    </svg>
  );

const ArrowIcon = ({ direction }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {direction === "left"
      ? <polyline points="15 18 9 12 15 6" />
      : <polyline points="9 18 15 12 9 6" />}
  </svg>
);

/* ── Animated Leaf particle (Retained from orginal design) ── */
const Leaf = ({ delay, left, size, duration, rotation }) => (
    <svg
        style={{
            position: "absolute",
            left: `${left}%`,
            top: "-5%",
            width: `${size}px`,
            height: `${size}px`,
            opacity: 0,
            animation: `leaf-drift ${duration}s ease-in-out ${delay}s infinite`,
            pointerEvents: "none",
            fill: "rgba(56, 239, 125, 0.25)", /* Nature green matching new UI */
            transform: `rotate(${rotation}deg)`,
        }}
        viewBox="0 0 24 24"
    >
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L7 18.66C10.87 20.44 15.31 21 20 18c2-3.5 1-8.5-3-10z" />
        <style>{`
      @keyframes leaf-drift {
        0% { transform: translateY(0) rotate(0deg); opacity: 0; }
        10% { opacity: 0.4; }
        50% { transform: translateY(40vh) rotate(180deg) translateX(30px); }
        90% { opacity: 0.2; }
        100% { transform: translateY(80vh) rotate(360deg) translateX(-15px); opacity: 0; }
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

const BackpackingTrips = () => {
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
        const data = await fetchBackpackingTrips();
        if (data.config?.is_enabled && data.trips.length > 0) {
          setConfig(data.config);
          setTrips(data.trips);
        }
      } catch { /* section won't render */ }
      finally { setLoading(false); }
    })();
  }, []);

  /* ── Generate floating leaves ───────────────────────────────── */
  const leaves = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        delay: Math.random() * 10,
        left: Math.random() * 100,
        size: 14 + Math.random() * 10,
        duration: 8 + Math.random() * 8,
        rotation: Math.random() * 360,
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
      {/* Retained Nature floating leaves */}
      <div className={styles.particlesContainer}>
          {leaves.map((l) => (
              <Leaf key={l.id} {...l} />
          ))}
      </div>

      {/* Decorative top adventurous accent */}
      <div className={styles.topAccent} />

      <div className={styles.inner}>
        {/* ── Header row ─────────────────────────────────────── */}
        <div className={styles.headerRow}>
          <div className={styles.headerArea}>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
               Backpacking Collection
            </span>
            <h2 className={styles.heading}>
              {config.title || "Epic Adventures"}
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
            <Link to="/backpacking-trips" className={styles.viewAllBtn}>
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
                  <span className={styles.badge}>Wild</span>
                )}

                {/* Content overlay */}
                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{trip.title}</h3>

                  <span className={styles.locChip}>
                    <PinIcon />
                    {trip.location || "Multiple Trails"}
                    {trip.state ? `, ${trip.state}` : ""}
                  </span>

                  <div className={styles.metaStrip}>
                    <span className={styles.metaTag}>
                      <ClockIcon />
                      {trip.duration_days
                        ? `${trip.duration_days - 1}N/${trip.duration_days}D`
                        : "Multi-day"}
                    </span>

                    <span className={styles.metaDot} />

                    <span className={styles.metaTag}>
                      <BackpackIcon />
                      Action
                    </span>
                  </div>

                  <div className={styles.cardFoot}>
                    <span className={styles.price}>{fmt(trip.price)}</span>

                    <span className={styles.stars}>
                      <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                      <span className={styles.reviewCount}>(Explore)</span>
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

export default BackpackingTrips;
