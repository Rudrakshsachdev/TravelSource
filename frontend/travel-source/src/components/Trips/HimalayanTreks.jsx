import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHimalayanTrips } from "../../services/api";
import styles from "./HimalayanTreks.module.css";

const Snowflake = ({ delay, left, size, duration }) => (
    <svg
        style={{
            position: "absolute",
            left: `${left}%`,
            top: "-10%",
            width: `${size}px`,
            height: `${size}px`,
            opacity: 0.3,
            filter: "blur(0.3px)",
            animation: `fall ${duration}s linear ${delay}s infinite`,
            pointerEvents: "none",
        }}
        viewBox="0 0 24 24"
        fill="#a2d2ff"
    >
        <path d="M19,12L17.5,12.87L19,14V16.13L17.5,15.26L16.5,17L14.77,16L15.77,14.26L13,12.67V15H15V17H13V21H11V17H9V15H11V12.67L8.23,14.26L9.23,16L7.5,17L6.5,15.26L5,16.13V14L6.5,12.87L5,12L6.5,11.13L5,10V7.87L6.5,8.74L7.5,7L9.23,8L8.23,9.74L11,11.33V9H9V7H11V3H13V7H15V9H13V11.33L15.77,9.74L14.77,8L16.5,7L17.5,8.74L19,7.87V10L17.5,11.13L19,12Z" />
        <style>
            {`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}
        </style>
    </svg>
);

const HimalayanTreks = () => {
    const [trips, setTrips] = useState([]);
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    // Fetch data from backend
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchHimalayanTrips();
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

    const snowflakes = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            delay: Math.random() * 10,
            left: Math.random() * 100,
            size: 5 + Math.random() * 12,
            duration: 8 + Math.random() * 12,
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
                {snowflakes.map(s => (
                    <Snowflake key={s.id} {...s} />
                ))}
            </div>

            <div className={styles.header}>
                <div className={styles.labelRow}>
                    <span className={styles.labelLine} />
                    <span className={styles.label}>
                        <span className={styles.labelDot} />
                        Mountain Quest
                    </span>
                    <span className={styles.labelLine} />
                </div>
                <h2 className={styles.title}>{config.title}</h2>
                {config.subtitle && <p className={styles.subtitle}>{config.subtitle}</p>}
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
                            className={styles.card}
                            onClick={() => navigate(`/trips/${trip.id}`)}
                        >
                            <div className={styles.cardImageWrap}>
                                <img
                                    src={trip.image}
                                    alt={trip.title}
                                    className={styles.cardImage}
                                    loading="lazy"
                                />
                                <div className={styles.cardOverlay} />

                                {trip.location && (
                                    <span className={styles.altitudeBadge}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M8 18l4-4 4 4" />
                                            <path d="M12 2l10 18H2L12 2z" />
                                        </svg>
                                        Himalayas
                                    </span>
                                )}

                                <span className={styles.durationPill}>
                                    {trip.duration_days} Days
                                </span>
                            </div>

                            <div className={styles.cardBody}>
                                <div>
                                    <h3 className={styles.cardTitle}>{trip.title}</h3>
                                    <div className={styles.cardLocation}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        {trip.location}
                                    </div>
                                    {trip.short_description && <p className={styles.cardDesc}>{trip.short_description}</p>}
                                </div>

                                <div className={styles.cardFooter}>
                                    <div className={styles.priceInfo}>
                                        <span className={styles.priceLabel}>From</span>
                                        <span className={styles.priceValue}>{formatPrice(trip.price)}</span>
                                    </div>
                                    <button className={styles.ctaBtn}>View Trek</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HimalayanTreks;
