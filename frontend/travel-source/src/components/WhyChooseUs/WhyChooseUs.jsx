import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./WhyChooseUs.module.css";
import { fetchSiteStats } from "../../services/api";

const features = [
  {
    icon: "🎯",
    title: "Expertly Curated Itineraries",
    description:
      "Carefully designed travel plans by local experts who know the destinations inside out.",
    color: "#3f9e8f",
  },
  {
    icon: "🛡️",
    title: "Safety First Approach",
    description:
      "Your safety is our priority with 24/7 support and verified accommodations.",
    color: "#5fb8a8",
  },
  {
    icon: "💎",
    title: "Premium Experiences",
    description:
      "Access exclusive experiences and hidden gems not found in typical tour packages.",
    color: "#2d7a6e",
  },
  {
    icon: "🤝",
    title: "Personalized Service",
    description:
      "Tailored journeys that match your preferences, pace, and travel style.",
    color: "#7ecfc0",
  },
  {
    icon: "✈️",
    title: "Customizable Travel Packages",
    description:
      "Tailor-made itineraries, flexible dates, and add-ons & upgrades available to suit your needs.",
    color: "#3f9e8f",
    highlights: [
      "Tailor-made itineraries",
      "Flexible dates",
      "Add-ons & upgrades available",
    ],
  },
];

const images = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
  "https://images.unsplash.com/photo-1519817914152-22f90e5b9e35",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
];

