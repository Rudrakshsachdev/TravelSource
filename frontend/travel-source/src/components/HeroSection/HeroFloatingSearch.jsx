import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTrips } from "../../services/api";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import styles from "./HeroFloatingSearch.module.css";

/* ═══════════════════════════════════════════════════════════════
   HeroFloatingSearch — Glassmorphic floating search bar
   Three fields (Destination, Date, Travelers) + blue CTA
   Fetches dynamic options from the API
   ═══════════════════════════════════════════════════════════════ */

const TRIP_TYPE_OPTIONS = [
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

const MONTH_OPTIONS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const HeroFloatingSearch = () => {
  const navigate = useNavigate();
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [tripTypeOptions, setTripTypeOptions] = useState([]);
  const [filters, setFilters] = useState({
    destination: "",
    month: "",
    tripType: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const trips = await fetchTrips();

        const destinations = Array.from(
          new Set(
            trips
              .flatMap((t) => [t.location, t.state, t.country])
              .map((v) => (v || "").trim())
              .filter(Boolean)
          )
        )
          .sort((a, b) => a.localeCompare(b))
          .slice(0, 40);

        const types = TRIP_TYPE_OPTIONS.filter((type) =>
          trips.some((trip) => {
            switch (type.value) {
              case "international": return trip.is_international || trip.show_in_international_section;
              case "india": return trip.is_india_trip || trip.show_in_india_section;
              case "honeymoon": return trip.is_honeymoon || trip.show_in_honeymoon_section;
              case "himalayan": return trip.is_himalayan_trek || trip.show_in_himalayan_section;
              case "backpacking": return trip.is_backpacking_trip || trip.show_in_backpacking_section;
              case "summer": return trip.is_summer_trek || trip.show_in_summer_section;
              case "monsoon": return trip.is_monsoon_trek || trip.show_in_monsoon_section;
              case "community": return trip.is_community_trip || trip.show_in_community_section;
              case "festival": return trip.is_festival_trip || trip.show_in_festival_section;
              default: return false;
            }
          })
        );

        setDestinationOptions(destinations);
        setTripTypeOptions(types.length ? types : TRIP_TYPE_OPTIONS);
      } catch {
        setTripTypeOptions(TRIP_TYPE_OPTIONS);
      }
    };
    load();
  }, []);

  const handleChange = (field, value) =>
    setFilters((p) => ({ ...p, [field]: value }));

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.destination) params.set("destination", filters.destination);
    if (filters.tripType) params.set("tripType", filters.tripType);
    if (filters.month) params.set("month", filters.month);

    const text = [
      filters.destination,
      tripTypeOptions.find((t) => t.value === filters.tripType)?.label,
      filters.month,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (text) params.set("search", text);

    navigate({
      pathname: "/",
      search: params.toString() ? `?${params.toString()}` : "",
    });

    setTimeout(() => {
      const el = document.getElementById("trips-grid");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, [filters, tripTypeOptions, navigate]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBar}>
        {/* Destination */}
        <label className={styles.field}>
          <div className={styles.fieldTop}>
            <MapPin size={16} className={styles.fieldIcon} />
            <span className={styles.fieldLabel}>DESTINATION</span>
          </div>
          <select
            className={`${styles.fieldSelect} ${!filters.destination ? styles.placeholder : ""}`}
            value={filters.destination}
            onChange={(e) => handleChange("destination", e.target.value)}
          >
            <option value="">Where to?</option>
            {destinationOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>

        <div className={styles.divider} />

        {/* Date / Month */}
        <label className={styles.field}>
          <div className={styles.fieldTop}>
            <Calendar size={16} className={styles.fieldIcon} />
            <span className={styles.fieldLabel}>DATE</span>
          </div>
          <select
            className={`${styles.fieldSelect} ${!filters.month ? styles.placeholder : ""}`}
            value={filters.month}
            onChange={(e) => handleChange("month", e.target.value)}
          >
            <option value="">Select dates</option>
            {MONTH_OPTIONS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>

        <div className={styles.divider} />

        {/* Travelers / Trip Type */}
        <label className={styles.field}>
          <div className={styles.fieldTop}>
            <Users size={16} className={styles.fieldIcon} />
            <span className={styles.fieldLabel}>TRAVELERS</span>
          </div>
          <select
            className={`${styles.fieldSelect} ${!filters.tripType ? styles.placeholder : ""}`}
            value={filters.tripType}
            onChange={(e) => handleChange("tripType", e.target.value)}
          >
            <option value="">All trips</option>
            {tripTypeOptions.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>

        {/* Search CTA */}
        <button className={styles.searchBtn} onClick={handleSearch} id="hero-search-cta">
          <Search size={18} />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};

export default HeroFloatingSearch;
