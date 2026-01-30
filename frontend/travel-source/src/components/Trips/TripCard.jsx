import styles from "./TripCard.module.css";

const TripCard = ({ trip }) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{trip.title}</h3>

        <p className={styles.location}>{trip.location}</p>

        <div className={styles.meta}>
          <span>{trip.duration_days} Days</span>
          <span className={styles.price}>₹{trip.price}</span>
        </div>

        <p className={styles.description}>
          {trip.description}
        </p>
      </div>
    </div>
  );
};

export default TripCard;
