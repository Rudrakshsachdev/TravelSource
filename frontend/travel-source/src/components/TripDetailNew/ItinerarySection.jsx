import { useState } from "react";
import styles from "./TripDetailNew.module.css";

const ItinerarySection = ({ itinerary = [] }) => {
  const [openDay, setOpenDay] = useState(0); // first day open by default

  if (!itinerary || itinerary.length === 0) return null;

  const toggleDay = (idx) => {
    setOpenDay(openDay === idx ? -1 : idx);
  };

  return (
    <section id="section-itinerary" className={styles.section}>
      <h2 className={styles.sectionTitle}>Itinerary</h2>
      <div className={styles.itineraryTimeline}>
        {itinerary.map((day, idx) => {
          const isOpen = openDay === idx;
          const title = typeof day === "string" ? day : day.title || day.day || `Day ${idx + 1}`;
          const desc = typeof day === "string" ? "" : day.description || day.desc || day.details || "";
          const activities = typeof day === "object" && day.activities ? day.activities : [];

          return (
            <div key={idx} className={`${styles.itineraryDay} ${isOpen ? styles.itineraryDayOpen : ""}`}>
              <button className={styles.itineraryDayHeader} onClick={() => toggleDay(idx)}>
                <div className={styles.itineraryDayBadge}>Day {idx + 1}</div>
                <span className={styles.itineraryDayTitle}>{title}</span>
                <span className={styles.itineraryChevron}>{isOpen ? "▲" : "▼"}</span>
              </button>
              {isOpen && (
                <div className={styles.itineraryDayBody}>
                  {desc && desc.split("\n").map((p, i) => (
                    p.trim() ? <p key={i}>{p}</p> : null
                  ))}
                  {activities.length > 0 && (
                    <ul className={styles.itineraryActivities}>
                      {activities.map((act, i) => (
                        <li key={i}>{typeof act === "string" ? act : act.name || act.label || ""}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ItinerarySection;
