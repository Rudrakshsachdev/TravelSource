import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin, Camera } from "lucide-react";
import { fetchJourneyInFramesTrips } from "../../services/api";
import GalleryModal from "./GalleryModal";
import styles from "./JourneyInFrames.module.css";

const CARD_W = 280;   // card width px
const CARD_GAP = 24;  // gap px
const STEP = CARD_W + CARD_GAP;

/* ── COMPONENT ────────────────────────────────────────────── */
export default function JourneyInFrames() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Carousel state
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleCards, setVisibleCards] = useState(4);
    const [isDragging, setIsDragging] = useState(false);
    
    // Modal State
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const dragStart = useRef(0);
    const sectionRef = useRef(null);

    // Fetch Trips
    useEffect(() => {
        let isMounted = true;
        const loadTrips = async () => {
            try {
                const data = await fetchJourneyInFramesTrips();
                if (isMounted) setTrips(data);
            } catch (err) {
                console.error("Failed to fetch Journey in Frames trips:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadTrips();
        return () => { isMounted = false; };
    }, []);

    const total = trips.length;
    const maxIdx = Math.max(0, total - visibleCards);

    /* Responsive visible count */
    useEffect(() => {
        const calc = () => {
            const w = window.innerWidth;
            if (w < 600) setVisibleCards(1);
            else if (w < 840) setVisibleCards(2);
            else if (w < 1100) setVisibleCards(3);
            else setVisibleCards(4);
        };
        calc();
        window.addEventListener("resize", calc);
        return () => window.removeEventListener("resize", calc);
    }, []);

    /* Scroll-in reveal */
    useEffect(() => {
        if (loading || trips.length === 0) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.12 }
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, [loading, trips.length]);

    const go = useCallback((dir) => {
        if (animating) return;
        setAnimating(true);
        setCurrent((p) => dir === "next"
            ? Math.min(p + 1, maxIdx)
            : Math.max(p - 1, 0)
        );
        setTimeout(() => setAnimating(false), 650);
    }, [animating, maxIdx]);

    /* Touch/drag */
    const onDragStart = (e) => {
        setIsDragging(true);
        dragStart.current = e.touches ? e.touches[0].clientX : e.clientX;
    };
    const onDragEnd = (e) => {
        if (!isDragging) return;
        const end = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        if (Math.abs(dragStart.current - end) > 50)
            go(dragStart.current > end ? "next" : "prev");
        setIsDragging(false);
    };

    /* Per-card 3D perspective: outer cards tilt toward center */
    const cardTransform = (idx) => {
        const center = current + (visibleCards - 1) / 2;
        const offset = idx - center;               // negative = left, positive = right
        const tilt = -Math.sign(offset) * Math.min(Math.abs(offset) * 9, 22); // cap at 22°
        const sc = 1 - Math.min(Math.abs(offset) * 0.035, 0.12);
        const origin = offset < 0 ? "right center" : offset > 0 ? "left center" : "center center";
        return {
            transform: `perspective(1400px) rotateY(${tilt}deg) scale(${sc})`,
            transformOrigin: origin,
            zIndex: Math.round(20 - Math.abs(offset) * 3),
        };
    };

    const handleCardClick = (trip) => {
        if (isDragging) return;
        setSelectedTrip(trip);
        setIsModalOpen(true);
    };

    // Keep current index in sync if window resizes and maxIdx drops
    useEffect(() => {
        if (current > maxIdx && maxIdx >= 0) {
            setCurrent(maxIdx);
        }
    }, [maxIdx, current]);

    const translateX = -(current * STEP);

    if (loading) {
        return null; // Don't show section while loading, or could add a skeleton
    }

    if (trips.length === 0) {
        return null; // hide if no trips are mapped to this section
    }

    return (
        <section
            ref={sectionRef}
            className={`${styles.section} ${visible ? styles.visible : ""}`}
        >
            <div className={styles.container}>

                {/* ── HEADER ─────────────────────────────────── */}
                <div className={styles.header}>
                    <div className={styles.eyebrow}>
                        <Camera size={10} strokeWidth={2.5} />
                        Our Gallery
                    </div>

                    <h2 className={styles.title}>
                        Journey in{" "}
                        <span className={styles.titleAccent}>Frames</span>
                    </h2>

                    <p className={styles.subtitle}>
                        Pictures Perfect Moments — captured across every destination
                    </p>
                </div>

                {/* ── CAROUSEL ───────────────────────────────── */}
                <div className={styles.carouselRoot}>
                    {/* Left arrow */}
                    <button
                        className={styles.arrow}
                        onClick={() => go("prev")}
                        disabled={current === 0}
                        aria-label="Previous"
                    >
                        <ChevronLeft size={20} strokeWidth={2.5} />
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
                                transition: isDragging
                                    ? "none"
                                    : "transform 0.7s cubic-bezier(0.25, 0.8, 0.25, 1)",
                            }}
                        >
                            {trips.map((trip, idx) => (
                                <div
                                    key={trip.id}
                                    className={styles.card}
                                    style={window.innerWidth > 600 ? cardTransform(idx) : {}}
                                    onClick={() => handleCardClick(trip)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(trip); }}
                                >
                                    <div className={styles.gradientOverlay} />
                                    <img
                                        src={trip.image || "/images/placeholder.svg"}
                                        alt={trip.title}
                                        className={styles.img}
                                        loading="lazy"
                                        draggable="false"
                                    />
                                    <div className={styles.locationTag}>
                                        <MapPin
                                            size={13}
                                            fill="white"
                                            strokeWidth={0}
                                            className={styles.pinIcon}
                                        />
                                        {trip.title}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right arrow */}
                    <button
                        className={styles.arrow}
                        onClick={() => go("next")}
                        disabled={current >= maxIdx || maxIdx <= 0}
                        aria-label="Next"
                    >
                        <ChevronRight size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* ── DOTS ───────────────────────────────────── */}
                {maxIdx > 0 && (
                    <div className={styles.dotsRow}>
                        {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                            <button
                                key={i}
                                className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
                                onClick={() => setCurrent(i)}
                                aria-label={`Go to set ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Gallery Modal */}
            {isModalOpen && selectedTrip && (
                <GalleryModal 
                    trip={selectedTrip} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </section>
    );
}
