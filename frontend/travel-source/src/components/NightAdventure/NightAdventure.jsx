import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllAdventureTrips } from "../../services/api";
import styles from "./NightAdventure.module.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:8000";

const getImgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

export const NightAdventure = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllAdventureTrips();
        // Dynamic: Filter for trips that mention camping or just take the top 3 adventure trips
        const relevantTrips = data.filter(t => 
          t.title.toLowerCase().includes('camp') || 
          t.title.toLowerCase().includes('trek') ||
          t.title.toLowerCase().includes('night')
        ).slice(0, 3);
        
        // If not enough "night" trips, just fill with adventure trips
        if (relevantTrips.length < 3) {
           const additional = data.filter(t => !relevantTrips.find(rt => rt.id === t.id)).slice(0, 3 - relevantTrips.length);
           setTrips([...relevantTrips, ...additional]);
        } else {
           setTrips(relevantTrips);
        }
      } catch (err) {
        console.error("Failed to fetch night adventures:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Generate some random "stars" for the background
  const stars = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: `${2 + Math.random() * 3}s`,
  }));

  if (!loading && trips.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.overlay} />
      
      {/* Animated Stars */}
      {stars.map(star => (
        <div 
          key={star.id} 
          className={styles.star} 
          style={{ top: star.top, left: star.left, '--duration': star.duration }}
        />
      ))}

      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Experience the Magic</span>
          <h2 className={styles.heading}>Starlit Nights & Campfire Stories</h2>
          <p className={styles.subheading}>
            Step into the wilderness and embrace the silence of the mountains. 
            From high-altitude camping to night treks, discover the thrill of the starlit sky.
          </p>
        </div>

        {loading ? (
          <div className={styles.loading}>Gathering the stars...</div>
        ) : (
          <div className={styles.grid}>
            {trips.map((trip) => (
              <div 
                key={trip.id} 
                className={styles.card}
                onClick={() => navigate(`/trips/${trip.id}`)}
              >
                <img 
                  src={getImgUrl(trip.image)} 
                  alt={trip.title} 
                  className={styles.cardImg} 
                  loading="lazy"
                />
                <div className={styles.cardMeta}>
                  <span>{trip.duration_days} Days</span>
                  <span>{trip.location || trip.state}</span>
                </div>
                <h3 className={styles.cardTitle}>{trip.title}</h3>
                <div className={styles.cardPrice}>₹{trip.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
