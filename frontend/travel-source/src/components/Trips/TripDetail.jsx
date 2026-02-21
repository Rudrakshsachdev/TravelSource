import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTripDetail, submitEnquiry } from "../../services/api";
import styles from "./TripDetail.module.css";

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [isSticky, setIsSticky] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [revealedSections, setRevealedSections] = useState(new Set());
  const bookingCardRef = useRef(null);
  const heroRef = useRef(null);
  const quickInfoRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const data = await fetchTripDetail(id);
        setTrip(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (bookingCardRef.current && heroRef.current) {
        const bookingCard = bookingCardRef.current;
        const hero = heroRef.current;
        const heroBottom = hero.offsetTop + hero.offsetHeight;

        // For sticky booking card on desktop
        if (window.scrollY > heroBottom) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }

        // For floating button on mobile
        if (window.innerWidth < 1024) {
          const bookingCardRect = bookingCard.getBoundingClientRect();
          if (bookingCardRect.top < 0) {
            setShowFloatingButton(true);
          } else {
            setShowFloatingButton(false);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax effect for hero image
  useEffect(() => {
    const handleParallax = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const heroHeight = heroRef.current.offsetHeight;
        if (scrollY < heroHeight) {
          setParallaxOffset(scrollY * 0.3);
        }
      }
    };
    window.addEventListener("scroll", handleParallax, { passive: true });
    return () => window.removeEventListener("scroll", handleParallax);
  }, []);

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealedSections(
              (prev) => new Set([...prev, entry.target.dataset.reveal]),
            );
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );

    const elements = document.querySelectorAll("[data-reveal]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [trip, activeTab]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotal = () => {
    if (!trip) return 0;
    return trip.price * travelers;
  };

  const getTripTypeIcon = (title) => {
    const titleLower = title?.toLowerCase() || "";
    if (
      titleLower.includes("beach") ||
      titleLower.includes("sea") ||
      titleLower.includes("ocean")
    ) {
      return "🏖️";
    } else if (
      titleLower.includes("mountain") ||
      titleLower.includes("hiking") ||
      titleLower.includes("trek")
    ) {
      return "⛰️";
    } else if (titleLower.includes("city") || titleLower.includes("urban")) {
      return "🏙️";
    } else if (
      titleLower.includes("cultural") ||
      titleLower.includes("heritage")
    ) {
      return "🏛️";
    } else if (
      titleLower.includes("adventure") ||
      titleLower.includes("sports")
    ) {
      return "🚴";
    } else {
      return "🧳";
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitEnquiry({
        trip: trip.id,
        ...formData,
      });

      setSuccess(
        "Thanks! We’ve received your enquiry and will contact you soon.",
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setShowForm(false);

      // Auto-dismiss success message after 5 seconds
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch {
      alert("Failed to submit enquiry");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingAnimation}>
            <div className={styles.loadingIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <h2 className={styles.loadingTitle}>Mapping Your Journey</h2>
          <p className={styles.loadingSubtitle}>
            Loading all the details for your perfect adventure...
          </p>
          <div className={styles.loadingProgress}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <div className={styles.errorIllustration}>
            <div className={styles.errorCompass}>
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M50 10V90" stroke="currentColor" strokeWidth="2" />
                <path d="M10 50H90" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="8" fill="currentColor" />
              </svg>
            </div>
          </div>
          <h2 className={styles.errorTitle}>Journey Not Found</h2>
          <p className={styles.errorMessage}>
            {error || "We couldn't find the trip details you're looking for."}
          </p>
          <div className={styles.errorActions}>
            <button
              className={styles.primaryErrorButton}
              onClick={() => navigate("/trips")}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Trips
            </button>
            <button
              className={styles.secondaryErrorButton}
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tripDetailPage}>
      {/* Ambient Background Orbs */}
      <div className={styles.ambientOrbs}>
        <div className={styles.ambientOrb1} />
        <div className={styles.ambientOrb2} />
        <div className={styles.ambientOrb3} />
      </div>

      {/* Hero Section */}
      <div className={styles.heroSection} ref={heroRef}>
        <div className={styles.heroImage}>
          <img
            src={
              trip.image ||
              "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            }
            alt={trip.title}
            style={{ transform: `translateY(${parallaxOffset}px) scale(1.05)` }}
          />
          <div className={styles.imageOverlay}></div>
          <div className={styles.heroVignette}></div>

          {/* Breadcrumb Navigation */}
          <div className={styles.heroBreadcrumb}>
            <button className={styles.backButton} onClick={() => navigate("/")}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back
            </button>
            <nav className={styles.breadcrumbNav}>
              <span
                className={styles.breadcrumbItem}
                onClick={() => navigate("/")}
              >
                Home
              </span>
              <span className={styles.breadcrumbSep}>›</span>
              <span
                className={styles.breadcrumbItem}
                onClick={() => navigate("/trips")}
              >
                Trips
              </span>
              <span className={styles.breadcrumbSep}>›</span>
              <span className={styles.breadcrumbCurrent}>{trip.title}</span>
            </nav>
          </div>

          {/* Experience Badges */}
          <div className={styles.experienceBadges}>
            <div className={styles.expBadge}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              <span>Small Group</span>
            </div>
            <div className={styles.expBadge}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Expert Guide</span>
            </div>
            <div className={styles.expBadge}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Photo Worthy</span>
            </div>
          </div>

          {/* Hero Content - Now inside the image overlay */}
          <div className={styles.heroContent}>
            <div className={styles.heroHeader}>
              <div className={styles.tripType}>
                <span className={styles.tripTypeIcon}>
                  {getTripTypeIcon(trip.title)}
                </span>
                <span className={styles.tripTypeLabel}>
                  {trip.is_international ? "International" : "Adventure"}
                </span>
              </div>
              <div className={styles.heroMeta}>
                <div className={styles.metaItem}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {trip.location}
                    {trip.country ? `, ${trip.country}` : ""}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{trip.duration_days} Days</span>
                </div>
              </div>
            </div>

            <h1 className={styles.heroTitle}>{trip.title}</h1>
            <p className={styles.heroSubtitle}>
              {trip.short_description ||
                "An unforgettable journey filled with amazing experiences and breathtaking views"}
            </p>

            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>4.8</span>
                <span className={styles.statLabel}>Rating</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>120+</span>
                <span className={styles.statLabel}>Travelers</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>⭐</span>
                <span className={styles.statLabel}>Featured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollMouse}>
            <div className={styles.scrollWheel}></div>
          </div>
          <span>Scroll to explore</span>
        </div>
      </div>

      {/* Quick Info Strip */}
      <div
        className={styles.quickInfoStrip}
        ref={quickInfoRef}
        data-reveal="quickInfo"
      >
        <div
          className={`${styles.quickInfoInner} ${revealedSections.has("quickInfo") ? styles.revealed : ""}`}
        >
          <div className={styles.quickInfoItem}>
            <div className={styles.quickInfoIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className={styles.quickInfoText}>
              <span className={styles.quickInfoLabel}>Duration</span>
              <span className={styles.quickInfoValue}>
                {trip.duration_days} Days
              </span>
            </div>
          </div>
          <div className={styles.quickInfoDivider} />
          <div className={styles.quickInfoItem}>
            <div className={styles.quickInfoIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className={styles.quickInfoText}>
              <span className={styles.quickInfoLabel}>Destination</span>
              <span className={styles.quickInfoValue}>{trip.location}</span>
            </div>
          </div>
          <div className={styles.quickInfoDivider} />
          <div className={styles.quickInfoItem}>
            <div className={styles.quickInfoIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className={styles.quickInfoText}>
              <span className={styles.quickInfoLabel}>Starting From</span>
              <span className={styles.quickInfoValue}>
                {formatPrice(trip.price)}
              </span>
            </div>
          </div>
          <div className={styles.quickInfoDivider} />
          <div className={styles.quickInfoItem}>
            <div className={styles.quickInfoIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className={styles.quickInfoText}>
              <span className={styles.quickInfoLabel}>Rating</span>
              <span className={styles.quickInfoValue}>4.8 / 5.0</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Left Column - Content */}
        <div
          className={styles.contentColumn}
          ref={contentRef}
          data-reveal="content"
        >
          {/* Tabs Navigation */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "overview" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <svg
                className={styles.tabIcon}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Overview</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === "itinerary" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("itinerary")}
            >
              <svg
                className={styles.tabIcon}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Itinerary</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === "inclusions" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("inclusions")}
            >
              <svg
                className={styles.tabIcon}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Inclusions</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === "reviews" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              <svg
                className={styles.tabIcon}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Reviews</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === "overview" && (
              <div className={styles.tabPane}>
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    About This Journey
                  </h3>
                  <p className={styles.sectionText}>{trip.description}</p>
                </div>

                <div className={styles.highlights}>
                  <h4 className={styles.highlightsTitle}>Trip Highlights</h4>
                  <div className={styles.highlightsGrid}>
                    {trip.highlights && trip.highlights.length > 0 ? (
                      trip.highlights.map((highlight, index) => (
                        <div key={index} className={styles.highlightItem}>
                          <div className={styles.highlightIcon}>
                            {highlight.icon || "📍"}
                          </div>
                          <div className={styles.highlightContent}>
                            <h5>{highlight.title}</h5>
                            <p>{highlight.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={styles.noData}>
                        Stay tuned! We are finalizing the breathtaking
                        highlights for this journey.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "itinerary" && (
              <div className={styles.tabPane}>
                <div className={styles.itinerary}>
                  <h3 className={styles.sectionTitle}>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Daily Itinerary
                  </h3>
                  <div className={styles.itineraryContent}>
                    {trip.itinerary &&
                    Array.isArray(trip.itinerary) &&
                    trip.itinerary.length > 0 ? (
                      <div className={styles.itineraryDays}>
                        {trip.itinerary.map((day, index) => (
                          <div key={index} className={styles.itineraryDay}>
                            <div className={styles.dayNumber}>
                              Day {index + 1}
                            </div>
                            <div className={styles.dayContent}>
                              <h5 className={styles.dayTitle}>{day.title}</h5>
                              <p className={styles.dayDescription}>
                                {day.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyItinerary}>
                        <p>
                          Detailed itinerary coming soon. Our travel experts are
                          crafting the perfect daily schedule for you.
                        </p>
                        <div className={styles.itineraryDays}>
                          {Array.from(
                            { length: trip.duration_days || 3 },
                            (_, i) => (
                              <div key={i} className={styles.itineraryDay}>
                                <div className={styles.dayNumber}>
                                  Day {i + 1}
                                </div>
                                <div className={styles.dayContent}>
                                  <div className={styles.dayPlaceholder}></div>
                                  <div className={styles.dayPlaceholder}></div>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "inclusions" && (
              <div className={styles.tabPane}>
                <div className={styles.inclusions}>
                  <h3 className={styles.sectionTitle}>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    What's Included
                  </h3>
                  <div className={styles.inclusionsGrid}>
                    <div className={styles.inclusionsColumn}>
                      <h4>Included</h4>
                      <ul>
                        {trip.inclusions && trip.inclusions.length > 0 ? (
                          trip.inclusions.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                        ) : (
                          <>
                            <li>All accommodation as per itinerary</li>
                            <li>Expert local guide services</li>
                            <li>Selected meals and activities</li>
                          </>
                        )}
                      </ul>
                    </div>
                    <div className={styles.inclusionsColumn}>
                      <h4>Not Included</h4>
                      <ul>
                        {trip.exclusions && trip.exclusions.length > 0 ? (
                          trip.exclusions.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                        ) : (
                          <>
                            <li>International flights</li>
                            <li>Travel insurance</li>
                            <li>Personal expenses</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className={styles.tabPane}>
                <div className={styles.reviews}>
                  <h3 className={styles.sectionTitle}>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Traveler Reviews
                  </h3>
                  <div className={styles.reviewsContent}>
                    <div className={styles.reviewSummary}>
                      <div className={styles.ratingOverview}>
                        <div className={styles.ratingNumber}>4.8</div>
                        <div className={styles.ratingStars}>
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <div className={styles.ratingCount}>
                          Based on 42 reviews
                        </div>
                      </div>
                    </div>
                    <p className={styles.noReviewsMessage}>
                      Be the first to review this trip after your journey!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div
          className={`${styles.bookingColumn} ${isSticky ? styles.sticky : ""}`}
          ref={bookingCardRef}
          data-reveal="booking"
        >
          <div
            className={`${styles.bookingCard} ${revealedSections.has("booking") ? styles.revealed : ""}`}
          >
            {/* Urgency Badge */}
            <div className={styles.urgencyBadge}>
              <span className={styles.urgencyDot}></span>
              <span>Limited Availability — Book Now</span>
            </div>

            <div className={styles.bookingHeader}>
              <h3>Book This Adventure</h3>
              <div className={styles.priceDisplay}>
                <span className={styles.priceLabel}>Starting from</span>
                <span className={styles.priceValue}>
                  {formatPrice(trip.price)}
                </span>
                <span className={styles.priceNote}>per person</span>
              </div>
            </div>

            <div className={styles.bookingForm}>
              <div className={styles.formGroup}>
                <label>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={styles.dateInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Travelers
                </label>
                <div className={styles.travelerSelector}>
                  <button
                    className={styles.selectorButton}
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  >
                    -
                  </button>
                  <span className={styles.travelerCount}>{travelers}</span>
                  <button
                    className={styles.selectorButton}
                    onClick={() => setTravelers(travelers + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={styles.priceSummary}>
                <div className={styles.summaryRow}>
                  <span>
                    {trip.price} × {travelers} traveler
                    {travelers > 1 ? "s" : ""}
                  </span>
                  <span>{formatPrice(trip.price * travelers)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Service fee</span>
                  <span>{formatPrice(500)}</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal() + 500)}</span>
                </div>
              </div>

              {success && <p className={styles.successMessage}>{success}</p>}

              {!showForm ? (
                <button
                  className={styles.primaryCTA}
                  onClick={() => setShowForm(true)}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Enquire Now
                </button>
              ) : (
                <form className={styles.enquiryForm} onSubmit={handleSubmit}>
                  <input
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.enquiryInput}
                  />

                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.enquiryInput}
                  />

                  <input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={styles.enquiryInput}
                  />

                  <textarea
                    name="message"
                    placeholder="Message (optional)"
                    value={formData.message}
                    onChange={handleChange}
                    className={styles.enquiryTextarea}
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className={styles.primaryCTA}
                  >
                    {submitting ? "Submitting..." : "Submit Enquiry"}
                  </button>
                </form>
              )}

              <button
                className={styles.secondaryCTA}
                onClick={() => navigate(`/trips/${id}/book`)}
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Book Now
              </button>
            </div>

            <div className={styles.bookingFooter}>
              <div className={styles.guarantee}>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Best Price Guarantee</span>
              </div>
              <div className={styles.guarantee}>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Flexible Cancellation</span>
              </div>
              <div className={styles.guarantee}>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFloatingButton && (
        <div className={styles.floatingButtonContainer}>
          <button
            className={styles.floatingButton}
            onClick={() => navigate(`/trips/${id}/book`)}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Book Now — {formatPrice(trip.price)}
          </button>
        </div>
      )}
    </div>
  );
};

export default TripDetail;
