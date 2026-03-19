import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMonsoonTrips } from "../../services/api";
import styles from "./MonsoonTreks.module.css";

/* Animated rain drop particle */
const RainDrop = ({ delay, left, duration }) => (
    <div
        style={{
            position: "absolute",
            left: `${left}%`,
            top: "-5%",
            width: "1.5px",
            height: "18px",
            background: "linear-gradient(to bottom, transparent, rgba(63,158,143,0.25))",
            borderRadius: "2px",
            opacity: 0,
            animation: `rain-fall ${duration}s linear ${delay}s infinite`,
            pointerEvents: "none",
        }}
    >
        <style>{`
      @keyframes rain-fall {
        0% { transform: translateY(0); opacity: 0; }
        10% { opacity: 0.4; }
        90% { opacity: 0.4; }
        100% { transform: translateY(110vh); opacity: 0; }
      }
    `}</style>
    </div>
);

const MonsoonTreks = () => {
    const [trips, setTrips] = useState([]);
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [activeCard, setActiveCard] = useState(null);
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchMonsoonTrips();
                if (data.config && data.config.is_enabled && data.trips.length > 0) {
                    setConfig(data.config);
                    setTrips(data.trips);
                }
            } catch {
                // Silently fail
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.08 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [loading]);

    const formatPrice = useCallback((price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    }, []);

    const rainDrops = useMemo(() => {
        return Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            delay: Math.random() * 6,
            left: Math.random() * 100,
            duration: 2 + Math.random() * 3,
        }));
    }, []);

    if (loading || !config || !config.is_enabled || trips.length === 0) return null;

    const scrollSpeed = config.scroll_speed || 60;
    const displayTrips = [...trips, ...trips];

    return (
        <section
            ref={sectionRef}
            className={`${styles.section} ${isVisible ? styles.visible : ""}`}
        >
            <div className={styles.bgDecor}>
                <div className={styles.bgOrb1} />
                <div className={styles.bgOrb2} />
                <div className={styles.bgOrb3} />
                <div className={styles.bgMesh} />
                <div className={styles.bgLine} />
                <div className={styles.bgLine2} />
            </div>

            <div className={styles.particles}>
                {rainDrops.map((d) => (
                    <RainDrop key={d.id} {...d} />
                ))}
            </div>

            <div className={styles.topAccent} />

            <div className={styles.header}>
                <div className={styles.labelRow}>
                    <span className={styles.labelLine} />
                    <span className={styles.label}>
                        <span className={styles.labelDot} />
                        Monsoon Collection
                    </span>
                    <span className={styles.labelLine} />
                </div>
                <h2 className={styles.title}>
                    {config.title || "Monsoon Treks"}
                </h2>
                {config.subtitle && (
                    <p className={styles.subtitle}>{config.subtitle}</p>
                )}
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
                        animationDuration: `${scrollSpeed}s`,
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
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) =>
                                e.key === "Enter" && navigate(`/trips/${trip.id}`)
                            }
                        >
                            <div className={styles.cardGlow} />

                            <div className={styles.cardImageWrap}>
                                <img
                                    src={trip.image}
                                    alt={trip.title}
                                    className={styles.cardImage}
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div className={styles.cardOverlay} />
                                <div className={styles.cardOverlayVignette} />

                                {trip.location && (
                                    <span className={styles.stateBadge}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        {trip.location}
                                    </span>
                                )}

                                {trip.duration_days && (
                                    <span className={styles.durationPill}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        {trip.duration_days} Days{trip.duration_nights > 0 ? " / " + trip.duration_nights + " Nights" : ""}
                                    </span>
                                )}

                                <div className={styles.priceWrap}>
                                    <span className={styles.priceFrom}>from</span>
                                    <span className={styles.priceAmount}>
                                        {formatPrice(trip.price)}
                                    </span>
                                </div>

                                <div className={styles.imageContent}>
                                    <h3 className={styles.cardTitle}>{trip.title}</h3>
                                    <div className={styles.cardLocation}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        {trip.location}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                {trip.short_description && (
                                    <p className={styles.cardDesc}>{trip.short_description}</p>
                                )}
                                <div className={styles.cardFooter}>
                                    <span className={styles.cardCta}>
                                        Discover Trek
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </span>
                                    <span className={styles.cardDivider} />
                                    <span className={styles.cardPriceSmall}>
                                        {formatPrice(trip.price)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.bottomWave}>
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0 60V30C240 5 480 0 720 10C960 20 1200 45 1440 30V60H0Z" fill="currentColor" />
                </svg>
            </div>
        </section>
    );
};

export default MonsoonTreks;
