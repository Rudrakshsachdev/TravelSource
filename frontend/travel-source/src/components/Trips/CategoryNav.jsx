import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./CategoryNav.module.css";

/* ── Static category data (frontend-only for now) ── */
const CATEGORIES = [
  {
    id: 1,
    name: "Early Bird",
    slug: "early-bird",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&h=200&fit=crop",
    gradStart: "#28a745",
    gradEnd: "#20c997",
    emoji: "🌅",
  },
  {
    id: 2,
    name: "Long Weekend",
    slug: "long-weekend",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop",
    gradStart: "#6f42c1",
    gradEnd: "#e83e8c",
    emoji: "🏖️",
  },
  {
    id: 3,
    name: "International",
    slug: "international",
    image:
      "https://images.unsplash.com/photo-1488646472447-360ad2c0e3b6?w=200&h=200&fit=crop",
    gradStart: "#9b59b6",
    gradEnd: "#e74c8b",
    emoji: "🌍",
  },
  {
    id: 4,
    name: "New Launches",
    slug: "new-launches",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200&h=200&fit=crop",
    gradStart: "#3f9e8f",
    gradEnd: "#7ecfc0",
    emoji: "🚀",
  },
  {
    id: 5,
    name: "Treks",
    slug: "treks",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop",
    gradStart: "#e8913a",
    gradEnd: "#e74c3c",
    emoji: "🏔️",
  },
  {
    id: 6,
    name: "Biking",
    slug: "biking",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop",
    gradStart: "#3f9e8f",
    gradEnd: "#2ecc71",
    emoji: "🏍️",
  },
  {
    id: 7,
    name: "Ladakh",
    slug: "ladakh",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=200&h=200&fit=crop",
    gradStart: "#e83e8c",
    gradEnd: "#fd7e14",
    emoji: "🗻",
  },
  {
    id: 8,
    name: "Spiti",
    slug: "spiti",
    image:
      "https://images.unsplash.com/photo-1626714100232-dfc3e8a4d108?w=200&h=200&fit=crop",
    gradStart: "#e74c3c",
    gradEnd: "#e83e8c",
    emoji: "⛰️",
  },
  {
    id: 9,
    name: "Backpacking",
    slug: "backpacking",
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=200&h=200&fit=crop",
    gradStart: "#fd7e14",
    gradEnd: "#e83e8c",
    emoji: "🎒",
  },
  {
    id: 10,
    name: "All Girls",
    slug: "all-girls",
    image:
      "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=200&h=200&fit=crop",
    gradStart: "#e83e8c",
    gradEnd: "#6f42c1",
    emoji: "👩‍👩‍👧",
  },
  {
    id: 11,
    name: "Customized",
    slug: "customized",
    image:
      "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=200&h=200&fit=crop",
    gradStart: "#6f42c1",
    gradEnd: "#3f9e8f",
    emoji: "✨",
  },
];

const CategoryNav = () => {
  const [activeSlug, setActiveSlug] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const trackRef = useRef(null);
  const sectionRef = useRef(null);

  /* Intersection Observer for entrance animation */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* Track scroll state for arrow visibility */
  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  /* Scroll by arrow click */
  const scrollBy = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 260, behavior: "smooth" });
  };

  /* Horizontal drag-to-scroll */
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);
  const wasDragged = useRef(false);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    wasDragged.current = false;
    startX.current = e.clientX;
    scrollLeftPos.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = "grabbing";
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 4) wasDragged.current = true;
    trackRef.current.scrollLeft = scrollLeftPos.current - dx;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  const handleClick = (slug) => {
    if (wasDragged.current) return;
    setActiveSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <section
      ref={sectionRef}
      className={`${styles.categorySection} ${isVisible ? styles.visible : ""}`}
    >
      {/* Ambient floating orbs */}
      <div className={styles.ambientOrb} aria-hidden="true" />
      <div className={styles.ambientOrb} aria-hidden="true" />
      <div className={styles.ambientOrb} aria-hidden="true" />

      {/* Mesh noise texture overlay */}
      <div className={styles.meshOverlay} aria-hidden="true" />

      {/* Decorative top accent */}
      <div className={styles.topAccent} />

      <div className={styles.header}>
        <span className={styles.headerLabel}>
          <span className={styles.headerLabelDot} />
          Explore Categories
        </span>
        <h2 className={styles.headerTitle}>
          Find Your <span className={styles.headerTitleAccent}>Perfect</span>{" "}
          Adventure
        </h2>
        <p className={styles.headerSub}>
          Choose your vibe — from mountain treks to beachside escapes
        </p>
      </div>

      <div className={styles.trackWrapper}>
        {/* Glassmorphism container */}
        <div className={styles.glassCard}>
          {/* Edge fades */}
          <div className={styles.edgeFadeLeft} />
          <div className={styles.edgeFadeRight} />

          {/* Scroll arrows */}
          {canScrollLeft && (
            <button
              className={`${styles.scrollArrow} ${styles.scrollArrowLeft}`}
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {canScrollRight && (
            <button
              className={`${styles.scrollArrow} ${styles.scrollArrowRight}`}
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          <div
            ref={trackRef}
            className={styles.track}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {CATEGORIES.map((cat, i) => {
              const isActive = activeSlug === cat.slug;
              return (
                <button
                  key={cat.id}
                  className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
                  style={{ "--delay": `${i * 0.065}s` }}
                  onClick={() => handleClick(cat.slug)}
                  aria-pressed={isActive}
                >
                  {/* Outer glow aura (visible on active) */}
                  <span
                    className={styles.aura}
                    style={{
                      "--grad-start": cat.gradStart,
                      "--grad-end": cat.gradEnd,
                    }}
                  />

                  {/* Gradient ring */}
                  <span
                    className={styles.ring}
                    style={{
                      "--grad-start": cat.gradStart,
                      "--grad-end": cat.gradEnd,
                    }}
                  >
                    {/* Orbiting dot */}
                    <span className={styles.orbitDot} />

                    <span className={styles.ringInner}>
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className={styles.avatar}
                        draggable={false}
                        loading="lazy"
                      />
                      {/* Shimmer sweep overlay */}
                      <span className={styles.shimmer} />
                    </span>
                  </span>

                  {/* Label chip */}
                  <span className={styles.labelChip}>
                    <span className={styles.labelEmoji}>{cat.emoji}</span>
                    <span className={styles.labelText}>{cat.name}</span>
                  </span>

                  {/* Active indicator dot */}
                  {isActive && <span className={styles.activeDot} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <svg
        className={styles.bottomWave}
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 20c240-18 480 18 720 0s480-18 720 0v20H0z"
          fill="rgba(63,158,143,0.04)"
        />
      </svg>
    </section>
  );
};

export default CategoryNav;
