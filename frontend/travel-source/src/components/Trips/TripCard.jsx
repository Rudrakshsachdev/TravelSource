// this component is used to display the details of a single trip in the list of trips

import { useNavigate } from "react-router-dom";
import styles from "./TripCard.module.css";

const TripCard = ({ trip }) => {
  const navigate = useNavigate();

  // Generate a unique gradient based on trip ID for consistent colors
  const getTripGradient = (id) => {
    const gradients = [
      'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)',
      'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
      'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
      'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
      'linear-gradient(135deg, #be185d 0%, #ec4899 100%)',
      'linear-gradient(135deg, #0369a1 0%, #38bdf8 100%)'
    ];
    return gradients[id % gradients.length];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTripTypeIcon = (title) => {
    // Determine icon based on trip title keywords
    const titleLower = title.toLowerCase();
    if (titleLower.includes('beach') || titleLower.includes('sea') || titleLower.includes('ocean')) {
      return '🏖️';
    } else if (titleLower.includes('mountain') || titleLower.includes('hiking') || titleLower.includes('trek')) {
      return '⛰️';
    } else if (titleLower.includes('city') || titleLower.includes('urban')) {
      return '🏙️';
    } else if (titleLower.includes('cultural') || titleLower.includes('heritage')) {
      return '🏛️';
    } else if (titleLower.includes('adventure') || titleLower.includes('sports')) {
      return '🚴';
    } else {
      return '🧳';
    }
  };

  const tripTypeIcon = getTripTypeIcon(trip.title);
  const tripGradient = getTripGradient(trip.id);

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/trips/${trip.id}`)}
    >
      <div className={styles.cardHeader} style={{ background: tripGradient }}>
        <div className={styles.headerContent}>
          <div className={styles.tripTypeIcon}>
            {tripTypeIcon}
          </div>
          <div className={styles.headerText}>
            <span className={styles.featuredBadge}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured
            </span>
            <h3 className={styles.title}>{trip.title}</h3>
            <div className={styles.location}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{trip.location}</span>
            </div>
          </div>
        </div>
        <div className={styles.gradientOverlay}></div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.description}>
          <p>{trip.description}</p>
        </div>

        <div className={styles.metaInfo}>
          <div className={styles.metaItem}>
            <div className={styles.metaIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className={styles.metaContent}>
              <span className={styles.metaLabel}>Duration</span>
              <span className={styles.metaValue}>{trip.duration_days} Days</span>
            </div>
          </div>

          <div className={styles.metaItem}>
            <div className={styles.metaIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className={styles.metaContent}>
              <span className={styles.metaLabel}>Price</span>
              <span className={styles.price}>{formatPrice(trip.price)}</span>
            </div>
          </div>
        </div>

        <div className={styles.actionBar}>
          <button className={styles.viewButton}>
            <span>View Details</span>
            <svg className={styles.buttonIcon} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.16699 10H15.8337" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.833 5L15.833 10L10.833 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.footerInfo}>
          <div className={styles.difficulty}>
            <div className={styles.difficultyIndicator}></div>
            <span className={styles.difficultyText}>Moderate</span>
          </div>
          <div className={styles.rating}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>4.8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
