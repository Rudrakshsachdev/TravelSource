import styles from "./TripDetailNew.module.css";

const InclusionsExclusions = ({ inclusions = [], exclusions = [] }) => {
  if (inclusions.length === 0 && exclusions.length === 0) return null;

  const getText = (item) => (typeof item === "string" ? item : item.text || item.label || item.name || "");

  return (
    <section id="section-inclusions" className={styles.section}>
      <h2 className={styles.sectionTitle}>Inclusions &amp; Exclusions</h2>
      <div className={styles.incExcGrid}>
        {inclusions.length > 0 && (
          <div className={styles.incExcCol}>
            <h3 className={styles.incTitle}>✅ Inclusions</h3>
            <ul className={styles.incExcList}>
              {inclusions.map((item, i) => (
                <li key={i} className={styles.incItem}>
                  <span className={styles.incBullet}>✓</span>
                  {getText(item)}
                </li>
              ))}
            </ul>
          </div>
        )}
        {exclusions.length > 0 && (
          <div className={styles.incExcCol}>
            <h3 className={styles.excTitle}>❌ Exclusions</h3>
            <ul className={styles.incExcList}>
              {exclusions.map((item, i) => (
                <li key={i} className={styles.excItem}>
                  <span className={styles.excBullet}>✗</span>
                  {getText(item)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default InclusionsExclusions;
