import { useState, useEffect, useRef } from "react";
import { fetchCommunityTrips } from "../../services/api";
import { MapPin, Clock, Users } from "lucide-react";
import styles from "./CommunityTrips.module.css";

const CommunityTrips = () => {
    const [trips, setTrips] = useState([]);
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchCommunityTrips();
                setTrips(data.trips);
                setConfig(data.config);
            } catch (err) {
                console.error("Failed to load community trips", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (!loading && config && !config.is_enabled) return null;
    if (!loading && trips.length === 0) return null;

    // Duplicate trips for infinite loop
    const displayTrips = [...trips, ...trips, ...trips];

    return (
        <section
            ref={sectionRef}
            className={`${styles.section} ${isVisible ? styles.animateIn : ""}`}
        >
            {/* Sunset Glow / Floating Orbs */}
            <div className={styles.glowOverlay}>
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={styles.glowOrb}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 300 + 200}px`,
                            height: `${Math.random() * 300 + 200}px`,
                            "--duration": `${Math.random() * 10 + 10}s`,
                            "--delay": `${Math.random() * -20}s`,
                            opacity: 0.3
                        }}
                    />
                ))}
            </div>

            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.eyebrow}>
                        <Users size={10} strokeWidth={2.5} />
                        Community Vibe
                    </div>
                    <h2 className={styles.title}>
                        {config?.title || "Social "}<span className={styles.titleAccent}>Community Trips</span>
                    </h2>
                    {config?.subtitle && <p className={styles.subtitle}>{config.subtitle}</p>}
                </div>

                <div className={styles.trackContainer}>
                    <div
                        className={styles.track}
                        style={{ "--speed": `${config?.scroll_speed || 60}s` }}
                    >
                        {displayTrips.map((trip, idx) => (
                            <div key={`${trip.id}-${idx}`} className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={trip.image}
                                        alt={trip.title}
                                        className={styles.image}
                                        loading="lazy"
                                    />
                                    <div className={styles.badge}>Community Vibe</div>
                                </div>

                                <div className={styles.content}>
                                    <h3 className={styles.cardTitle}>{trip.title}</h3>
                                    <div className={styles.location}>
                                        <MapPin size={14} />
                                        <span>{trip.location}</span>
                                    </div>
                                    <p className={styles.description}>{trip.short_description}</p>

                                    <div className={styles.footer}>
                                        <div className={styles.priceInfo}>
                                            <span className={styles.priceLabel}>Joining from</span>
                                            <span className={styles.priceValue}>₹{trip.price.toLocaleString()}</span>
                                        </div>
                                        <div className={styles.duration}>
                                            <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                            {trip.duration_days} Days
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommunityTrips;
