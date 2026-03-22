import styles from "./TripsLoadingState.module.css";

const TripsLoadingState = () => (
  <div className={styles.luxuryLoading}>
    <div className={styles.loadingContainer}>
      <div className={styles.loadingOrbit}>
        <div className={styles.orbitCenter}>
          <div className={styles.orbitLogo}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className={styles.orbitPoint}></div>
        <div className={styles.orbitPoint}></div>
        <div className={styles.orbitPoint}></div>
      </div>

      <div className={styles.loadingText}>
        <h2 className={styles.loadingTitle}>
          <span className={styles.titleWord}>Curating</span>
          <span className={styles.titleWord}>Extraordinary</span>
          <span className={styles.titleWord}>Journeys</span>
        </h2>
        <p className={styles.loadingSubtitle}>
          Accessing our global collection of premium travel experiences...
        </p>
      </div>

      <div className={styles.loadingStats}>
        <div className={styles.loadingStat}>
          <div className={styles.statNumber} data-count="100">0</div>
          <div className={styles.statLabel}>Destinations</div>
        </div>
        <div className={styles.loadingDivider}></div>
        <div className={styles.loadingStat}>
          <div className={styles.statNumber} data-count="500">0</div>
          <div className={styles.statLabel}>Experiences</div>
        </div>
        <div className={styles.loadingDivider}></div>
        <div className={styles.loadingStat}>
          <div className={styles.statNumber} data-count="24">0</div>
          <div className={styles.statLabel}>Hours</div>
        </div>
      </div>
    </div>
  </div>
);

export default TripsLoadingState;