const WhyChooseUs = () => {
  const [hoveredImage, setHoveredImage] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const [siteStats, setSiteStats] = useState([]);
  const [animatedValues, setAnimatedValues] = useState({});
  const counterRef = useRef(null);
  const hasAnimated = useRef(false);

  // Fetch stats from backend
  useEffect(() => {
    fetchSiteStats()
      .then((data) => setSiteStats(data))
      .catch(() => {});
  }, []);

  // Animate counters when they scroll into view
  const animateCounters = useCallback(() => {
    if (hasAnimated.current || siteStats.length === 0) return;
    hasAnimated.current = true;

    const duration = 2000;
    const fps = 60;
    const totalFrames = Math.round((duration / 1000) * fps);
    let frame = 0;

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const counter = setInterval(() => {
      frame++;
      const progress = easeOutQuart(frame / totalFrames);

      const newValues = {};
      siteStats.forEach((stat) => {
        newValues[stat.key] = Math.round(stat.value * progress);
      });
      setAnimatedValues(newValues);

      if (frame >= totalFrames) {
        clearInterval(counter);
        const finalValues = {};
        siteStats.forEach((stat) => {
          finalValues[stat.key] = stat.value;
        });
        setAnimatedValues(finalValues);
      }
    }, 1000 / fps);
  }, [siteStats]);

  useEffect(() => {
    const node = counterRef.current;
    if (!node || siteStats.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) animateCounters();
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [siteStats, animateCounters]);

  return (
    <section className={styles.section}>
      {/* Background Overlay */}
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h4 className={styles.subHeading}>WHY CHOOSE US</h4>
          <h2 className={styles.heading}>Why Travel Professor</h2>
          <p className={styles.introText}>
            We transform ordinary trips into extraordinary journeys with
            expertise, care, and attention to detail.
          </p>
        </div>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Text Content */}
          <div className={styles.textContent}>
            <div className={styles.highlightBox}>
              <svg
                className={styles.highlightIcon}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <p className={styles.highlightText}>
                At <span className={styles.highlight}>Travel Professor</span>,
                we believe travel should be more than just visiting places — it
                should be about creating unforgettable experiences. From
                carefully curated itineraries to on-ground support, we focus on
                quality, safety, and comfort.
              </p>
            </div>

            <p className={styles.text}>
              Our team combines local expertise with modern planning to ensure
              every journey is smooth, exciting, and memorable. Whether you're a
              solo traveler, a group explorer, or a first-time adventurer, we
              make sure you travel with confidence.
            </p>

            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>500+</div>
                <div className={styles.statLabel}>Happy Travelers</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>98%</div>
                <div className={styles.statLabel}>Satisfaction Rate</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>50+</div>
                <div className={styles.statLabel}>Destinations</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>24/7</div>
                <div className={styles.statLabel}>Support</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className={styles.featuresSection}>
            <h3 className={styles.featuresTitle}>What Makes Us Different</h3>

            <div className={styles.featuresGrid}>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`${styles.featureCard} ${activeFeature === index ? styles.featureCardActive : ""}`}
                  onMouseEnter={() => setActiveFeature(index)}
                  onClick={() => setActiveFeature(index)}
                  style={{ "--feature-color": feature.color }}
                >
                  <div className={styles.featureHeader}>
                    <div className={styles.featureIcon}>{feature.icon}</div>
                    <h4 className={styles.featureTitle}>{feature.title}</h4>
                  </div>
                  <p className={styles.featureDescription}>
                    {feature.description}
                  </p>
                  {feature.highlights && (
                    <ul className={styles.featureHighlights}>
                      {feature.highlights.map((item, i) => (
                        <li key={i} className={styles.featureHighlightItem}>
                          <span className={styles.featureCheckmark}>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className={styles.featureArrow}>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.ctaBox}>
              <p className={styles.ctaText}>
                With hundreds of happy travelers and a growing community, Travel
                Professor is not just a travel company — it's a trusted
                companion for your journeys.
              </p>
              <button className={styles.ctaButton}>
                <svg
                  className={styles.ctaIcon}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Start Your Journey
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className={styles.gallerySection}>
          <div className={styles.galleryHeader}>
            <h3 className={styles.galleryTitle}>Travel Experiences Gallery</h3>
            <p className={styles.gallerySubtitle}>
              Glimpses of unforgettable moments created by our travelers
            </p>
          </div>

          <div className={styles.galleryGrid}>
            {images.map((img, index) => (
              <div
                key={index}
                className={styles.imageCard}
                onMouseEnter={() => setHoveredImage(index)}
                onMouseLeave={() => setHoveredImage(null)}
                style={{
                  transform:
                    hoveredImage === index
                      ? "translateY(-8px)"
                      : "translateY(0)",
                  zIndex: hoveredImage === index ? 10 : 1,
                }}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={`${img}?auto=format&fit=crop&w=800&q=80`}
                    alt="Travel experience"
                    loading="lazy"
                  />
                  <div className={styles.imageOverlay}>
                    <div className={styles.overlayContent}>
                      <svg
                        className={styles.zoomIcon}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className={styles.viewText}>View Experience</span>
                    </div>
                  </div>
                </div>
                <div className={styles.imageCaption}>
                  <span className={styles.imageNumber}>0{index + 1}</span>
                  <span className={styles.imageLabel}>Memorable Moment</span>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative Elements */}
          <div className={styles.decorationElements}>
            <div
              className={styles.decorationCircle}
              style={{ top: "10%", left: "5%" }}
            ></div>
            <div
              className={styles.decorationCircle}
              style={{ top: "20%", right: "10%" }}
            ></div>
            <div
              className={styles.decorationCircle}
              style={{ bottom: "30%", left: "15%" }}
            ></div>
          </div>
        </div>

        {/* Animated Stats Counter */}
        {siteStats.length > 0 && (
          <div className={styles.counterSection} ref={counterRef}>
            <div className={styles.counterHeader}>
              <span className={styles.counterIcon}>📊</span>
              <h3 className={styles.counterTitle}>Our Journey in Numbers</h3>
              <p className={styles.counterSubtitle}>
                Real-time stats that reflect our commitment to exceptional
                travel experiences
              </p>
            </div>
            <div className={styles.counterGrid}>
              {siteStats.map((stat) => (
                <div key={stat.key} className={styles.counterCard}>
                  <span className={styles.counterEmoji}>{stat.icon}</span>
                  <span className={styles.counterValue}>
                    {animatedValues[stat.key] ?? 0}
                    {stat.key === "satisfaction_rate" ? "%" : "+"}
                  </span>
                  <span className={styles.counterLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div className={styles.trustSection}>
          <div className={styles.trustContent}>
            <h3 className={styles.trustTitle}>
              Trusted By Travelers Worldwide
            </h3>
            <div className={styles.trustBadges}>
              <div className={styles.trustBadge}>
                <svg
                  className={styles.badgeIcon}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Verified Reviews</span>
              </div>
              <div className={styles.trustBadge}>
                <svg
                  className={styles.badgeIcon}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure Payments</span>
              </div>
              <div className={styles.trustBadge}>
                <svg
                  className={styles.badgeIcon}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Travel Insurance</span>
              </div>
              <div className={styles.trustBadge}>
                <svg
                  className={styles.badgeIcon}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Expert Guides</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
