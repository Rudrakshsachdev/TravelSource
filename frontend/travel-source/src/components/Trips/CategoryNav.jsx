import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./CategoryNav.module.css";
import { fetchCategories } from "../../services/api";
import ExploreRippleBackground from "../RippleGrid/ExploreRippleBackground";

const CategoryNav = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [activeSlug, setActiveSlug] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const trackRef = useRef(null);
  const sectionRef = useRef(null);

  /* ── Fetch categories from the API ── */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  /* Intersection Observer for entrance animation
     Must depend on categories.length so it re-attaches after categories load
     (on first mount, categories is [] → component returns null → sectionRef is null) */
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [categories.length]);

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
  }, [updateScrollState, categories]);

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
    const newSlug = activeSlug === slug ? null : slug;
    setActiveSlug(newSlug);
    if (onCategoryChange) {
      onCategoryChange(newSlug);
    }
  };

  /* Don't render the section if there are no categories */
  if (categories.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={`${styles.categorySection} ${isVisible ? styles.visible : ""}`}
    >
      {/* RippleGrid animated background */}
      <ExploreRippleBackground />

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
            {categories.map((cat, i) => {
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
                      "--grad-start": cat.grad_start,
                      "--grad-end": cat.grad_end,
                    }}
                  />

                  {/* Gradient ring */}
                  <span
                    className={styles.ring}
                    style={{
                      "--grad-start": cat.grad_start,
                      "--grad-end": cat.grad_end,
                    }}
                  >
                    {/* Orbiting dot */}
                    <span className={styles.orbitDot} />

                    <span className={styles.ringInner}>
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className={styles.avatar}
                          draggable={false}
                          loading="lazy"
                        />
                      ) : (
                        <span
                          className={styles.avatar}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.6rem",
                            background: `linear-gradient(135deg, ${cat.grad_start || "#3f9e8f"}, ${cat.grad_end || "#7ecfc0"})`,
                            borderRadius: "50%",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          {cat.emoji || "✈️"}
                        </span>
                      )}
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
