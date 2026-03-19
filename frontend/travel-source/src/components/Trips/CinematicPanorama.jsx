import { useEffect, useRef, useState } from "react";
import styles from "./CinematicPanorama.module.css";
import { ArrowRight, Play, MapPin } from "lucide-react";

const STATS = [
  { number: "50+", label: "Destinations" },
  { number: "10K+", label: "Happy Travelers" },
  { number: "4.9", label: "Avg Rating" },
  { number: "24/7", label: "Support" },
];

const CinematicPanorama = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const scrollToTrips = () => {
    const el = document.getElementById("trips-grid");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className={`${styles.cinema} ${isVisible ? styles.visible : ""}`}
    >
      {/* ── Background & Deep Overlays ── */}
      <div className={styles.bgWrapper}>
        <img
          src="https://images.unsplash.com/photo-1546948630-1149ea60dc86?w=1920&q=80"
          alt=""
          className={styles.bgImg}
          loading="lazy"
          draggable="false"
        />
        <div className={styles.bgOverlay} />
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />
      </div>

      {/* ── Foreground Grid ── */}
      <div className={styles.contentArea}>
        
        {/* Left Column (Main Hero-like content) */}
        <div className={styles.leftCol}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Curated Travel Experiences
          </div>

          <h2 className={styles.heading}>
            Discover the World <br />
            One <span className={styles.headingHighlight}>Adventure</span> at a Time
          </h2>

          <p className={styles.description}>
            Handpicked destinations, expert-crafted itineraries, and
            unforgettable memories. From serene beaches to majestic mountains —
            your next journey begins here.
          </p>

          <div className={styles.ctaGroup}>
            <button className={styles.ctaPrimary} onClick={scrollToTrips}>
              View All Trips
              <ArrowRight size={18} />
            </button>
            <button
              className={styles.ctaSecondary}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <Play size={16} />
              Watch Stories
            </button>
          </div>

          <div className={styles.statsRow}>
            {STATS.map((stat, i) => (
              <div key={i} className={styles.statItem}>
                <span className={styles.statNumber}>{stat.number}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Floating Glassmorphic Card) */}
        <div className={styles.rightCol}>
          <div className={styles.floatingCard}>
            <div className={styles.fcGlow} />
            <div className={styles.fcHeader}>
              <div className={styles.fcIconWrap}>
                <MapPin size={22} />
              </div>
              <span className={styles.fcLabel}>Next Destination</span>
            </div>
            
            <h3 className={styles.fcTitle}>Awaits You</h3>
            <p className={styles.fcSub}>
              Find your perfect escape with our personalized trip planner.
            </p>
            
            <div className={styles.fcFooter}>
              <button className={styles.fcBtn} onClick={scrollToTrips}>
                Explore Now
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CinematicPanorama;
