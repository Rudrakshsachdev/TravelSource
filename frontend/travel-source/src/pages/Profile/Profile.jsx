import { useEffect, useState } from "react";
import { fetchMyEnquiries } from "../../services/api";
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
      <div className={styles.state}>
        Loading your enquiries…
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.stateError}>
        {error}
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <div className={styles.state}>
        You haven’t made any enquiries yet.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>My Enquiries</h2>

      <div className={styles.list}>
        {enquiries.map((enquiry) => (
          <div key={enquiry.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h4 className={styles.trip}>
                {enquiry.trip_title}
              </h4>
              <span className={styles.date}>
                {new Date(enquiry.created_at).toLocaleDateString()}
              </span>
            </div>

            <p className={styles.message}>
              {enquiry.message || "No message provided."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
