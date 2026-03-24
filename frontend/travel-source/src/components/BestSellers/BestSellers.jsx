import React, { useState, useEffect } from "react";
import {
  fetchInternationalTrips,
  fetchBackpackingTrips,
  fetchBikingTrips,
  fetchHimalayanTrips,
} from "../../services/api";
import styles from "./BestSellers.module.css";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: "international", label: "International", fetcher: fetchInternationalTrips },
  { id: "backpacking", label: "Backpacking", fetcher: fetchBackpackingTrips },
  { id: "biking", label: "Biking", fetcher: fetchBikingTrips },
  { id: "treks", label: "Treks", fetcher: fetchHimalayanTrips },
];

const BestSellers = () => {
  const [activeTab, setActiveTab] = useState(categories[0].id);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true);
      try {
        const category = categories.find((c) => c.id === activeTab);
        const data = await category.fetcher();
        // The APIs return { config, trips }. We only need the trips.
        setTrips(data.trips || []);
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, [activeTab]);

  const handleCardClick = (id) => {
    navigate(`/trip/${id}`);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Best Sellers</h2>
          <div className={styles.filterTabs}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.tab} ${activeTab === cat.id ? styles.activeTab : ""}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className={`${styles.card} ${styles.skeleton}`} />
            ))
          ) : (
            trips.slice(0, 4).map((trip) => (
              <div
                key={trip.id}
                className={styles.card}
                onClick={() => handleCardClick(trip.id)}
              >
                <div className={styles.imgWrap}>
                  <img
                    src={trip.image || trip.card_image}
                    alt={trip.title}
                    className={styles.img}
                  />
                  <div className={styles.gradientTop}></div>
                  <div className={styles.gradientBot}></div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.location}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {trip.start_city || "Exploration"} to {trip.end_city || "Adventure"}
                  </div>
                  
                  <h3 className={styles.cardTitle}>{trip.title}</h3>
                  
                  <div className={styles.metaStrip}>
                    <div className={styles.metaTag}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {trip.duration_days}D/{trip.duration_nights}N
                    </div>
                    <div className={styles.metaDot}></div>
                    <div className={styles.metaTag}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {trip.seasonality || "All Year"}
                    </div>
                  </div>

                  <div className={styles.priceSection}>
                    {/* Discount Tag placed relative to price section using absolute in CSS */}
                    {trip.discount_price && trip.price > trip.discount_price && (
                      <div className={styles.offTag}>
                        <div className={styles.offTagLeft}>Upto</div>
                        <div className={styles.offTagRight}>
                          {trip.price - trip.discount_price} <span>OFF</span>
                        </div>
                      </div>
                    )}

                    <div className={styles.priceContainer}>
                      {trip.discount_price ? (
                        <>
                          <span className={styles.originalPrice}>₹{trip.price?.toLocaleString()}</span>
                          <span className={styles.currentPrice}>₹{trip.discount_price.toLocaleString()}</span>
                        </>
                      ) : (
                        <span className={styles.currentPrice}>₹{trip.price?.toLocaleString()}</span>
                      )}
                    </div>
                    
                    <div className={styles.rating}>
                      <div className={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <span className={styles.reviews}>(10k+)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
