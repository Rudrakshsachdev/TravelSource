import styles from "./TripDetailNew.module.css";

const ThingsToPack = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <section id="section-packing" className={styles.section}>
      <h2 className={styles.sectionTitle}>Things To Pack</h2>
      <div className={styles.packGrid}>
        {items.map((item, i) => (
          <div key={i} className={styles.packItem}>
            <span className={styles.packIcon}>🎒</span>
            <span>{typeof item === "string" ? item : item.name || item.label || ""}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ThingsToPack;
