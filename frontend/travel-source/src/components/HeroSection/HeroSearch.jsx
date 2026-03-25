import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTrips } from "../../services/api";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import styles from "./HeroSearch.module.css";

/* ═══════════════════════════════════════════════════════════════
   HeroSearch — Floating glassmorphic search bar
   Separate component · Dynamic API filters · Blue CTA
   ═══════════════════════════════════════════════════════════════ */

const TYPE_OPTIONS = [
  { value: "international", label: "International" },
  { value: "india", label: "India Trips" },
  { value: "honeymoon", label: "Honeymoon" },
  { value: "himalayan", label: "Himalayan Treks" },
  { value: "backpacking", label: "Backpacking" },
  { value: "summer", label: "Summer Treks" },
  { value: "monsoon", label: "Monsoon Treks" },
  { value: "community", label: "Community Trips" },
  { value: "festival", label: "Festival Trips" },
];

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const HeroSearch = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [types, setTypes] = useState(TYPE_OPTIONS);
  const [f, setF] = useState({ dest: "", month: "", type: "" });

  useEffect(() => {
    (async () => {
      try {
        const trips = await fetchTrips();
        const dests = [...new Set(
          trips.flatMap(t => [t.location, t.state, t.country])
               .map(v => (v || "").trim()).filter(Boolean)
        )].sort().slice(0, 40);

        const avail = TYPE_OPTIONS.filter(opt =>
          trips.some(t => {
            const m = { international: "is_international", india: "is_india_trip",
              honeymoon: "is_honeymoon", himalayan: "is_himalayan_trek",
              backpacking: "is_backpacking_trip", summer: "is_summer_trek",
              monsoon: "is_monsoon_trek", community: "is_community_trip",
              festival: "is_festival_trip" };
            const s = { international: "show_in_international_section",
              india: "show_in_india_section", honeymoon: "show_in_honeymoon_section",
              himalayan: "show_in_himalayan_section", backpacking: "show_in_backpacking_section",
              summer: "show_in_summer_section", monsoon: "show_in_monsoon_section",
              community: "show_in_community_section", festival: "show_in_festival_section" };
            return t[m[opt.value]] || t[s[opt.value]];
          })
        );
        setDestinations(dests);
        if (avail.length) setTypes(avail);
      } catch { /* use defaults */ }
    })();
  }, []);

  const go = useCallback(() => {
    const p = new URLSearchParams();
    if (f.dest) p.set("destination", f.dest);
    if (f.type) p.set("tripType", f.type);
    if (f.month) p.set("month", f.month);
    const txt = [f.dest, types.find(t => t.value === f.type)?.label, f.month]
      .filter(Boolean).join(" ").trim();
    if (txt) p.set("search", txt);
    navigate({ pathname: "/", search: p.toString() ? `?${p}` : "" });
    setTimeout(() => {
      const el = document.getElementById("trips-grid");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, [f, types, navigate]);

  return (
    <div className={styles.bar}>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.label}><MapPin size={14} /> DESTINATION</span>
          <select className={styles.sel} value={f.dest}
            onChange={e => setF(p => ({ ...p, dest: e.target.value }))}>
            <option value="">Where to?</option>
            {destinations.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>

        <div className={styles.sep} />

        <label className={styles.field}>
          <span className={styles.label}><Calendar size={14} /> DATE</span>
          <select className={styles.sel} value={f.month}
            onChange={e => setF(p => ({ ...p, month: e.target.value }))}>
            <option value="">Select dates</option>
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>

        <div className={styles.sep} />

        <label className={styles.field}>
          <span className={styles.label}><Users size={14} /> TRAVELERS</span>
          <select className={styles.sel} value={f.type}
            onChange={e => setF(p => ({ ...p, type: e.target.value }))}>
            <option value="">All trips</option>
            {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
      </div>

      <button className={styles.btn} onClick={go}>
        <Search size={16} /> Search
      </button>
    </div>
  );
};

export default HeroSearch;
