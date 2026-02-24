import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin, Camera } from "lucide-react";
import styles from "./JourneyInFrames.module.css";

/* ── DATA ─────────────────────────────────────────────────── */
const frames = [
    {
        id: 1,
        location: "Dubai",
        label: "UAE",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 2,
        location: "Bhutan",
        label: "South Asia",
        image: "https://images.unsplash.com/photo-1578593139801-667ec3ec5ec1?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 3,
        location: "Kerala",
        label: "India",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 4,
        location: "Meghalaya",
        label: "India",
        image: "https://images.unsplash.com/photo-1601362840469-51e4405559bf?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 5,
        location: "Kashmir",
        label: "India",
        image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 6,
        location: "Leh Ladakh",
        label: "India",
        image: "https://images.unsplash.com/photo-1581791538302-03537b9c9f4d?auto=format&fit=crop&w=900&q=85",
    },
    {
        id: 7,
        location: "Spiti Valley",
        label: "India",
        image: "https://images.unsplash.com/photo-1570530739989-b57041a75c13?auto=format&fit=crop&w=900&q=85",
    },
];

const CARD_W = 280;   // card width px
const CARD_GAP = 24;  // gap px
const STEP = CARD_W + CARD_GAP;

/* ── COMPONENT ────────────────────────────────────────────── */
export default function JourneyInFrames() {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleCards, setVisibleCards] = useState(4);
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef(0);
    const sectionRef = useRef(null);

    const total = frames.length;
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
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.12 }
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

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

    const translateX = -(current * STEP);

    return (
        <section
            ref={sectionRef}
            className={`${styles.section} ${visible ? styles.visible : ""}`}
        >
            <div className={styles.container}>

                {/* ── HEADER ─────────────────────────────────── */}
                <div className={styles.header}>
                    {/* Eyebrow pill — same pattern as Reviews */}
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
                            {frames.map((f, idx) => (
                                <div
                                    key={f.id}
                                    className={styles.card}
                                    style={window.innerWidth > 600 ? cardTransform(idx) : {}}
                                >
                                    <div className={styles.gradientOverlay} />
                                    <img
                                        src={f.image}
                                        alt={f.location}
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
                                        {f.location}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right arrow */}
                    <button
                        className={styles.arrow}
                        onClick={() => go("next")}
                        disabled={current >= maxIdx}
                        aria-label="Next"
                    >
                        <ChevronRight size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* ── DOTS ───────────────────────────────────── */}
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

            </div>
        </section>
    );
}
