import { useState, useEffect, useCallback } from "react";
import HeroSearch from "./HeroSearch";
import {
  MapPin, Users, Star, Headphones,
  Sparkles, ArrowRight, ChevronDown,
} from "lucide-react";
import styles from "./HeroPremium.module.css";

/* ═══════════════════════════════════════════════════════════════
   HeroPremium — Cinematic full-screen hero
   ● Crossfading backgrounds with Ken Burns
   ● Blue gradient overlay (#3b82f6 → #1d4ed8)
   ● Badge → Heading → Subtext → CTAs → Search → Trust Stats
   ═══════════════════════════════════════════════════════════════ */

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80",
];

const STATS = [
  { icon: <MapPin size={18} />, num: "500+", text: "Destinations" },
  { icon: <Users size={18} />, num: "50K+", text: "Happy Travelers" },
  { icon: <Star size={18} />, num: "4.9", text: "Average Rating" },
  { icon: <Headphones size={18} />, num: "24/7", text: "Expert Support" },
];

const HeroPremium = () => {
  const [show, setShow] = useState(false);
  const [bg, setBg] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setBg(p => (p + 1) % BG_IMAGES.length), 7000);
    return () => clearInterval(id);
  }, []);

  const scrollTo = useCallback(() => {
    const el = document.getElementById("trips-grid") || document.getElementById("trips");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  return (
    <section className={`${styles.hero} ${show ? styles.show : ""}`} id="hero">
      {/* Background images */}
      <div className={styles.bgWrap} aria-hidden="true">
        {BG_IMAGES.map((src, i) => (
          <img key={i} src={src} alt="" aria-hidden="true" draggable="false"
            className={`${styles.bgImg} ${i === bg ? styles.bgOn : ""}`}
            loading={i === 0 ? "eager" : "lazy"} />
        ))}
      </div>

      {/* Overlay */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Content */}
      <div className={styles.inner}>
        <div className={styles.badge}>
          <Sparkles size={13} />
          <span>Your Next Adventure Awaits</span>
        </div>

        <h1 className={styles.heading}>
          Discover the World's
          <br />
          <span className={styles.glow}>Most Beautiful</span>
          <br />
          Destinations
        </h1>

        <p className={styles.sub}>
          Expertly curated journeys to extraordinary places. Let us craft your
          perfect escape with insider knowledge and unmatched attention to detail.
        </p>

        <div className={styles.ctas}>
          <button className={styles.ctaMain} onClick={scrollTo}>
            Start Your Journey <ArrowRight size={15} className={styles.arrow} />
          </button>
          <button className={styles.ctaAlt} onClick={scrollTo}>
            View Destinations
          </button>
        </div>

        <div className={styles.searchWrap}>
          <HeroSearch />
        </div>

        <div className={styles.stats}>
          {STATS.map((s, i) => (
            <div className={styles.stat} key={i}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statTxt}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      <button className={styles.scrollBtn}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        aria-label="Scroll down">
        <ChevronDown size={18} />
      </button>
    </section>
  );
};

export default HeroPremium;
