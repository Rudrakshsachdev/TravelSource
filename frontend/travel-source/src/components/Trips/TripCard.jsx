import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./TripCard.module.css";

const StarIcon = () => (
  <svg viewBox="0 0 24 24" className={styles.starSvg} width="12" height="12">
    <path
      fill="currentColor"
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    />
  </svg>
);

const PinIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const TripCard = ({ trip, index, onView }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Premium format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getLuxuryBadge = (trip) => {
    if (trip.price > 100000) return "EXCLUSIVE";
    if (trip.duration_days > 10) return "EXTENDED";
    if (trip.category?.slug === "luxury") return "PREMIUM";
    return "BESTSELLER";
  };

  const getLuxuryImage = () => {
    const images = [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
    ];
    return images[index % images.length];
  };

  const getImageUrl = () => {
    if (!trip.image || trip.image.trim() === "") return getLuxuryImage();
    if (trip.image.startsWith("http")) return trip.image;
    const backendUrl =
      import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
      "http://localhost:8000";
    return `${backendUrl}${trip.image}`;
  };

  const currentImage = getImageUrl();
  const luxuryBadge = getLuxuryBadge(trip);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = () => {
    if (onView) onView(trip.id);
    navigate(`/trips/${trip.id}`);
  };

  return (
    <article
      className={`${styles.card} ${isLoading ? styles.isLoading : ""}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      /* We keep data-aos so that the grid animation still works on desktop */
      data-aos="fade-up"
      data-aos-delay={(index % 4) * 50}
    >
      {/* Full-cover image */}
      <div className={styles.imgWrap}>
        <img
          src={currentImage}
          alt={trip.title}
          className={styles.img}
          loading="lazy"
        />
      </div>

      {/* Gradient layers */}
      <div className={styles.gradientTop} />
      <div className={styles.gradientBot} />

      {/* Badge */}
      <span className={styles.badge}>{luxuryBadge}</span>

      {/* Content overlay */}
      <div className={styles.content}>
        <h3 className={styles.cardTitle}>{trip.title}</h3>

        <span className={styles.locChip}>
          <PinIcon />
          {trip.location || "Delhi to Delhi"}
        </span>

        <div className={styles.metaStrip}>
          <span className={styles.metaTag}>
            <ClockIcon />
            {trip.duration_days
              ? `${trip.duration_days}D${trip.duration_nights > 0 ? ` / ${trip.duration_nights}N` : ""}`
              : "6N/7D"}
          </span>

          <span className={styles.metaDot} />

          <span className={styles.metaTag}>
            <CalendarIcon />
            {trip.months || "Mar - May"}
          </span>
        </div>

        <div className={styles.cardFoot}>
          <span className={styles.price}>{formatPrice(trip.price)}</span>

          <span className={styles.stars}>
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <span className={styles.reviewCount}>(10k+)</span>
          </span>
        </div>
      </div>
    </article>
  );
};

export default TripCard;
