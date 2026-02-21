import { useEffect, useRef, useState } from "react";
import styles from "./CinematicPanorama.module.css";

/* ── Panoramic background images (stitched for seamless loop) ── */
const PANORAMA_IMAGES = [
  "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&h=600&fit=crop&q=80",
];

/* ── Featured destination stats ── */
const STATS = [
  { number: "50+", label: "Destinations" },
  { number: "10K+", label: "Happy Travelers" },
  { number: "4.9", label: "Avg Rating" },
  { number: "24/7", label: "Support" },
];

const CinematicPanorama = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  /* ── Intersection Observer for entrance animations ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.cinema} ${isVisible ? styles.visible : ""}`}
    >
      {/* ── Moving panoramic background ── */}
      <div className={styles.panoramaTrack}>
        <div className={styles.panoramaStrip}>
          {/* Double the images for seamless loop */}
          {[...PANORAMA_IMAGES, ...PANORAMA_IMAGES].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className={styles.panoramaImg}
              loading="lazy"
              draggable="false"
            />
          ))}
        </div>
      </div>

      {/* ── Gradient overlays for depth ── */}
      <div className={styles.overlayGradient} />
      <div className={styles.overlayVignette} />
      <div className={styles.overlayBottom} />

      {/* ── Foreground content (static) ── */}
      <div className={styles.foreground}>
        <div className={styles.content}>
          {/* Badge */}
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Curated Travel Experiences
          </div>

          {/* Headline */}
          <h2 className={styles.heading}>
            <span className={styles.headingLine1}>Discover the World</span>
            <span className={styles.headingLine2}>
              One <span className={styles.headingAccent}>Adventure</span> at a
              Time
            </span>
          </h2>

          {/* Description */}
          <p className={styles.description}>
            Handpicked destinations, expert-crafted itineraries, and
            unforgettable memories. From serene beaches to majestic mountains —
            your next journey begins here.
          </p>

          {/* CTA Buttons */}
          <div className={styles.ctaGroup}>
            <button
              className={styles.ctaPrimary}
              onClick={() => {
                const el = document.getElementById("trips-grid");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View All Trips
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={styles.ctaIcon}
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              className={styles.ctaSecondary}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={styles.ctaIcon}
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              Watch Stories
            </button>
          </div>

          {/* Stats bar */}
          <div className={styles.statsBar}>
            {STATS.map((stat, i) => (
              <div key={i} className={styles.statItem}>
                <span className={styles.statNumber}>{stat.number}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side decorative element */}
        <div className={styles.sideVisual}>
          <div className={styles.locationCard}>
            <div className={styles.locationPulse} />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={styles.locationIcon}
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div className={styles.locationText}>
              <span className={styles.locationName}>Next Destination</span>
              <span className={styles.locationCity}>Awaits You</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CinematicPanorama;
