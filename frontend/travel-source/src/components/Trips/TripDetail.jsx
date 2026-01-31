/*
this component is used to display the details of a single trip
*/

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTripDetail } from "../../services/api";
import styles from "./TripDetail.module.css";

const TripDetail = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const data = await fetchTripDetail(id);
        setTrip(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id]);

  if (loading) {
    return <p className={styles.loading}>Loading trip...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <img
          src={trip.image || "https://via.placeholder.com/800x400"}
          alt={trip.title}
        />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{trip.title}</h1>
        <p className={styles.location}>{trip.location}</p>

        <div className={styles.meta}>
          <span>₹ {trip.price}</span>
          <span>{trip.duration_days} Days</span>
        </div>

        <section className={styles.section}>
          <h3>About the Trip</h3>
          <p>{trip.description}</p>
        </section>

        {trip.itinerary && (
          <section className={styles.section}>
            <h3>Itinerary</h3>
            <p>{trip.itinerary}</p>
          </section>
        )}

        <button className={styles.cta}>
          Enquire Now
        </button>
      </div>
    </div>
  );
};

export default TripDetail;
