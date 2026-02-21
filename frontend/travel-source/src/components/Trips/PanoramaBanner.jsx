import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./PanoramaBanner.module.css";

/* ── Destination cards with fan layout (right side) ── */
const DESTINATION_CARDS = [
  {
    src: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=520&fit=crop&q=80",
    label: "Bali",
    price: "₹32,999",
  },
  {
    src: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=400&h=520&fit=crop&q=80",
    label: "Sri Lanka",
    price: "₹28,499",
  },
  {
    src: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400&h=520&fit=crop&q=80",
    label: "Georgia",
    price: "₹45,999",
  },
  {
    src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=520&fit=crop&q=80",
    label: "Vietnam",
    price: "₹26,999",
  },
  {
    src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=520&fit=crop&q=80",
    label: "Kashmir",
    price: "₹18,499",
  },
];

/* ── Scrolling ticker destinations ── */
const TICKER_DESTINATIONS = [
  "Ladakh",
  "Spiti",
  "Meghalaya",
  "Bhutan",
  "Kashmir",
  "Vietnam",
  "Thailand",
  "Bali",
  "Sri Lanka",
  "Georgia",
  "Manali",
  "Goa",
  "Rajasthan",
  "Kerala",
  "Andaman",
  "Nepal",
  "Maldives",
  "Sikkim",
  "Darjeeling",
  "Uttarakhand",
  "Ooty",
  "Munnar",
  "Coorg",
  "Himachal",
  "Srinagar",
  "Shimla",
  "Goa",
  "Kerala",
  "Andaman",
  "Thailand",
  "Bali",
  "Sri Lanka",
  "Georgia",
];

/* ── Sparkle positions (decorative floating dots) ── */
const SPARKLES = [
  { top: "12%", left: "8%", size: 4, delay: 0 },
  { top: "25%", left: "92%", size: 3, delay: 1.2 },
  { top: "68%", left: "15%", size: 5, delay: 0.6 },
  { top: "35%", left: "78%", size: 3, delay: 1.8 },
  { top: "80%", left: "85%", size: 4, delay: 0.3 },
  { top: "18%", left: "55%", size: 3, delay: 2.1 },
  { top: "60%", left: "42%", size: 4, delay: 1.5 },
  { top: "45%", left: "95%", size: 3, delay: 0.9 },
];

/* ── Countdown target: Feb 28, 2026 midnight ── */
const OFFER_END = new Date("2026-02-28T23:59:59");

