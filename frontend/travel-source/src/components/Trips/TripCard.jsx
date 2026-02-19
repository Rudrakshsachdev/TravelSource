import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./TripCard.module.css";

const TripCard = ({ trip, index, onView }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Teal-themed gradient based on trip category
  const getLuxuryGradient = (category) => {
    const gradients = {
      luxury: "linear-gradient(135deg, #3f9e8f 0%, #5fb8a8 50%, #2e8b7a 100%)",
      adventure:
        "linear-gradient(135deg, #2d8a7e 0%, #48b5a0 50%, #1a6b5a 100%)",
      cultural:
        "linear-gradient(135deg, #5aab9e 0%, #3f9e8f 50%, #2e8b7a 100%)",
      beach: "linear-gradient(135deg, #7ecfc0 0%, #5fb8a8 50%, #3f9e8f 100%)",
      mountain:
        "linear-gradient(135deg, #1a6b5a 0%, #2d8a7e 50%, #3f9e8f 100%)",
      urban: "linear-gradient(135deg, #2d5c54 0%, #3d7a70 50%, #3f9e8f 100%)",
      default: "linear-gradient(135deg, #3f9e8f 0%, #7ecfc0 50%, #3f9e8f 100%)",
    };
    return gradients[category?.toLowerCase()] || gradients.default;
  };

  // Premium format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Luxury trip type icon
  const getLuxuryIcon = (category, title) => {
    const titleLower = title.toLowerCase();
    const iconMap = {
      luxury: "🏰",
      adventure: "⛰️",
      cultural: "🏛️",
      beach: "🏖️",
      mountain: "❄️",
      urban: "🏙️",
      safari: "🦁",
      cruise: "🛳️",
      wellness: "🧘",
      culinary: "🍽️",
    };

    if (category) return iconMap[category.toLowerCase()] || "✨";

    if (titleLower.includes("beach") || titleLower.includes("island"))
      return "🏖️";
    if (titleLower.includes("mountain") || titleLower.includes("alpine"))
      return "❄️";
    if (titleLower.includes("city") || titleLower.includes("urban"))
      return "🏙️";
    if (titleLower.includes("cultural") || titleLower.includes("heritage"))
      return "🏛️";
    if (titleLower.includes("adventure") || titleLower.includes("expedition"))
      return "⛰️";
    if (titleLower.includes("luxury") || titleLower.includes("premium"))
      return "🏰";
    if (titleLower.includes("safari") || titleLower.includes("wildlife"))
      return "🦁";
    if (titleLower.includes("cruise") || titleLower.includes("yacht"))
      return "🛳️";
    if (titleLower.includes("wellness") || titleLower.includes("spa"))
      return "🧘";
    if (titleLower.includes("culinary") || titleLower.includes("food"))
      return "🍽️";

    return "✨";
  };

  // Luxury badge text based on trip features
  const getLuxuryBadge = (trip) => {
    if (trip.price > 10000) return "EXCLUSIVE";
    if (trip.duration_days > 10) return "EXTENDED";
    if (trip.category === "luxury") return "PREMIUM";
    return "FEATURED";
  };

  // Difficulty level with visual indicator
  const getDifficultyLevel = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("extreme") || titleLower.includes("challenging"))
      return { level: 5, text: "EXTREME" };
    if (titleLower.includes("moderate") || titleLower.includes("intermediate"))
      return { level: 3, text: "MODERATE" };
    return { level: 1, text: "LEISURE" };
  };

  // Generate luxury image URL (using placeholder with index for variety)
  const getLuxuryImage = () => {
    const images = [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80",
    ];
    return images[index % images.length];
  };

  // Get proper image URL (handle backend relative URLs)
  const getImageUrl = () => {
    if (!trip.image || trip.image.trim() === "") return getLuxuryImage();
    // If it's already a full URL (Cloudinary, etc.), use it directly
    if (trip.image.startsWith("http")) return trip.image;
    // Otherwise, prepend the backend URL for relative paths
    const backendUrl =
      import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
      "http://localhost:8000";
    return `${backendUrl}${trip.image}`;
  };

  const luxuryGradient = getLuxuryGradient(trip.category);
  const luxuryIcon = getLuxuryIcon(trip.category, trip.title);
  const luxuryBadge = getLuxuryBadge(trip);
  const difficulty = getDifficultyLevel(trip.title);
  const [currentImage, setCurrentImage] = useState(getImageUrl());

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    // Fall back to placeholder images if the original fails
    setCurrentImage(getLuxuryImage());
  };

  const handleCardClick = () => {
    if (onView) onView(trip.id);
    navigate(`/trips/${trip.id}`);
  };

  return (
    <div
      className={`${styles.ultraLuxuryCard} ${isHovered ? styles.cardHovered : ""} ${isLoading ? styles.cardLoading : ""}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-aos="fade-up"
      data-aos-delay={(index % 3) * 100}
    >
      {/* Card Glow Effect */}
      <div
        className={styles.cardGlow}
        style={{ background: luxuryGradient }}
      ></div>

      {/* Card Border */}
      <div className={styles.cardBorder}></div>

      {/* Card Header with Image */}
      <div className={styles.cardHeader}>
        <div className={styles.imageContainer}>
          {!imageLoaded && (
            <div
              className={styles.imagePlaceholder}
              style={{ background: luxuryGradient }}
            >
              <div className={styles.placeholderIcon}>{luxuryIcon}</div>
            </div>
          )}
          <img
            src={currentImage}
            alt={trip.title}
            className={`${styles.cardImage} ${imageLoaded ? styles.imageLoaded : ""}`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          <div className={styles.imageOverlay}></div>
        </div>

        {/* Floating Price Badge */}
        <div className={styles.priceFloat}>
          <div className={styles.priceFloatLabel}>From</div>
          <div className={styles.priceFloatDivider}></div>
          <div>
            <div className={styles.priceFloatAmount}>
              {formatPrice(trip.price)}
            </div>
            <div className={styles.priceFloatPer}>per person</div>
          </div>
        </div>

        {/* Luxury Badge */}
        <div className={styles.luxuryBadge}>
          <span className={styles.badgeIcon}>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L14.2451 8.90983H21.5106L15.6327 13.1803L17.8779 20.0902L12 15.8197L6.12215 20.0902L8.36729 13.1803L2.48944 8.90983H9.75486L12 2Z" />
            </svg>
          </span>
          <span className={styles.badgeText}>{luxuryBadge}</span>
          <div className={styles.badgeGlow}></div>
        </div>

        {/* Quick View */}
        <button
          className={styles.quickViewButton}
          onClick={(e) => {
            e.stopPropagation();
            // Handle quick view modal
          }}
        >
          <span className={styles.quickViewIcon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>

      {/* Card Content */}
      <div className={styles.cardContent}>
        {/* Category & Duration */}
        <div className={styles.cardMeta}>
          <div className={styles.categoryTag}>
            <span className={styles.categoryIcon}>{luxuryIcon}</span>
            <span className={styles.categoryText}>
              {trip.category ? trip.category.toUpperCase() : "PREMIUM"}
            </span>
          </div>
          <div className={styles.duration}>
            <span className={styles.durationIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 6V12L16 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className={styles.durationText}>
              {trip.duration_days} DAYS
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className={styles.cardTitle}>
          {trip.title}
          <span className={styles.titleLine}></span>
        </h3>

        {/* Location */}
        <div className={styles.location}>
          <span className={styles.locationIcon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className={styles.locationText}>{trip.location}</span>
        </div>

        {/* Description */}
        <div className={styles.cardDescription}>
          <p>
            {trip.description.length > 120
              ? `${trip.description.substring(0, 120)}...`
              : trip.description}
          </p>
        </div>

        {/* Luxury Features */}
        <div className={styles.luxuryFeatures}>
          {["Private Guide", "Luxury Accommodation", "Fine Dining"].map(
            (feature, i) => (
              <div key={i} className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span className={styles.featureText}>{feature}</span>
              </div>
            ),
          )}
        </div>

        {/* Difficulty + Rating */}
        <div className={styles.additionalInfo}>
          <div className={styles.difficulty}>
            <div className={styles.difficultyLabel}>DIFFICULTY</div>
            <div className={styles.difficultyLevels}>
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`${styles.difficultyDot} ${level <= difficulty.level ? styles.difficultyActive : ""}`}
                ></div>
              ))}
            </div>
            <div className={styles.difficultyText}>{difficulty.text}</div>
          </div>

          <div className={styles.rating}>
            <div className={styles.ratingLabel}>RATING</div>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={styles.star}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L14.2451 8.90983H21.5106L15.6327 13.1803L17.8779 20.0902L12 15.8197L6.12215 20.0902L8.36729 13.1803L2.48944 8.90983H9.75486L12 2Z"
                      fill={star <= 4 ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
              ))}
            </div>
            <div className={styles.ratingText}>4.8/5</div>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cardFooter}>
          <button className={styles.bookButton}>
            <span className={styles.bookText}>EXPLORE JOURNEY</span>
            <span className={styles.bookArrow}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className={styles.buttonGlow}></div>
          </button>
        </div>
      </div>

      {/* Hover Effect Elements */}
      <div className={styles.hoverEffect}></div>
      <div
        className={styles.hoverLight}
        style={{ background: luxuryGradient }}
      ></div>

      {/* Loading State */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}>
            <div className={styles.spinnerCircle}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCard;
