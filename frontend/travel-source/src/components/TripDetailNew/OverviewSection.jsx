import styles from "./TripDetailNew.module.css";

const OverviewSection = ({ overview, highlights = [] }) => (
  <section id="section-overview" className={styles.section}>
    <h2 className={styles.sectionTitle}>Overview</h2>
    {overview && (
      <div className={styles.overviewText}>
        {overview.split("\n").map((p, i) => (
          p.trim() ? <p key={i}>{p}</p> : null
        ))}
      </div>
    )}
    {highlights.length > 0 && (
      <div className={styles.highlightsBox}>
        <h3 className={styles.highlightsTitle}>Trip Highlights</h3>
        <ul className={styles.highlightsList}>
          {highlights.map((h, i) => (
            <li key={i} className={styles.highlightItem}>
              <span className={styles.highlightBullet}>✦</span>
              {typeof h === "string" ? h : h.text || h.label || ""}
            </li>
          ))}
        </ul>
      </div>
    )}
  </section>
);

export default OverviewSection;
