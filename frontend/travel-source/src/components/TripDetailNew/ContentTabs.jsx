import { useEffect, useRef, useState } from "react";
import styles from "./TripDetailNew.module.css";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "itinerary", label: "Itinerary" },
  { id: "inclusions", label: "Inclusions & Exclusions" },
  { id: "cancellation", label: "Cancellation Policy" },
  { id: "packing", label: "Things To Pack" },
];

const ContentTabs = ({ activeTab, onTabChange }) => {
  const tabsRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: [1], rootMargin: "-1px 0px 0px 0px" }
    );
    if (tabsRef.current) observer.observe(tabsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleClick = (id) => {
    onTabChange(id);
    const el = document.getElementById(`section-${id}`);
    if (el) {
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div ref={tabsRef} className={`${styles.contentTabs} ${isSticky ? styles.contentTabsSticky : ""}`}>
      <div className={styles.contentTabsInner}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.contentTab} ${activeTab === tab.id ? styles.contentTabActive : ""}`}
            onClick={() => handleClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContentTabs;
