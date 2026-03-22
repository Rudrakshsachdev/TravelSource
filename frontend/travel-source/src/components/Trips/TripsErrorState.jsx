import { useNavigate } from "react-router-dom";
import styles from "./TripsErrorState.module.css";

const TripsErrorState = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.luxuryError}>
      <div className={styles.errorScene}>
        <div className={styles.errorGlobe}>
          <div className={styles.globeLines}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={styles.globeLine} style={{ transform: `rotate(${i * 45}deg)` }}></div>
            ))}
          </div>
          <div className={styles.globeCenter}>
            <div className={styles.errorSymbol}>!</div>
          </div>
        </div>

        <div className={styles.errorContent}>
          <h2 className={styles.errorTitle}>
            <span className={styles.errorTitleMain}>Navigation Error</span>
            <span className={styles.errorTitleSub}>Unable to Access Travel Portfolio</span>
          </h2>

          <div className={styles.errorCard}>
            <p className={styles.errorMessage}>
              Our global concierge network is experiencing temporary connectivity issues.
              Our team is already working to restore access to our premium travel collection.
            </p>

            <div className={styles.errorActions}>
              <button className={styles.errorBtnPrimary} onClick={() => window.location.reload()}>
                <span className={styles.btnIcon}>
                  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5 2.5V7.5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2.5 17.5V12.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17.5 7.5L13.75 3.75C12.6825 2.6825 11.265 2 9.75 2C6.0225 2 3 5.0225 3 8.75C3 9.3525 3.085 9.935 3.2425 10.4875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2.5 12.5L6.25 16.25C7.3175 17.3175 8.735 18 10.25 18C13.9775 18 17 14.9775 17 11.25C17 10.6475 16.915 10.065 16.7575 9.5125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className={styles.btnText}>Retrieve Collection</span>
              </button>

              <button className={styles.errorBtnSecondary} onClick={() => navigate("/contact")}>
                <span className={styles.btnIcon}>
                  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 5.83333L9.0755 10.05C9.635 10.4242 10.365 10.4242 10.9245 10.05L17.5 5.83333M4.16667 15.8333H15.8333C16.7538 15.8333 17.5 15.0871 17.5 14.1667V5.83333C17.5 4.91286 16.7538 4.16667 15.8333 4.16667H4.16667C3.24619 4.16667 2.5 4.91286 2.5 5.83333V14.1667C2.5 15.0871 3.24619 15.8333 4.16667 15.8333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className={styles.btnText}>Contact Concierge</span>
              </button>
            </div>
          </div>

          <div className={styles.errorFooter}>
            <div className={styles.errorStatus}>
              <div className={styles.statusIndicator}></div>
              <span className={styles.statusText}>24/7 Support Available</span>
            </div>
            <a href="tel:+18005551234" className={styles.errorContact}>+1 (800) 555-1234</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripsErrorState;
