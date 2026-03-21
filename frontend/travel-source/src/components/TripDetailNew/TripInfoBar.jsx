import styles from "./TripDetailNew.module.css";

const INCLUSION_ICONS = {
  Meals: "🍽️",
  Stays: "🏨",
  Transfers: "🚌",
  Activities: "🎯",
  Sightseeing: "👁️",
  Guide: "🧭",
};

const TripInfoBar = ({ trip }) => {
  if (!trip) return null;

  const category = trip.category?.name || "Trip";
  const duration = `${trip.duration_days} Day${trip.duration_days !== 1 ? "s" : ""}`;
  const pickup = trip.pickup_location || trip.location || "";
  const drop = trip.drop_location || trip.pickup_location || trip.location || "";
  const inclusions = trip.inclusions || [];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: trip.title, url });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className={styles.infoBar}>
      <div className={styles.infoBarHeader}>
        <div>
          <h1 className={styles.infoBarTitle}>{trip.title}</h1>
          <div className={styles.infoBarRating}>
            <span className={styles.stars}>★★★★★</span>
            <span className={styles.ratingText}>(10000+ Reviews)</span>
          </div>
        </div>
        <button className={styles.shareBtn} onClick={handleShare}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share
        </button>
      </div>

      {/* Details chips */}
      <div className={styles.detailsSection}>
        <h3 className={styles.detailsSectionTitle}>Details</h3>
        <div className={styles.detailsChips}>
          {pickup && (
            <div className={styles.detailChip}>
              <span className={styles.chipIcon}>📍</span>
              <div>
                <div className={styles.chipLabel}>Pickup &amp; Drop</div>
                <div className={styles.chipValue}>{pickup} → {drop}</div>
              </div>
            </div>
          )}
          <div className={styles.detailChip}>
            <span className={styles.chipIcon}>🎒</span>
            <div>
              <div className={styles.chipLabel}>Category</div>
              <div className={styles.chipValue}>{category}</div>
            </div>
          </div>
          <div className={styles.detailChip}>
            <span className={styles.chipIcon}>⏱️</span>
            <div>
              <div className={styles.chipLabel}>Duration</div>
              <div className={styles.chipValue}>{duration}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Inclusions icons */}
      {inclusions.length > 0 && (
        <div className={styles.detailsSection}>
          <h3 className={styles.detailsSectionTitle}>Inclusions</h3>
          <div className={styles.inclusionChips}>
            {inclusions.slice(0, 6).map((item, i) => {
              const label = typeof item === "string" ? item : item.label || item.name || "";
              const icon = INCLUSION_ICONS[label] || "✅";
              return (
                <div key={i} className={styles.inclusionChip}>
                  <span className={styles.inclusionIcon}>{icon}</span>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripInfoBar;
