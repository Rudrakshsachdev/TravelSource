import styles from "./HeroSection.module.css";

const PIN_SVG = (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
  </svg>
);

/**
 * Curated Unsplash travel photos — direct hotlinks for zero-config usage.
 * Each photo is chosen to evoke a specific destination vibe.
 */
const PHOTO_CARDS = [
  {
    src: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=500&fit=crop&q=80",
    alt: "Taiwan temple",
    cardClass: "card1",
  },
  {
    src: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=500&fit=crop&q=80",
    alt: "Paris Eiffel Tower",
    cardClass: "card2",
  },
  {
    src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=500&fit=crop&q=80",
    alt: "Bali rice terraces",
    cardClass: "card3",
  },
  {
    src: "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=400&h=300&fit=crop&q=80",
    alt: "Adventure kayaking",
    cardClass: "card4",
  },
  {
    src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop&q=80",
    alt: "Mountain lake",
    cardClass: "card5",
  },
  {
    src: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&h=500&fit=crop&q=80",
    alt: "Statue of Liberty",
    cardClass: "card6",
  },
  {
    src: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500&h=350&fit=crop&q=80",
    alt: "Tropical beach",
    cardClass: "card7",
  },
  {
    src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=500&fit=crop&q=80",
    alt: "Lausanne cathedral",
    cardClass: "card8",
  },
];

const LOCATIONS = [
  { name: "Taiwan", className: "locTaiwan" },
  { name: "Lausanne", className: "locLausanne" },
  { name: "Bali", className: "locBali" },
  { name: "Paris", className: "locParis" },
];

const HeroSection = () => {
  const scrollToTrips = () => {
    const tripsSection = document.getElementById("trips");
    if (tripsSection) {
      tripsSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <section className={styles.hero} id="hero">
      {/* ── Vignette Overlay ── */}
      <div className={styles.vignetteOverlay} />

      {/* ── Light Beam ── */}
      <div className={styles.lightBeam} />

      {/* ── Noise Texture Overlay ── */}
      <div className={styles.noiseOverlay} />

      {/* ── World Map Watermark ── */}
      <div className={styles.worldMapOverlay} />

      {/* ── Travel Route Lines ── */}
      <div className={styles.routeLinesOverlay} />
      <div className={styles.compassOverlay} />
      <div className={styles.coordGridOverlay} />

      {/* ── Floating Particle Dots ── */}
      <div className={styles.particlesLayer}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <span
            key={n}
            className={`${styles.particle} ${styles[`particle${n}`]}`}
          />
        ))}
      </div>

      {/* ── Scattered Photo Cards ── */}
      <div className={styles.photoCardsLayer}>
        {PHOTO_CARDS.map((card, i) => (
          <div
            key={i}
            className={`${styles.photoCard} ${styles[card.cardClass]}`}
          >
            <img src={card.src} alt={card.alt} loading="eager" />
          </div>
        ))}
      </div>

      {/* ── Location Labels ── */}
      <div className={styles.locationLabelsLayer}>
        {LOCATIONS.map((loc) => (
          <div
            key={loc.name}
            className={`${styles.locationLabel} ${styles[loc.className]}`}
          >
            <span className={styles.pinIcon}>{PIN_SVG}</span>
            <span className={styles.locationName}>{loc.name}</span>
          </div>
        ))}
      </div>

      {/* ── Decorative Pins ── */}
      <div className={styles.decorPinsLayer}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`${styles.decorPin} ${styles[`pin${n}`]}`}>
            {PIN_SVG}
          </span>
        ))}
      </div>

      {/* ── Map Snippet ── */}
      <div className={styles.mapSnippet}>
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&h=350&fit=crop&q=60"
          alt="Map"
          loading="lazy"
        />
      </div>

      {/* ── Decorative Ring ── */}
      <div className={styles.decorRing} />

      {/* ── Center Content ── */}
      <div className={styles.centerContent}>
        <div className={styles.badge}>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2L2 7l8 5 8-5-8-5zM2 17l8 5 8-5M2 12l8 5 8-5" />
          </svg>
          Travel
        </div>

        <h1 className={styles.brandTitle}>
          Travel
          <br />
          Professor<span className={styles.brandDot}>.</span>
        </h1>

        <p className={styles.subtitle}>
          A <em>Simply Superb</em> Travel Agency Experience
        </p>

        <button className={styles.ctaButton} onClick={scrollToTrips}>
          Explore Trips
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* ── Scroll Indicator ── */}
      <div className={styles.scrollIndicator}>
        <span>Scroll</span>
        <svg
          className={styles.scrollArrow}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
