import { useEffect, useState } from "react";
import { fetchTrips } from "../../services/api";
import { TripCard } from ".";
import styles from "./TripsList.module.css";

const TripsList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await fetchTrips();
        setTrips(data);
      } catch (err) {
        setError("Unable to load trips.");
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  if (loading) {
    return <p className={styles.status}>Loading trips...</p>;
  }

  if (error) {
    return <p className={styles.statusError}>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Available Trips</h2>

      <div className={styles.grid}>
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
};

export default TripsList;
