import styles from "./ModernHero.module.css";

const ModernHero = () => {
  const scrollToTrips = () => {
    const el = document.getElementById("trips-grid");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroSection}>
        {/* Background Video wrapper to handle border-radius clipping */}
        <div className={styles.videoWrapper}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className={styles.heroVideo}
            title="Background travel video"
          >
            <source 
              src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" 
              type="video/mp4" 
            />
          </video>
          
          {/* Dark overlay for text readability */}
          <div className={styles.heroOverlay}></div>
        </div>

        {/* Content */}
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Handpicked Adventures
          </div>
          <h1 className={styles.title}>Romantic Escapes &amp; Worldwide Treks</h1>
          <p className={styles.subtitle}>Where Forever Begins... Together! Discover our curated trips tailored just for you.</p>
          <div className={styles.ctaGroup}>
            <button className={styles.exploreBtn} onClick={scrollToTrips}>
              Explore Destinations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHero;
