import { useState, useMemo } from "react";
import styles from "./TripDetailNew.module.css";

const BatchesSection = ({ batches }) => {
  const [selectedMonth, setSelectedMonth] = useState("All");

  // Format date helper: "2026-03-21" -> "21-Mar", month: "Mar"
  const formatDate = (dateStr) => {
    if (!dateStr) return { formatted: "", month: "" };
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return { formatted: "Invalid", month: "" };
      const day = date.toLocaleDateString("en-US", { day: "2-digit" });
      const month = date.toLocaleDateString("en-US", { month: "short" });
      return {
        formatted: `${day}-${month}`,
        month,
      };
    } catch (e) {
      return { formatted: "Error", month: "" };
    }
  };

  // Process batches to include formatted dates and month
  const processedBatches = useMemo(() => {
    const rawBatches = Array.isArray(batches) ? batches : [];
    if (rawBatches.length === 0) return [];
    
    return rawBatches.map(batch => {
      const start = formatDate(batch.startDate);
      const end = formatDate(batch.endDate);
      return {
        ...batch,
        displayDate: `${start.formatted} To ${end.formatted}`,
        startMonth: start.month
      };
    });
  }, [batches]);

  // Extract unique months for the filter
  const availableMonths = useMemo(() => {
    const months = new Set(processedBatches.map(b => b.startMonth).filter(Boolean));
    const sortedMonths = Array.from(months); // Optional: sort them
    return ["All", ...sortedMonths];
  }, [processedBatches]);

  // Filter batches based on selected month
  const filteredBatches = useMemo(() => {
    if (selectedMonth === "All") return processedBatches;
    return processedBatches.filter(b => b.startMonth === selectedMonth);
  }, [processedBatches, selectedMonth]);

  if (!batches || batches.length === 0) {
    // Hidden if no batches
    return null;
  }

  return (
    <div className={styles.batchesSection}>
      <div className={styles.batchesHeader}>
        <h3 className={styles.batchesTitle}>Batches</h3>
        <div className={styles.batchesFilters}>
          {availableMonths.map(month => (
            <button
              key={month}
              className={`${styles.monthFilter} ${selectedMonth === month ? styles.activeMonth : ""}`}
              onClick={() => setSelectedMonth(month)}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.batchesListWrapper}>
        <div className={styles.batchesList}>
          {filteredBatches.map((batch, idx) => {
            const status = batch.status || "Available";
            const isFull = status === "Full";
            const isFillingFast = status === "Filling Fast";
            
            return (
              <div key={idx} className={styles.batchRow}>
                <span className={styles.batchDate}>{batch.displayDate}</span>
                <div className={styles.batchRight}>
                  {isFull ? (
                    <div className={styles.statusPillFull}>
                      <span>Full</span>
                    </div>
                  ) : isFillingFast ? (
                    <div className={styles.statusPillFillingFast}>
                      <span>Filling Fast</span>
                    </div>
                  ) : (
                    <div className={styles.statusPillAvailableWrap}>
                      <div className={styles.statusPillAvailableBg}></div>
                      <div className={styles.statusPillAvailableText}>Available</div>
                    </div>
                  )}
                  <svg className={styles.batchCaret} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </div>
              </div>
            );
          })}
          {filteredBatches.length === 0 && (
            <div className={styles.noBatchesMsg}>No batches available for this month.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchesSection;

