import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBackpackingTrips } from "../../services/api";
import styles from "./BackpackingTrips.module.css";

const Leaf = ({ delay, left, size, duration, rotation }) => (
    <svg
        style={{
            position: "absolute",
            left: `${left}%`,
            top: "-10%",
            width: `${size}px`,
            height: `${size}px`,
            opacity: 0.25,
            filter: "blur(0.5px)",
            animation: `fall-leaf ${duration}s linear ${delay}s infinite`,
            pointerEvents: "none",
        }}
        viewBox="0 0 24 24"
        fill="#52b788"
    >
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8.17,20C12.11,20 15.11,17.44 17,14C17.33,13.4 17.65,12.78 17.93,12.16C19.34,9.04 20.3,5.55 21,2C18.45,4.03 15.54,6.11 12.67,7.93C11,9 9,10 7,10C6.1,10 5.25,9.88 4.45,9.65C4.16,10.61 3.96,11.64 3.96,12.77C4,16.8 6,19 8,20" />
        <style>
            {`
        @keyframes fall-leaf {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          40% { transform: translateY(40vh) translateX(30px) rotate(${rotation}deg); }
          70% { transform: translateY(70vh) translateX(-20px) rotate(${rotation * 2}deg); }
          90% { opacity: 0.3; }
          100% { transform: translateY(110vh) translateX(10px) rotate(${rotation * 3}deg); opacity: 0; }
        }
      `}
        </style>
    </svg>
);

const BackpackingTrips = () => {
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
                const data = await fetchBackpackingTrips();
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

    const leaves = useMemo(() => {
        return Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            delay: Math.random() * 8,
            left: Math.random() * 100,
            size: 10 + Math.random() * 15,
            duration: 10 + Math.random() * 10,
            rotation: 45 + Math.random() * 180
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
                {leaves.map(l => (
                    <Leaf key={l.id} {...l} />
                ))}
            </div>

            <div className={styles.header}>
                <div className={styles.labelRow}>
                    <span className={styles.labelLine} />
                    <span className={styles.label}>
                        <span className={styles.labelDot} />
                        Wild Adventure
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
                                    <span className={styles.natureBadge}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                        </svg>
                                        Adventure
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
                                    <button className={styles.ctaBtn}>Details</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BackpackingTrips;
