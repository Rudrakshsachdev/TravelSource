import { useEffect, useState } from "react";
import { fetchMyBookings } from "../../services/api";
import styles from "./MyBookings.module.css";
import {
  Calendar,
  Users,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchMyBookings();
        setBookings(data);
      } catch (err) {
        console.error("Error loading bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED": return <CheckCircle size={18} />;
      case "DECLINED": return <XCircle size={18} />;
      default: return <AlertCircle size={18} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        <p>Retrieving your journeys...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.topAccent} />

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.labelRow}>
            <span className={styles.labelLine} />
            <span className={styles.label}>
              <span className={styles.labelDot} />
              Travel History
            </span>
            <span className={styles.labelLine} />
          </div>
          <h1 className={styles.title}>My Bookings</h1>
          <p className={styles.subtitle}>
            Manage your past and upcoming adventures with Travel Professor.
          </p>
        </header>

        {bookings.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><MapPin size={48} /></div>
            <h3>No bookings found</h3>
            <p>Your adventures are waiting. Explore our collection and start your journey today.</p>
            <a href="/trips" className={styles.exploreBtn}>Explore Trips</a>
          </div>
        ) : (
          <div className={styles.bookingsGrid}>
            {bookings.map((booking) => (
              <div key={booking.id} className={styles.bookingCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.statusBadge} data-status={booking.status}>
                    {getStatusIcon(booking.status)}
                    <span>{booking.status}</span>
                  </div>
                  <span className={styles.bookingId}>ID: #BK-{booking.id.toString().padStart(5, '0')}</span>
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.tripTitle}>{booking.trip.title}</h3>
                  <div className={styles.location}>
                    <MapPin size={16} />
                    <span>{booking.trip.location}</span>
                  </div>

                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <Calendar size={18} className={styles.icon} />
                      <div className={styles.detailText}>
                        <label>Travel Date</label>
                        <span>{formatDate(booking.travel_date)}</span>
                      </div>
                    </div>

                    <div className={styles.detailItem}>
                      <Users size={18} className={styles.icon} />
                      <div className={styles.detailText}>
                        <label>Travelers</label>
                        <span>{booking.persons} {booking.persons > 1 ? 'Persons' : 'Person'}</span>
                      </div>
                    </div>

                    <div className={styles.detailItem}>
                      <CreditCard size={18} className={styles.icon} />
                      <div className={styles.detailText}>
                        <label>Total Amount</label>
                        <span className={styles.amount}>₹{parseFloat(booking.total_amount).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className={styles.detailItem}>
                      <Clock size={18} className={styles.icon} />
                      <div className={styles.detailText}>
                        <label>Booked On</label>
                        <span>{formatDate(booking.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {booking.admin_note && (
                  <div className={styles.adminNote}>
                    <AlertCircle size={14} />
                    <p><strong>Note:</strong> {booking.admin_note}</p>
                  </div>
                )}

                <div className={styles.cardFooter}>
                  <button className={styles.viewDetailBtn}>View Full Itinerary</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
