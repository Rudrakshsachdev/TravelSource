import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Star, ShieldCheck, Globe, MapPin,
  Tent, Plane, Mountain, Frame,
} from "lucide-react";
import styles from "./MobileHero.module.css";

/* ═══════════════════════════════════════════════════════════════
   MobileHero — Dedicated mobile-only hero (≤ 767 px)
   App-like experience: search → badges → banner → categories →
   occasion tabs → trip cards
   ═══════════════════════════════════════════════════════════════ */

/* ── Static data ── */
const BADGES = [
  { icon: <Star size={13} />, label: "4.9 Star Rating" },
  { icon: <ShieldCheck size={13} />, label: "Govt. Certified" },
  { icon: <Globe size={13} />, label: "500+ Destinations" },
  { icon: <MapPin size={13} />, label: "Expert Curated" },
];

const CATEGORIES = [
  { icon: <Tent size={22} />, label: "Long Weekend", color: "#f59e0b" },
  { icon: <Plane size={22} />, label: "International", color: "#3b82f6" },
  { icon: <Mountain size={22} />, label: "Ladakh", color: "#8b5cf6" },
  { icon: <Frame size={22} />, label: "Spiti", color: "#10b981" },
];

const OCCASIONS = ["Good Friday", "Independence Day"];

const TRIP_CARDS = [
  {
    title: "All Girls Meghalaya",
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1572460595906-3d5e5a1f3a4c?w=600&q=80",
  },
  {
    title: "Tawang Bike Trip",
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
];

const MobileHero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  /* ── Search handler ── */
  const handleSearch = useCallback(
    (e) => {
      e?.preventDefault();
      const p = new URLSearchParams();
      if (query.trim()) p.set("search", query.trim());
      navigate({ pathname: "/", search: p.toString() ? `?${p}` : "" });
      setTimeout(() => {
        const el = document.getElementById("trips-grid");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    },
    [query, navigate]
  );

  return (
    <section className={styles.mobileHero} id="mobile-hero">
      {/* ── Gradient BG ── */}
      <div className={styles.bgGradient} aria-hidden="true" />

      {/* ── 1. Search Bar ── */}
      <form className={styles.searchBar} onSubmit={handleSearch}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Explore best itineraries…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search trips"
        />
      </form>

      {/* ── 2. Trust Badges ── */}
      <div className={styles.badgeScroll}>
        <div className={styles.badgeTrack}>
          {BADGES.map((b, i) => (
            <span className={styles.badge} key={i}>
              {b.icon}
              <span>{b.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── 3. Promo Banner ── */}
      <div className={styles.banner}>
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80"
          alt="Good Friday Long Weekend Trips"
          className={styles.bannerImg}
          loading="eager"
        />
        <div className={styles.bannerOverlay}>
          <span className={styles.bannerTag}>Long Weekend Special</span>
          <h2 className={styles.bannerTitle}>
            Good Friday
            <br />
            <span>Long Weekend Trips</span>
          </h2>
          <span className={styles.bannerPrice}>Starting from ₹15,300</span>
        </div>
      </div>

      {/* ── 4. Category Circles ── */}
      <div className={styles.catScroll}>
        <div className={styles.catTrack}>
          {CATEGORIES.map((c, i) => (
            <button className={styles.catItem} key={i} type="button">
              <span
                className={styles.catCircle}
                style={{
                  background: `linear-gradient(135deg, ${c.color}22, ${c.color}08)`,
                  borderColor: `${c.color}44`,
                }}
              >
                <span style={{ color: c.color }}>{c.icon}</span>
              </span>
              <span className={styles.catLabel}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 5. Occasion Tabs ── */}
      <div className={styles.tabs}>
        {OCCASIONS.map((o, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.tab} ${i === activeTab ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {o}
          </button>
        ))}
      </div>

      {/* ── 6. Trip Cards ── */}
      <div className={styles.cardsRow}>
        {TRIP_CARDS.map((t, i) => (
          <div className={styles.card} key={i}>
            <img src={t.image} alt={t.title} className={styles.cardImg} loading="lazy" />
            <div className={styles.cardOverlay}>
              <span className={styles.cardBadge}>{t.badge}</span>
              <span className={styles.cardTitle}>{t.title}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MobileHero;
