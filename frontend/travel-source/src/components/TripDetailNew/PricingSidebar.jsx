import { useNavigate } from "react-router-dom";
import BatchesSection from "./BatchesSection";
import styles from "./TripDetailNew.module.css";

const PricingSidebar = ({ trip }) => {
  const navigate = useNavigate();
  if (!trip) return null;

  const price = trip.price ? Number(trip.price).toLocaleString("en-IN") : "—";

  const handleBookNow = () => {
    navigate(`/trips/${trip.id}/book`);
  };

  const handleSendQuery = () => {
    navigate(`/trips/${trip.id}/book`);
  };

  return (
    <div className={styles.pricingSidebar}>
      <div className={styles.pricingCard}>
        {/* Price header */}
        <div className={styles.pricingHeader}>
          <span className={styles.pricingLabel}>Starting From</span>
          <div className={styles.priceRow}>
            <span className={styles.priceAmount}>₹ {price}*</span>
            <span className={styles.pricePerPerson}>Per Person</span>
          </div>
        </div>

        <button className={styles.bookNowBtn} onClick={handleBookNow}>
          Book Now
        </button>

        {/* Occupancy */}
        <div className={styles.pricingSection}>
          <div className={styles.pricingSectionHeader}>
            <span className={styles.pricingSectionLabel}>Pricing</span>
            <div className={styles.occupancyTabs}>
              <span>Occupancy</span>
              <button className={styles.occTabActive}>Triple</button>
              <button className={styles.occTab}>Double</button>
            </div>
          </div>
          <div className={styles.pricingDetail}>
            <span>Volvo Bus or Tempo Traveller</span>
            <span>Triple Occupancy</span>
            <span className={styles.pricingDetailPrice}>₹ {price}</span>
          </div>
          <div className={styles.gstNote}>* +5% GST</div>
        </div>

        {/* Action buttons */}
        <div className={styles.sidebarActions}>
          <a
            href={`https://wa.me/?text=${encodeURIComponent("Hi, I'm interested in " + trip.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappIcon}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.458-1.495A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.33 0-4.512-.665-6.363-1.812l-.445-.264-3.084 1.034 1.034-3.084-.264-.445A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
          </a>
          <button className={styles.sendQueryBtn} onClick={handleSendQuery}>
            Send Query
          </button>
          <button className={styles.getPdfBtn} onClick={() => window.print()}>
            Get PDF
          </button>
        </div>
      </div>

      {/* Dynamic Batches Section */}
      <BatchesSection batches={trip.batches} />
    </div>
  );
};

export default PricingSidebar;
