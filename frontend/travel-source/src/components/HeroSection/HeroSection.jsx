import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./HeroSection.module.css";
import {
  Search,
  Star,
  MessageSquare,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Calendar,
  Compass,
  Play,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   HeroSection — Advanced JustWravel-inspired
   Cinematic bg, booking form, glassmorphism cards, trust bar
   ═══════════════════════════════════════════════════════════════ */

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
  "https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=1920&q=80",
];

const INLINE_IMAGES = [
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=80",
];

const DESTINATIONS = [
  "Kashmir",
  "Ladakh",
  "Himachal",
  "Manali",
  "Spiti Valley",
  "Goa",
  "Rishikesh",
  "Meghalaya",
];

const TESTIMONIALS = [
  {
    name: "Ankit Verma",
    initials: "A",
    color: "linear-gradient(135deg, #f97316, #ef4444)",
    trip: "Bali Group Tour",
    text: "Booking a trip to Bali had always been a dream, and thanks to Travel Professor, it was an experience that exceeded every expectation. From the itinerary to the stays — perfect!",
    stars: 5,
  },
  {
    name: "Sneha Kulkarni",
    initials: "S",
    color: "linear-gradient(135deg, #8b5cf6, #6366f1)",
    trip: "Rishikesh Corporate Retreat",
    text: "The Rishikesh corporate retreat with Travel Professor was nothing short of exceptional. From the planning phase to the on-ground execution, everything was seamless.",
    stars: 5,
  },
  {
    name: "Neha Agarwal",
    initials: "N",
    color: "linear-gradient(135deg, #ec4899, #f43f5e)",
    trip: "Kashmir Backpacking",
    text: "I recently went on a trip with Travel Professor and had a fantastic experience! Everything was so well-organized, from the itinerary to the stay and activities.",
    stars: 5,
  },
  {
    name: "Rahul Mehra",
    initials: "R",
    color: "linear-gradient(135deg, #14b8a6, #0d9488)",
    trip: "Ladakh Bike Trip",
    text: "Incredible roads, breathtaking views. Travel Professor made the tough terrain feel completely seamless. Will definitely book again.",
    stars: 5,
  },
  {
    name: "Priya Sharma",
    initials: "P",
    color: "linear-gradient(135deg, #eab308, #ca8a04)",
    trip: "Spiti Valley Expedition",
    text: "Solo-friendly, well-organized, and the most unforgettable mountain sunrise I've ever seen! The group was amazing.",
    stars: 5,
  },
];

const TRUST_STATS = [
  { icon: <MessageSquare size={22} />, number: "10,000+", label: "Reviews" },
  { icon: <Users size={22} />, number: "80,000+", label: "Satisfied Travelers" },
  { icon: <MapPin size={22} />, number: "50+", label: "Destinations" },
  { icon: <Clock size={22} />, number: "9+ Years", label: "Experience" },
];

const CATEGORIES = [
  { id: "weekend", label: "Long Weekend", emoji: "🌅" },
  { id: "international", label: "International", emoji: "✈️" },
  { id: "ladakh", label: "Ladakh", emoji: "🏔️" },
  { id: "spiti", label: "Spiti", emoji: "🏍️" },
  { id: "treks", label: "Treks", emoji: "🥾" },
  { id: "biking", label: "Biking", emoji: "🚴" },
  { id: "backpacking", label: "Backpacking", emoji: "🎒" },
  { id: "allgirls", label: "All Girls", emoji: "👩‍👩‍👧" },
];

