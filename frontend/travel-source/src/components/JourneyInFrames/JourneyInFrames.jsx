import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import styles from "./JourneyInFrames.module.css";

const frames = [
    {
        id: 1,
        location: "Dubai",
        country: "UAE",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 2,
        location: "Bhutan",
        country: "South Asia",
        image: "https://images.unsplash.com/photo-1578593139801-667ec3ec5ec1?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 3,
        location: "Kerala",
        country: "India",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 4,
        location: "Meghalaya",
        country: "India",
        image: "https://images.unsplash.com/photo-1601362840469-51e4405559bf?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 5,
        location: "Kashmir",
        country: "India",
        image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 6,
        location: "Leh Ladakh",
        country: "India",
        image: "https://images.unsplash.com/photo-1581791538302-03537b9c9f4d?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 7,
        location: "Spiti Valley",
        country: "India",
        image: "https://images.unsplash.com/photo-1570530739989-b57041a75c13?auto=format&fit=crop&w=900&q=85",
    },
];

const CARD_WIDTH = 300;   // px
const CARD_GAP = 24;      // px
const VISIBLE_CARDS = 4;  // on desktop

export default function JourneyInFrames() {
    const [current, setCurrent] = useState(0);   // index of leftmost visible card
    const [isAnimating, setIsAnimating] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartX = useRef(0);
    const dragCurrentX = useRef(0);
    const sectionRef = useRef(null);
    const [visible, setVisible] = useState(false);

    const totalCards = frames.length;
    const maxIndex = Math.max(0, totalCards - VISIBLE_CARDS);

    // Responsive
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // Scroll-in animation
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.1 }
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    const go = useCallback((dir) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrent((prev) => {
            if (dir === "next") return Math.min(prev + 1, maxIndex);
            return Math.max(prev - 1, 0);
        });
        setTimeout(() => setIsAnimating(false), 600);
    }, [isAnimating, maxIndex]);

    // Touch / drag support
    const onDragStart = (e) => {
        setIsDragging(true);
        dragStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    };
    const onDragEnd = (e) => {
        if (!isDragging) return;
        const end = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const delta = dragStartX.current - end;
        if (Math.abs(delta) > 50) go(delta > 0 ? "next" : "prev");
        setIsDragging(false);
    };

    // Compute 3-D transform per card based on its position relative to the "center"
    const getCardTransform = (idx) => {
        const relativeIdx = idx - current;
        const centerOffset = isMobile ? 0 : (VISIBLE_CARDS - 1) / 2; // midpoint of visible window
        const pos = relativeIdx - centerOffset; // negative = left of center, positive = right

        // The reference image: outer cards tilt inward up to ~20 degrees
        const maxTilt = 18;
        const tilt = -pos * (maxTilt / (VISIBLE_CARDS / 2));
        const clampedTilt = Math.max(-maxTilt, Math.min(maxTilt, tilt));

        const scale = 1 - Math.abs(pos) * 0.04;
        const clampedScale = Math.max(0.88, scale);

        return {
            transform: `perspective(1400px) rotateY(${clampedTilt}deg) scale(${clampedScale})`,
            zIndex: Math.round(10 - Math.abs(pos) * 2),
            transformOrigin: pos < 0 ? "right center" : "left center",
        };
    };

    const translateX = -(current * (CARD_WIDTH + CARD_GAP));

    return (
        <section
            ref={sectionRef}
            className={`${styles.section} ${visible ? styles.visible : ""}`}
        >
            {/* Subtle Background pattern */}
            <div className={styles.bgPattern} aria-hidden="true" />

            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>JOURNEY IN FRAMES</h2>
                    <p className={styles.subtitle}>Pictures Perfect Moments</p>
                </div>

                {/* Carousel */}
                <div className={styles.carouselRoot}>
                    {/* LEFT Arrow */}
                    <button
                        className={`${styles.arrow} ${styles.arrowLeft}`}
                        onClick={() => go("prev")}
                        disabled={current === 0}
                        aria-label="Previous"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </button>

                    {/* Track */}
                    <div
                        className={styles.viewport}
                        onMouseDown={onDragStart}
                        onMouseUp={onDragEnd}
                        onMouseLeave={onDragEnd}
                        onTouchStart={onDragStart}
                        onTouchEnd={onDragEnd}
                    >
                        <div
                            className={styles.track}
                            style={{
                                transform: `translateX(${translateX}px)`,
                                transition: isDragging ? "none" : "transform 0.7s cubic-bezier(0.25, 0.8, 0.25, 1)",
                            }}
                        >
                            {frames.map((frame, idx) => {
                                const cardStyle = getCardTransform(idx);
                                return (
                                    <div
                                        key={frame.id}
                                        className={styles.card}
                                        style={cardStyle}
                                    >
                                        {/* Gradient overlay for text legibility */}
                                        <div className={styles.gradientOverlay} />

                                        {/* Image */}
                                        <img
                                            src={frame.image}
                                            alt={frame.location}
                                            className={styles.img}
                                            loading="lazy"
                                            draggable="false"
                                        />

                                        {/* Location Tag */}
                                        <div className={styles.locationTag}>
                                            <MapPin size={14} fill="white" strokeWidth={0} className={styles.pin} />
                                            <span>{frame.location}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT Arrow */}
                    <button
                        className={`${styles.arrow} ${styles.arrowRight}`}
                        onClick={() => go("next")}
                        disabled={current >= maxIndex}
                        aria-label="Next"
                    >
                        <ChevronRight size={22} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Dot indicators */}
                <div className={styles.dots}>
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
                            onClick={() => setCurrent(i)}
                            aria-label={`Go to page ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
