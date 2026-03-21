import styles from "./TripDetailNew.module.css";

const CancellationPolicy = ({ policy = "" }) => {
  if (!policy) return null;

  return (
    <section id="section-cancellation" className={styles.section}>
      <h2 className={styles.sectionTitle}>Cancellation Policy</h2>
      <div className={styles.policyBox}>
        {policy.split("\n").map((p, i) =>
          p.trim() ? <p key={i} className={styles.policyParagraph}>{p}</p> : null
        )}
      </div>
    </section>
  );
};

export default CancellationPolicy;