const HeroSection = () => {
  const [entered, setEntered] = useState(false);
  const [destIndex, setDestIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [prevBgIndex, setPrevBgIndex] = useState(null);
  const destKeyRef = useRef(0);

  useEffect(() => {
    const t = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(t);
  }, []);

  /* Rotate destination every 3s */
  useEffect(() => {
    const interval = setInterval(() => {
      setDestIndex((prev) => (prev + 1) % DESTINATIONS.length);
      destKeyRef.current += 1;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /* Cycle background every 8s with crossfade */
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevBgIndex(bgIndex);
      setBgIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [bgIndex]);

  const scrollToTrips = useCallback(() => {
    const el =
      document.getElementById("trips-grid") ||
      document.getElementById("trips");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  }, []);

  return (
    <section
      className={`${styles.hero} ${entered ? styles.entered : ""}`}
      id="hero"
    >
      {/* ═══ Background with crossfade ═══ */}
      <div className={styles.heroBg}>
        {BG_IMAGES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden="true"
            className={`${styles.heroBgImg} ${i === bgIndex ? styles.visible : ""}`}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
        <div className={styles.heroBgOverlay} />
      </div>

      {/* ═══ Main Content ═══ */}
      <div className={styles.heroContent}>
        {/* Left Column */}
        <div className={styles.leftCol}>
          {/* Subtitle */}
          <div className={styles.subtitle}>
            <span className={styles.subtitleAccent}>Wander</span>
            <span className={styles.subtitleSep}>|</span>
            <span>Travel</span>
            <span className={styles.subtitleSep}>|</span>
            <span className={styles.subtitleAccent}>Connect</span>
            <span className={styles.subtitleSep}>|</span>
            <span>Repeat</span>
          </div>

          {/* Heading with inline image + rotating destination */}
          <h1 className={styles.heading}>
            Book Your{" "}
            <span className={styles.inlineImgWrap}>
              <img
                src={INLINE_IMAGES[destIndex % INLINE_IMAGES.length]}
                alt=""
                className={styles.inlineImg}
              />
            </span>{" "}
            Trip to{" "}
            <span className={styles.destWord}>
              <span className={styles.destText} key={destKeyRef.current}>
                {DESTINATIONS[destIndex]}
              </span>
            </span>
          </h1>

          {/* Tagline */}
          <p className={styles.tagline}>
            Where Adventure meets Community. Join thousands exploring India's
            most stunning destinations with expert-led group trips.{" "}
            <span className={styles.hashtag}>#travelprofessor</span>
          </p>

          {/* ═══ Booking Card ═══ */}
          <div className={styles.bookingCard}>
            <div className={styles.bookingInner}>
              <button className={styles.bookingField} onClick={scrollToTrips}>
                <div className={styles.fieldIcon}>
                  <MapPin />
                  <span className={styles.fieldLabel}>Destination</span>
                </div>
                <span className={`${styles.fieldValue} ${styles.fieldPlaceholder}`}>
                  Where to?
                </span>
              </button>

              <button className={styles.bookingField} onClick={scrollToTrips}>
                <div className={styles.fieldIcon}>
                  <Compass />
                  <span className={styles.fieldLabel}>Trip Type</span>
                </div>
                <span className={`${styles.fieldValue} ${styles.fieldPlaceholder}`}>
                  Backpacking
                </span>
              </button>

              <button className={styles.bookingField} onClick={scrollToTrips}>
                <div className={styles.fieldIcon}>
                  <Calendar />
                  <span className={styles.fieldLabel}>When</span>
                </div>
                <span className={`${styles.fieldValue} ${styles.fieldPlaceholder}`}>
                  Select month
                </span>
              </button>

              <button
                className={styles.bookingSearchBtn}
                onClick={scrollToTrips}
                id="hero-search-cta"
              >
                <Search size={18} />
                Search
              </button>
            </div>
          </div>

          {/* Decorative arrow */}
          <div className={styles.arrowDecor} aria-hidden="true">
            <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
              <path
                d="M4 36C12 26 22 8 42 12C62 16 56 32 72 8"
                stroke="#a3e635"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 3"
                fill="none"
              />
              <path
                d="M68 4L74 9L66 12"
                stroke="#a3e635"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* CTA Buttons */}
          <div className={styles.ctaRow}>
            <button
              className={styles.ctaPrimary}
              onClick={scrollToTrips}
              id="hero-explore-cta"
            >
              Explore Trips
              <ArrowRight size={16} />
            </button>
            <button
              className={styles.ctaSecondary}
              onClick={scrollToTrips}
              id="hero-upcoming-cta"
            >
              <Play size={14} />
              View Upcoming Trips
            </button>
          </div>
        </div>

        {/* Right Column — Scrolling Testimonials */}
        <div className={styles.rightCol}>
          <div className={styles.testimonialsTrack}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div className={styles.testimonialCard} key={i}>
                <div className={styles.cardTop}>
                  <div
                    className={styles.cardAvatar}
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div className={styles.cardMeta}>
                    <div className={styles.cardName}>{t.name}</div>
                    <div className={styles.cardTrip}>{t.trip}</div>
                  </div>
                  <div className={styles.cardStars}>
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} size={13} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className={styles.cardBody}>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Trust Stats ═══ */}
      <div className={styles.trustBar}>
        <div className={styles.trustInner}>
          {TRUST_STATS.map((stat, i) => (
            <div className={styles.trustItem} key={i}>
              <div className={styles.trustIcon}>{stat.icon}</div>
              <div className={styles.trustTextWrap}>
                <span className={styles.trustNumber}>{stat.number}</span>
                <span className={styles.trustLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Category Strip ═══ */}
      <div className={styles.catStrip}>
        <div className={styles.catInner}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={styles.catItem}
              onClick={scrollToTrips}
            >
              <div className={styles.catThumb}>
                <div className={styles.catThumbInner}>
                  <span className={styles.catEmoji}>{cat.emoji}</span>
                </div>
              </div>
              <span className={styles.catLabel}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
