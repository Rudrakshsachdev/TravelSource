import { useState, useEffect, useCallback } from "react";
import HeroFloatingSearch from "./HeroFloatingSearch";
import {
  MapPin,
  Users,
  Star,
  Headphones,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import styles from "./HeroSectionPremium.module.css";

/* ═══════════════════════════════════════════════════════════════
   HeroSectionPremium — Cinematic full-screen hero
   ● Crossfading background images with Ken Burns
   ● Blue gradient overlay using brand colours
   ● "Your Next Adventure Awaits" pill badge
   ● Bold heading with gradient-colored highlight
   ● Subtitle + dual CTA buttons
   ● Floating glassmorphic search bar
   ● Trust stats bar (destinations, travelers, rating, support)
   ═══════════════════════════════════════════════════════════════ */

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80",
];

const TRUST_STATS = [
  { icon: <MapPin size={20} />, number: "500+", label: "Destinations" },
  { icon: <Users size={20} />, number: "50K+", label: "Happy Travelers" },
  { icon: <Star size={20} />, number: "4.9", label: "Average Rating" },
  { icon: <Headphones size={20} />, number: "24/7", label: "Expert Support" },
];

const HeroSectionPremium = () => {
  const [entered, setEntered] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  /* Entrance animation trigger */
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Crossfade background images every 7s */
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTrips = useCallback(() => {
    const el =
      document.getElementById("trips-grid") ||
      document.getElementById("trips");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  }, []);

  const scrollDown = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  return (
    <section
      className={`${styles.hero} ${entered ? styles.entered : ""}`}
      id="hero"
    >
      {/* ═══ Background — crossfading images + Ken Burns ═══ */}
      <div className={styles.bgStack} aria-hidden="true">
        {BG_IMAGES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden="true"
            className={`${styles.bgImg} ${i === bgIndex ? styles.bgActive : ""}`}
            loading={i === 0 ? "eager" : "lazy"}
            draggable="false"
          />
        ))}
      </div>

      {/* ═══ Gradient Overlay ═══ */}
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.overlayNoise} aria-hidden="true" />

      {/* ═══ Main Content ═══ */}
      <div className={styles.content}>
        {/* Badge */}
        <div className={styles.badge}>
          <Sparkles size={14} className={styles.badgeIcon} />
          <span>Your Next Adventure Awaits</span>
        </div>

        {/* Heading */}
        <h1 className={styles.heading}>
          Discover the World's
          <br />
          <span className={styles.headingGradient}>Most Beautiful</span>
          <br />
          Destinations
        </h1>

        {/* Subtext */}
        <p className={styles.subtext}>
          Expertly curated journeys to extraordinary places. Let us craft your
          perfect escape with insider knowledge and unmatched attention to detail.
        </p>

        {/* CTA Buttons */}
        <div className={styles.ctaRow}>
          <button
            className={styles.ctaPrimary}
            onClick={scrollToTrips}
            id="hero-explore-cta"
          >
            Start Your Journey
            <ArrowRight size={16} className={styles.ctaArrow} />
          </button>
          <button
            className={styles.ctaSecondary}
            onClick={scrollToTrips}
            id="hero-destinations-cta"
          >
            View Destinations
          </button>
        </div>

        {/* Floating Search Bar */}
        <div className={styles.searchSection}>
          <HeroFloatingSearch />
        </div>

        {/* Trust Stats */}
        <div className={styles.trustBar}>
          {TRUST_STATS.map((stat, i) => (
            <div className={styles.trustItem} key={i}>
              <span className={styles.trustNumber}>{stat.number}</span>
              <span className={styles.trustLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        className={styles.scrollIndicator}
        onClick={scrollDown}
        aria-label="Scroll down"
      >
        <ChevronDown size={20} />
      </button>
    </section>
  );
};

export default HeroSectionPremium;
