import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import styles from "./PromoBanner.module.css";
import posterImg from "../../assets/good-friday.png";

export default function PromoBanner() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect(); // Only animate once
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      obs.observe(sectionRef.current);
    }

    return () => obs.disconnect();
  }, []);

  const handleNavigate = () => {
    navigate("/good-friday");
  };

  return (
    <section className={styles.section}>
      <div
        ref={sectionRef}
        className={`${styles.container} ${visible ? styles.visible : ""}`}
        onClick={handleNavigate}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleNavigate();
        }}
        aria-label="Good Friday Special Packages"
      >
        <div className={styles.posterWrapper}>
          <img
            src={posterImg}
            alt="Good Friday Special Trips"
            className={styles.posterImage}
            loading="lazy"
          />
          <div className={styles.overlay}>
            <div className={styles.promoTag}>Limited Time Offer</div>
            <h2 className={styles.title}>Good Friday Special Getaways</h2>
            <button className={styles.ctaButton} onClick={(e) => {
                e.stopPropagation();
                handleNavigate();
            }}>
              Explore Packages <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
