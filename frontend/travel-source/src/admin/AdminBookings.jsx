import { useEffect, useState } from "react";
import { fetchAdminBookings } from "../services/api";
import styles from "./AdminBookings.module.css";
import { updateBookingStatus } from "../services/api";


const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchAdminBookings();
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

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, status } : booking
        )
      );
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className={styles.container}>
      <h2>Booking Requests</h2>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className={styles.card}>
            <div className={styles.header}>
              <h3>{booking.trip.title}</h3>
              <span
                className={`${styles.status} ${styles[booking.status.toLowerCase()]}`}
              >
                {booking.status}
              </span>
            </div>

            <div className={styles.details}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>User</span>
                <span className={styles.detailValue}>{booking.full_name}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{booking.email}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Phone</span>
                <span className={styles.detailValue}>{booking.phone}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Persons</span>
                <span className={styles.detailValue}>{booking.persons}</span>
              </div>
            </div>

            {booking.status === "PENDING" && (
              <div className={styles.actions}>
                <button
                  className={styles.approveBtn}
                  onClick={() => handleStatusUpdate(booking.id, "APPROVED")}
                >
                  Approve
                </button>

                <button
                  className={styles.declineBtn}
                  onClick={() => handleStatusUpdate(booking.id, "DECLINED")}
                >
                  Decline
                </button>
              </div>
            )}

            <div className={styles.total}>
              <span className={styles.totalLabel}>Total Amount</span>
              <span className={styles.totalAmount}>₹{booking.total_amount}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminBookings;
