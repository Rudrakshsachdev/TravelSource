import React from "react";
import { ArrowRight } from "lucide-react";
import styles from "./DiscoverJourney.module.css";
import personBg from "../../assets/person-bg.png";

export const DiscoverJourney = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.contentRow}>
          
          <div className={styles.textContent}>
            <span className={styles.eyebrow}>Start Your Adventure</span>
            <h2 className={styles.heading}>
              Find Your True <span className={styles.headingAccent}>North</span>
            </h2>
            <p className={styles.description}>
              Every great journey begins with a single step. Whether you're chasing the horizon or seeking the quiet peace of the mountains, we are here to craft your perfect getaway.
            </p>
            <button 
              className={styles.ctaBtn}
              onClick={() => {
                const tripsSection = document.getElementById("trips");
                if (tripsSection) tripsSection.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Explore Destinations <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className={styles.imageWrapper}>
            <img 
              src={personBg} 
              alt="Traveler standing in front of mountains" 
              className={styles.illustration} 
              draggable="false"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
