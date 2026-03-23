import { useEffect, useState } from "react";
import { fetchMyEnquiries } from "../../services/api";
import { Calendar, MessageSquare, HelpCircle, MapPin } from "lucide-react";
import styles from "./Profile.module.css";

const Profile = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEnquiries = async () => {
      try {
        const data = await fetchMyEnquiries();
        setEnquiries(data);
      } catch (err) {
        setError("Failed to load your enquiries.");
      } finally {
        setLoading(false);
      }
    };

    loadEnquiries();
  }, []);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
          <p>Fetching your enquiries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.errorContainer}>
          <HelpCircle size={48} className={styles.errorIcon} />
          <h2>Oops!</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.topAccent} />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>My Enquiries</h2>
          <p className={styles.subHeading}>Keep track of all the trips you've enquired about.</p>
        </div>

        {enquiries.length === 0 ? (
          <div className={styles.emptyState}>
            <MessageSquare size={48} className={styles.emptyIcon} />
            <h3>No enquiries yet</h3>
            <p>You haven't made any trip enquiries yet. Explore our trips and ask us anything!</p>
            <a href="/packages" className={styles.exploreBtn}>Explore Trips</a>
          </div>
        ) : (
          <div className={styles.list}>
            {enquiries.map((enquiry, index) => (
              <div 
                key={enquiry.id} 
                className={styles.card}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.tripInfo}>
                    <MapPin size={18} className={styles.tripIcon} />
                    <h4 className={styles.trip}>{enquiry.trip_title}</h4>
                  </div>
                  <span className={styles.date}>
                    <Calendar size={14} />
                    {new Date(enquiry.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className={styles.messageBox}>
                  <MessageSquare size={16} className={styles.msgIcon} />
                  <p className={styles.message}>
                    {enquiry.message || "No specific message provided."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
