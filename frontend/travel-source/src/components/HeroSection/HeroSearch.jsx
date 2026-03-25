import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HeroSearch.module.css";

/* ═══════════════════════════════════════════════════
   HeroSearch — Simple pill search bar
   Dynamic text search that filters trips
   ═══════════════════════════════════════════════════ */

const HeroSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const go = useCallback((e) => {
    e?.preventDefault();
    const p = new URLSearchParams();
    if (query.trim()) p.set("search", query.trim());
    navigate({ pathname: "/", search: p.toString() ? `?${p}` : "" });
    setTimeout(() => {
      const el = document.getElementById("trips-grid");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [query, navigate]);

  return (
    <form className={styles.bar} onSubmit={go}>
      <input
        type="text"
        className={styles.input}
        placeholder="Plan Your Next Trip..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        aria-label="Search trips"
      />
      <button type="submit" className={styles.btn}>Search</button>
    </form>
  );
};

export default HeroSearch;
