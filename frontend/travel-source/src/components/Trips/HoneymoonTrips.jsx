import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHoneymoonTrips } from "../../services/api";
import styles from "./HoneymoonTrips.module.css";

const HeartParticle = ({ delay, left, size, duration }) => (
    <svg
        style={{
            position: "absolute",
            left: `${left}%`,
            top: "110%",
            width: `${size}px`,
            height: `${size}px`,
            opacity: 0.15,
            filter: "blur(0.5px)",
            animation: `floatUp ${duration}s linear ${delay}s infinite`,
            pointerEvents: "none",
        }}
        viewBox="0 0 24 24"
        fill="#3f9e8f"
    >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        <style>
            {`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.1; }
          100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
        }
      `}
        </style>
    </svg>
);

const HoneymoonTrips = () => {
    const [trips, setTrips] = useState([]);
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [activeCard, setActiveCard] = useState(null);
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    // Fetch data from backend
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchHoneymoonTrips();
                if (data.config && data.config.is_enabled && data.trips.length > 0) {
                    setConfig(data.config);
                    setTrips(data.trips);
                }
            } catch {
                // Silently fail section
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Entrance animation observer
    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [loading]);

    const formatPrice = useCallback((price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
        }).format(price);
    }, []);

    const particles = useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            delay: Math.random() * 5,
            left: Math.random() * 100,
            size: 10 + Math.random() * 15,
            duration: 10 + Math.random() * 10,
        }));
    }, []);

    if (loading || !config || !config.is_enabled || trips.length === 0) return null;

    // Double trips for infinite scroll
    const displayTrips = [...trips, ...trips];

    return (
        <section
            ref={sectionRef}
            className={`${styles.section} ${isVisible ? styles.visible : ""}`}
        >
            <div className={styles.bgDecor}>
                <div className={styles.bgOrb1} />
                <div className={styles.bgOrb2} />
                <div className={styles.bgMesh} />
            </div>

            <div className={styles.particles}>
                {particles.map(p => (
                    <HeartParticle key={p.id} {...p} />
                ))}
            </div>

            <div className={styles.header}>
                <div className={styles.labelRow}>
                    <span className={styles.labelLine} />
                    <span className={styles.label}>
                        <span className={styles.labelDot} />
                        Honeymoon Collection
                    </span>
                    <span className={styles.labelLine} />
                </div>
                <h2 className={styles.title}>{config.title}</h2>
                {config.subtitle && <p className={styles.subtitle}>{config.subtitle}</p>}
                <div className={styles.headerUnderline}>
                    <span className={styles.underlineDot} />
                </div>
            </div>

            <div
                className={styles.trackWrapper}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className={styles.edgeFadeLeft} />
                <div className={styles.edgeFadeRight} />

                <div
                    className={styles.track}
                    style={{
                        animationDuration: `${config.scroll_speed || 60}s`,
                        animationPlayState: isPaused ? "paused" : "running",
                    }}
                >
                    {displayTrips.map((trip, i) => (
                        <div
                            key={`${trip.id}-${i}`}
                            className={`${styles.card} ${activeCard === `${trip.id}-${i}` ? styles.cardActive : ""}`}
                            onClick={() => navigate(`/trips/${trip.id}`)}
                            onMouseEnter={() => setActiveCard(`${trip.id}-${i}`)}
                            onMouseLeave={() => setActiveCard(null)}
                        >
                            <div className={styles.cardGlow} />

                            <div className={styles.cardImageWrap}>
                                <img
                                    src={trip.image}
                                    alt={trip.title}
                                    className={styles.cardImage}
                                    loading="lazy"
                                />
                                <div className={styles.cardOverlay} />

                                {trip.country && (
                                    <span className={styles.countryBadge}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="2" y1="12" x2="22" y2="12" />
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                        </svg>
                                        {trip.country}
                                    </span>
                                )}

                                <span className={styles.durationPill}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    {trip.duration_days} Days
                                </span>

                                <div className={styles.priceWrap}>
                                    <span className={styles.priceFrom}>Starting at</span>
                                    <span className={styles.priceAmount}>{formatPrice(trip.price)}</span>
                                </div>

                                <div className={styles.imageContent}>
                                    <h3 className={styles.cardTitle}>{trip.title}</h3>
                                    <div className={styles.cardLocation}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        {trip.location}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                {trip.short_description && <p className={styles.cardDesc}>{trip.short_description}</p>}
                                <div className={styles.cardFooter}>
                                    <span className={styles.cardCta}>
                                        Unlock Romance
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </span>
                                    <div className={styles.cardDivider} />
                                    <span className={styles.cardPriceSmall}>{formatPrice(trip.price)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HoneymoonTrips;
