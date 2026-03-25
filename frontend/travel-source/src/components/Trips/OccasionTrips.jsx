import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGoodFridayTrips } from "../../services/api";
import styles from "./OccasionTrips.module.css";

const OCCASIONS = [
  { label: "Good Friday", value: "good-friday" },
  { label: "Independence Day", value: "independence-day" },
];

const OccasionTrips = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("good-friday");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === "good-friday") {
          const data = await fetchGoodFridayTrips();
          if (isMounted) setTrips(data.trips || data); 
        } else {
          // Placeholder until backend provides independence day endpoint
          if (isMounted) setTrips([]);
        }
      } catch (err) {
        console.error("Failed to load occasion trips", err);
        if (isMounted) setTrips([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [activeTab]);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Occasion Tabs */}
        <div className={styles.tabsWrap}>
          <div className={styles.tabs}>
            {OCCASIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                className={`${styles.tab} ${activeTab === o.value ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Trip Cards */}
        <div className={styles.cardsScroll}>
          <div className={styles.cardsRow}>
            {loading ? (
              <div className={styles.msg}>Loading experiences...</div>
            ) : trips && trips.length > 0 ? (
              trips.slice(0, 6).map((trip) => (
                <div 
                  className={styles.card} 
                  key={trip.id}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/trips/${trip.id}`)}
                >
                  <img src={trip.image} alt={trip.title} className={styles.cardImg} loading="lazy" />
                  <div className={styles.cardOverlay}>
                    {trip.is_featured ? (
                      <span className={styles.cardBadge}>Bestseller</span>
                    ) : (
                      <span className={`${styles.cardBadge} ${styles.cardBadgeHidden}`}>Hidden</span>
                    )}
                    <span className={styles.cardTitle}>{trip.title}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.msg}>
                Exciting trips coming soon for {OCCASIONS.find(o => o.value === activeTab)?.label}!
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OccasionTrips;
