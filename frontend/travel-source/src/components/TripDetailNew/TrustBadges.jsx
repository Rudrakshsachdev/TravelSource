import styles from "./TripDetailNew.module.css";

const BADGES = [
  { icon: "🛡️", label: "Safe Travel" },
  { icon: "🔄", label: "Flexible Cancellation" },
  { icon: "💳", label: "Easy EMI" },
  { icon: "🧑‍✈️", label: "Certified Captains" },
  { icon: "🕐", label: "24/7 Support" },
];

const TrustBadges = () => (
  <div className={styles.trustBadges}>
    {BADGES.map((b) => (
      <div key={b.label} className={styles.trustBadge}>
        <span className={styles.trustBadgeIcon}>{b.icon}</span>
        <span className={styles.trustBadgeLabel}>{b.label}</span>
      </div>
    ))}
  </div>
);

export default TrustBadges;
