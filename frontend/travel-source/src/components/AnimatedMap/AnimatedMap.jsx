import { useEffect, useRef, useState } from "react";
import styles from "./AnimatedMap.module.css";
import mapGif from "../../assets/map.gif";

const AnimatedMap = () => {
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

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className={`${styles.animatedMapSection} ${isVisible ? styles.visible : ""}`}
        >
            {/* Decorative top border accent */}
            <div className={styles.topAccent} />

            <div className={styles.container}>
                {/* The User provided Map GIF as background */}
                <div className={styles.mapContainer}>
                    <img src={mapGif} alt="World Map" className={styles.mapGif} />

                    {/* SVG Overlay for Animations */}
                    <svg
                        viewBox="0 0 1000 700"
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.svgOverlay}
                    >
                        {/* Red Pins aligned with the GIF map */}
                        <g className={styles.pins}>
                            {/* USA Pin */}
                            <g transform="translate(180, 240)">
                                <path d="M0 0 C-10 -20, -10 -35, 0 -35 C10 -35, 10 -20, 0 0" fill="#EF4444" />
                                <circle cx="0" cy="-25" r="4" fill="white" />
                            </g>
                            {/* UK/Europe Pin */}
                            <g transform="translate(480, 180)">
                                <path d="M0 0 C-10 -20, -10 -35, 0 -35 C10 -35, 10 -20, 0 0" fill="#EF4444" />
                                <circle cx="0" cy="-25" r="4" fill="white" />
                            </g>
                            {/* India Pin */}
                            <g transform="translate(710, 310)">
                                <path d="M0 0 C-10 -20, -10 -35, 0 -35 C10 -35, 10 -20, 0 0" fill="#EF4444" />
                                <circle cx="0" cy="-25" r="4" fill="white" />
                            </g>
                            {/* Australia Pin */}
                            <g transform="translate(880, 480)">
                                <path d="M0 0 C-10 -20, -10 -35, 0 -35 C10 -35, 10 -20, 0 0" fill="#EF4444" />
                                <circle cx="0" cy="-25" r="4" fill="white" />
                            </g>
                        </g>

                        {/* Route path connecting the pins */}
                        <path
                            id="globalPath"
                            className={styles.routePath}
                            d="M180 240 Q330 100 480 180 Q600 250 710 310 Q800 400 880 480"
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth="2"
                            strokeDasharray="6,8"
                        />

                        {/* Airplane moving along the path */}
                        <g className={styles.airplaneGroup}>
                            <path
                                className={styles.airplane}
                                d="M-10-8 L10 0 L-10 8 L-6 0 Z"
                                fill="black"
                            >
                                <animateMotion
                                    dur="12s"
                                    repeatCount="indefinite"
                                    rotate="auto"
                                    path="M180 240 Q330 100 480 180 Q600 250 710 310 Q800 400 880 480"
                                />
                            </path>
                        </g>
                    </svg>
                </div>

                {/* Content Overlay */}
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div className={styles.labelRow}>
                            <span className={styles.labelLine} />
                            <span className={styles.label}>
                                <span className={styles.labelDot} />
                                Global Collection
                            </span>
                            <span className={styles.labelLine} />
                        </div>
                        <h2 className={styles.title}>Your Luxury Journey Starts Here</h2>
                        <p className={styles.description}>
                            We connect the world's most exclusive destinations with seamless, premium travel experiences.
                            From private jets to curated local adventures, we redefine your global reach.
                        </p>
                    </div>

                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>120+</span>
                            <span className={styles.statLabel}>Destinations</span>
                        </div>
                        <div className={styles.statDivider}></div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>2500+</span>
                            <span className={styles.statLabel}>Journeys</span>
                        </div>
                        <div className={styles.statDivider}></div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>15+</span>
                            <span className={styles.statLabel}>Years Excellence</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AnimatedMap;
