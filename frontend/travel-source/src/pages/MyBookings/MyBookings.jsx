import { useEffect, useState } from "react";
import { fetchMyBookings } from "../../services/api";
import styles from "./MyBookings.module.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchMyBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div className={styles.container}>
      <h2>My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className={styles.card}>
            <h3>{booking.trip.title}</h3>
            <p><strong>Persons:</strong> {booking.persons}</p>
            <p><strong>Total:</strong> ₹{booking.total_amount}</p>
            <p>
              <strong>Status:</strong>
              <span className={`${styles.status} ${styles[booking.status.toLowerCase()]}`}>
                {booking.status}
              </span>
            </p>
            <p className={styles.date}>
              {new Date(booking.created_at).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;