const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = targetDate - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  });

  useEffect(() => {
    const tick = () => {
      const diff = targetDate - new Date();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
};

const PanoramaBanner = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const bannerRef = useRef(null);
  const countdown = useCountdown(OFFER_END);

  /* ── Mouse-follow parallax ── */
  const handleMouseMove = useCallback((e) => {
    if (!bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div
      ref={bannerRef}
      className={`${styles.banner} ${isPaused ? styles.paused : ""}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
    >
      {/* ── Animated gradient background layer ── */}
      <div className={styles.bgAnimatedGradient} />

      {/* ── Background pattern overlay ── */}
      <div className={styles.bgPattern} />
      <div className={styles.bgGlow} />
      <div className={styles.bgGlow2} />

      {/* ── Floating sparkle particles ── */}
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className={styles.sparkle}
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* ── Floating travel decorations ── */}
      <div className={styles.floatingDeco}>
        {/* Airplane */}
        <svg
          className={`${styles.decoIcon} ${styles.decoPlane}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12 19V5M5 12l7-7 7 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21.5 12.5L12 2 2.5 12.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0"
          />
          <path
            d="M2 15.5L8.5 9l3.5 3.5 5-5 5 2.5-1 4-5-2-3.5 3.5L8 11l-6 4.5z"
            fill="currentColor"
            stroke="none"
          />
        </svg>

        {/* Compass */}
        <svg
          className={`${styles.decoIcon} ${styles.decoCompass}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon
            points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"
            fill="currentColor"
            opacity="0.3"
          />
        </svg>

        {/* Globe */}
        <svg
          className={`${styles.decoIcon} ${styles.decoGlobe}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" />
        </svg>

        {/* Map Pin */}
        <svg
          className={`${styles.decoIcon} ${styles.decoPin}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>

      {/* ── "Limited Time" ribbon ── */}
      <div className={styles.ribbon}>
        <span>⚡ Limited Time</span>
      </div>

      {/* ── Main content area ── */}
      <div className={styles.bannerContent}>
        {/* Left: Promo text */}
        <div className={styles.textBlock}>
          <div className={styles.textBlockGlass} />
          <div className={styles.textBlockInner}>
            <p className={styles.tagline}>
              <span className={styles.taglineIcon}>🎉</span>
              Deals are marching your way!
            </p>

            <h2 className={styles.headline}>
              <span className={styles.headlineBrand}>
                Travel Professor&apos;s
              </span>
              <span className={styles.headlineMain}>
                Early Bird{" "}
                <span className={styles.headlineHighlight}>
                  SALE
                  <span className={styles.saleShimmer} />
                </span>
              </span>
            </h2>

            <div className={styles.discountBadge}>
              <span className={styles.discountIcon}>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="16"
                  height="16"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Discounts upto <strong>₹7500/-</strong> off
            </div>

            {/* ── Live Countdown Timer ── */}
            <div className={styles.countdown}>
              <div className={styles.countdownLabel}>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="13"
                  height="13"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                Offer ends in
              </div>
              <div className={styles.countdownBoxes}>
                <div className={styles.countdownUnit}>
                  <span className={styles.countdownNumber}>
                    {pad(countdown.days)}
                  </span>
                  <span className={styles.countdownSub}>Days</span>
                </div>
                <span className={styles.countdownSep}>:</span>
                <div className={styles.countdownUnit}>
                  <span className={styles.countdownNumber}>
                    {pad(countdown.hours)}
                  </span>
                  <span className={styles.countdownSub}>Hrs</span>
                </div>
                <span className={styles.countdownSep}>:</span>
                <div className={styles.countdownUnit}>
                  <span className={styles.countdownNumber}>
                    {pad(countdown.minutes)}
                  </span>
                  <span className={styles.countdownSub}>Min</span>
                </div>
                <span className={styles.countdownSep}>:</span>
                <div className={styles.countdownUnit}>
                  <span className={styles.countdownNumber}>
                    {pad(countdown.seconds)}
                  </span>
                  <span className={styles.countdownSub}>Sec</span>
                </div>
              </div>
            </div>

            <div className={styles.ctaRow}>
              <button
                className={styles.ctaButton}
                onClick={() => {
                  const el = document.getElementById("trips-grid");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore Deals
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Social proof */}
              <div className={styles.socialProof}>
                <div className={styles.avatarStack}>
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt=""
                    className={styles.miniAvatar}
                  />
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt=""
                    className={styles.miniAvatar}
                  />
                  <img
                    src="https://randomuser.me/api/portraits/women/68.jpg"
                    alt=""
                    className={styles.miniAvatar}
                  />
                  <span className={styles.avatarMore}>+</span>
                </div>
                <span className={styles.proofText}>
                  <strong>520+</strong> booked this month
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Fanned destination cards with parallax */}
        <div
          className={styles.cardsGroup}
          style={{
            transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 6}px)`,
          }}
        >
          {DESTINATION_CARDS.map((card, index) => (
            <div
              key={card.label}
              className={`${styles.fanCard} ${styles[`fanCard${index + 1}`]}`}
              style={{
                transform: `translate(${mousePos.x * (index - 2) * 3}px, ${mousePos.y * (index - 2) * 2}px)`,
              }}
            >
              <img
                src={card.src}
                alt={card.label}
                loading="eager"
                draggable="false"
              />
              <div className={styles.fanCardOverlay} />
              <span className={styles.fanCardLabel}>{card.label}</span>
              <span className={styles.fanCardPrice}>{card.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Wave SVG divider ── */}
      <div className={styles.waveDivider}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path
            d="M0,30 C240,55 480,5 720,30 C960,55 1200,5 1440,30 L1440,60 L0,60 Z"
            fill="rgba(255,255,255,0.95)"
          />
          <path
            d="M0,35 C280,58 520,12 720,35 C920,58 1160,12 1440,35 L1440,60 L0,60 Z"
            fill="rgba(255,255,255,0.5)"
          />
        </svg>
      </div>

      {/* ── Scrolling destination ticker ── */}
      <div className={styles.ticker}>
        <div className={styles.tickerFadeLeft} />
        <div className={styles.tickerFadeRight} />
        <div className={styles.tickerTrack}>
          {[
            ...TICKER_DESTINATIONS,
            ...TICKER_DESTINATIONS,
            ...TICKER_DESTINATIONS,
          ].map((dest, i) => (
            <span key={i} className={styles.tickerItem}>
              <span className={styles.tickerPin}>📍</span>
              {dest}
              <span className={styles.tickerDot}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PanoramaBanner;
