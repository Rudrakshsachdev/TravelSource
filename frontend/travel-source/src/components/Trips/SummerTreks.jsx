import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchSummerTrips } from "../../services/api";
import styles from "./SummerTreks.module.css";

/* ── Tiny SVG icon components (Matched with India Trips) ─────── */

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

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
);

const ArrowIcon = ({ direction }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {direction === "left"
      ? <polyline points="15 18 9 12 15 6" />
      : <polyline points="9 18 15 12 9 6" />}
  </svg>
);

/* ── Skeleton card for loading state ────────────────────────── */

const SkeletonCard = () => (
  <div className={styles.skelCard}>
    <div className={styles.skelShimmer} />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   Summer Getaways Homepage Section
   (Layout matched with India Trips)
   ═══════════════════════════════════════════════════════════════ */

const SummerTreks = () => {
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
        const data = await fetchSummerTrips();
        if (data.config?.is_enabled && data.trips.length > 0) {
          setConfig(data.config);
          setTrips(data.trips);
        }
      } catch { /* section won't render */ }
      finally { setLoading(false); }
    })();
  }, []);

  /* ── Intersection observer ───────────────────────────────────── */
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

  /* ── Scroll handling ────────────────────────────────────────── */
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

  if (loading) {
    return (
      <section className={styles.section} ref={sectionRef}>
        <div className={styles.inner}>
          <div className={styles.skelHeader} />
          <div className={styles.scrollArea}>
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  if (!config?.is_enabled || trips.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
    >
      <div className={styles.topAccent} />

      <div className={styles.inner}>
        {/* Header row matched with India Trips */}
        <div className={styles.headerRow}>
          <div className={styles.headerArea}>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              Summer Collection
            </span>
            <h2 className={styles.heading}>
              {config.title || "Summer Getaways"}
            </h2>
            {config.subtitle && (
              <p className={styles.subheading}>{config.subtitle}</p>
            )}
          </div>

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
            <Link to="/summer-getaways" className={styles.viewAllBtn}>
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </div>

        <div className={styles.scrollWrap}>
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
                <div className={styles.imgWrap}>
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className={styles.img}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className={styles.gradientTop} />
                <div className={styles.gradientBot} />

                {trip.is_featured && (
                  <span className={styles.badge}>Best Seller</span>
                )}

                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{trip.title}</h3>

                  <span className={styles.locChip}>
                    <PinIcon />
                    {trip.location || "Seasonal Escape"}
                  </span>

                  <div className={styles.metaStrip}>
                    <span className={styles.metaTag}>
                      <ClockIcon />
                      {trip.duration_days
                        ? `${trip.duration_days} Days${trip.duration_nights > 0 ? " / " + trip.duration_nights + " Nights" : ""}`
                        : "4N/5D"}
                    </span>

                    <span className={styles.metaDot} />

                    <span className={styles.metaTag}>
                      <CalendarIcon />
                      Apr – Jun
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
        </div>
      </div>
    </section>
  );
};

export default SummerTreks;
