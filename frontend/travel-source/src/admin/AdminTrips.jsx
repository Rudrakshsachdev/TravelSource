import { useEffect, useState } from "react";
import {
  fetchAdminTrips,
  createTrip,
  toggleTrip,
  updateTrip,
  deleteTrip,
  uploadImageToCloudinary,
} from "../services/api";
import styles from "./AdminTrips.module.css";

const AdminTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Basic Fields
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    country: "",
    price: "",
    duration_days: "",
    description: "",
    short_description: "",
    image: "",
    is_international: false,
    show_in_international_section: false,
    display_order: 0,
  });

  // Dynamic Lists State
  const [itinerary, setItinerary] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [inclusions, setInclusions] = useState([]);
  const [exclusions, setExclusions] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminTrips();
      setTrips(data);
    } catch (err) {
      console.error("Failed to load trips", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  // ----- Dynamic List Handlers -----

  // Itinerary
  const addItineraryDay = () => {
    setItinerary([...itinerary, { title: "", description: "" }]);
  };
  const updateItinerary = (index, field, value) => {
    const newItinerary = [...itinerary];
    newItinerary[index][field] = value;
    setItinerary(newItinerary);
  };
  const removeItineraryDay = (index) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  // Highlights
  const addHighlight = () => {
    setHighlights([...highlights, { title: "", description: "" }]);
  };
  const updateHighlight = (index, field, value) => {
    const newHighlights = [...highlights];
    newHighlights[index][field] = value;
    setHighlights(newHighlights);
  };
  const removeHighlight = (index) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  // Inclusions (Simple List)
  const addInclusion = () => {
    setInclusions([...inclusions, ""]);
  };
  const updateInclusion = (index, value) => {
    const newInclusions = [...inclusions];
    newInclusions[index] = value;
    setInclusions(newInclusions);
  };
  const removeInclusion = (index) => {
    setInclusions(inclusions.filter((_, i) => i !== index));
  };

  // Exclusions (Simple List)
  const addExclusion = () => {
    setExclusions([...exclusions, ""]);
  };
  const updateExclusion = (index, value) => {
    const newExclusions = [...exclusions];
    newExclusions[index] = value;
    setExclusions(newExclusions);
  };
  const removeExclusion = (index) => {
    setExclusions(exclusions.filter((_, i) => i !== index));
  };

  const handleEdit = (trip) => {
    setFormData({
      title: trip.title,
      location: trip.location,
      country: trip.country || "",
      price: trip.price,
      duration_days: trip.duration_days,
      description: trip.description,
      short_description: trip.short_description || "",
      image: trip.image || "",
      is_international: trip.is_international || false,
      show_in_international_section:
        trip.show_in_international_section || false,
      display_order: trip.display_order || 0,
    });

    // Safe parsing / defaulting for JSON fields
    setItinerary(Array.isArray(trip.itinerary) ? trip.itinerary : []);
    setHighlights(Array.isArray(trip.highlights) ? trip.highlights : []);
    setInclusions(Array.isArray(trip.inclusions) ? trip.inclusions : []);
    setExclusions(Array.isArray(trip.exclusions) ? trip.exclusions : []);

    setEditingTrip(trip);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      country: "",
      price: "",
      duration_days: "",
      description: "",
      short_description: "",
      image: "",
      is_international: false,
      show_in_international_section: false,
      display_order: 0,
    });
    setItinerary([]);
    setHighlights([]);
    setInclusions([]);
    setExclusions([]);
    setEditingTrip(null);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      let imageUrl = editingTrip?.image || "";

      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }
      // Clean up empty string items arrays
      const cleanInclusions = inclusions.filter((i) => i.trim() !== "");
      const cleanExclusions = exclusions.filter((i) => i.trim() !== "");

      const payload = {
        ...formData,
        price: Number(formData.price),
        duration_days: Number(formData.duration_days),
        display_order: Number(formData.display_order) || 0,
        itinerary,
        highlights,
        inclusions: cleanInclusions,
        exclusions: cleanExclusions,
        image: imageUrl,
      };

      if (editingTrip) {
        await updateTrip(editingTrip.id, payload);
      } else {
        await createTrip({ ...payload, is_active: true });
      }

      resetForm();
      loadTrips();
    } catch (err) {
      console.error("Failed to submit trip:", err);
      setError(err.message || "Failed to save trip. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id) => {
    await toggleTrip(id);
    loadTrips();
  };

  const handleDeleteTrip = async (id) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      // TODO: Add delete API call
      try {
        await deleteTrip(id);
        loadTrips(); // refresh list
      } catch (err) {
        alert("Failed to delete trip");
        console.error(err);
      }
    }
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedStatus === "all") return matchesSearch;
    if (selectedStatus === "active") return matchesSearch && trip.is_active;
    if (selectedStatus === "hidden") return matchesSearch && !trip.is_active;
    return matchesSearch;
  });

  const stats = {
    total: trips.length,
    active: trips.filter((t) => t.is_active).length,
    hidden: trips.filter((t) => !t.is_active).length,
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading trips...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Background Overlay */}
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Trip Management</h1>
            <p className={styles.pageSubtitle}>
              Create and manage travel packages for your customers
            </p>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.searchContainer}>
              <svg
                className={styles.searchIcon}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <button
              className={styles.addButton}
              onClick={() => {
                if (showForm) resetForm();
                else setShowForm(true);
              }}
            >
              <svg
                className={styles.plusIcon}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {showForm ? "Cancel" : "Add Trip"}
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className={styles.statsSection}>
          <div
            className={`${styles.statCard} ${selectedStatus === "all" ? styles.statCardActive : ""}`}
            onClick={() => setSelectedStatus("all")}
          >
            <div className={styles.statHeader}>
              <h3 className={styles.statLabel}>Total Trips</h3>
              <svg
                className={styles.statIcon}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className={styles.statNumber}>{stats.total}</div>
            <div className={styles.statSubtext}>All trips in system</div>
          </div>

          <div
            className={`${styles.statCard} ${selectedStatus === "active" ? styles.statCardActive : ""}`}
            onClick={() => setSelectedStatus("active")}
          >
            <div className={styles.statHeader}>
              <h3 className={styles.statLabel}>Active Trips</h3>
              <svg
                className={styles.statIcon}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className={styles.statNumber}>{stats.active}</div>
            <div className={styles.statSubtext}>Visible to customers</div>
          </div>

          <div
            className={`${styles.statCard} ${selectedStatus === "hidden" ? styles.statCardActive : ""}`}
            onClick={() => setSelectedStatus("hidden")}
          >
            <div className={styles.statHeader}>
              <h3 className={styles.statLabel}>Hidden Trips</h3>
              <svg
                className={styles.statIcon}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  clipRule="evenodd"
                />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            </div>
            <div className={styles.statNumber}>{stats.hidden}</div>
            <div className={styles.statSubtext}>Not visible to customers</div>
          </div>
        </div>

        {showForm && (
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>
                {editingTrip ? "Edit Trip" : "Create New Trip"}
              </h2>
              <button className={styles.closeButton} onClick={resetForm}>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {error && (
                <div className={styles.errorContainer}>
                  <svg
                    className={styles.errorIcon}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className={styles.errorText}>{error}</p>
                </div>
              )}

              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <svg
                    className={styles.sectionIcon}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Basic Information
                </h3>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <span className={styles.required}>*</span> Trip Title
                    </label>
                    <div className={styles.inputWrapper}>
                      <svg
                        className={styles.inputIcon}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      <input
                        className={styles.input}
                        name="title"
                        placeholder="e.g. Magic of Kashmir"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <span className={styles.required}>*</span> Location
                    </label>
                    <div className={styles.inputWrapper}>
                      <svg
                        className={styles.inputIcon}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <input
                        className={styles.input}
                        name="location"
                        placeholder="e.g. Srinagar, Gulmarg"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <span className={styles.required}>*</span> Price (₹)
                    </label>
                    <div className={styles.inputWrapper}>
                      <svg
                        className={styles.inputIcon}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.584 1.032 2.79 1.032s2.228-.383 2.79-1.031a1 1 0 00-1.51-1.31c-.163.187-.452.377-.843.504v-1.941a4.535 4.535 0 001.676-.662C13.398 9.766 14 8.991 14 8c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 5.092V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <input
                        className={styles.input}
                        name="price"
                        type="number"
                        placeholder="25000"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      <span className={styles.required}>*</span> Duration (Days)
                    </label>
                    <div className={styles.inputWrapper}>
                      <svg
                        className={styles.inputIcon}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <input
                        className={styles.input}
                        name="duration_days"
                        type="number"
                        placeholder="5"
                        value={formData.duration_days}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Image Upload</label>
                  <div className={styles.inputWrapper}>
                    <svg
                      className={styles.inputIcon}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      className={styles.input}
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])} // store file in state
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Description</label>
                  <div className={styles.textareaWrapper}>
                    <svg
                      className={styles.textareaIcon}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <textarea
                      className={styles.textarea}
                      name="description"
                      placeholder="Detailed overview of the trip..."
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Short Description (Card Tagline)
                  </label>
                  <div className={styles.inputWrapper}>
                    <svg
                      className={styles.inputIcon}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      className={styles.input}
                      name="short_description"
                      placeholder="e.g. Discover the magic of Bali..."
                      value={formData.short_description}
                      onChange={handleChange}
                      maxLength={300}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Country</label>
                  <div className={styles.inputWrapper}>
                    <svg
                      className={styles.inputIcon}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      className={styles.input}
                      name="country"
                      placeholder="e.g. Indonesia, Thailand, Japan"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: International Showcase Settings */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <svg
                    className={styles.sectionIcon}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                      clipRule="evenodd"
                    />
                  </svg>
                  International Showcase
                </h3>

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label
                      className={styles.inputLabel}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="is_international"
                        checked={formData.is_international}
                        onChange={handleCheckboxChange}
                        style={{
                          width: "18px",
                          height: "18px",
                          accentColor: "#3f9e8f",
                        }}
                      />
                      International Trip
                    </label>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#6b7280",
                        marginTop: "4px",
                      }}
                    >
                      Mark this trip as an international destination
                    </span>
                  </div>

                  <div className={styles.inputGroup}>
                    <label
                      className={styles.inputLabel}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="show_in_international_section"
                        checked={formData.show_in_international_section}
                        onChange={handleCheckboxChange}
                        style={{
                          width: "18px",
                          height: "18px",
                          accentColor: "#3f9e8f",
                        }}
                      />
                      Show in Scrolling Section
                    </label>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#6b7280",
                        marginTop: "4px",
                      }}
                    >
                      Display in the auto-scrolling international showcase
                    </span>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Display Order</label>
                    <div className={styles.inputWrapper}>
                      <svg
                        className={styles.inputIcon}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                      </svg>
                      <input
                        className={styles.input}
                        name="display_order"
                        type="number"
                        placeholder="0"
                        value={formData.display_order}
                        onChange={handleChange}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#6b7280",
                        marginTop: "4px",
                      }}
                    >
                      Lower number appears first in the scrolling section
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Itinerary */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <svg
                    className={styles.sectionIcon}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Itinerary Builder
                </h3>

                <div className={styles.dynamicList}>
                  {itinerary.map((day, idx) => (
                    <div key={idx} className={styles.dynamicItem}>
                      <div className={styles.dynamicItemHeader}>
                        <span className={styles.dayNumber}>Day {idx + 1}</span>
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => removeItineraryDay(idx)}
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className={styles.dynamicItemContent}>
                        <input
                          className={styles.input}
                          placeholder={`Day ${idx + 1} Title (e.g. Arrival)`}
                          value={day.title}
                          onChange={(e) =>
                            updateItinerary(idx, "title", e.target.value)
                          }
                        />
                        <textarea
                          className={styles.textarea}
                          placeholder="Day description..."
                          value={day.description}
                          onChange={(e) =>
                            updateItinerary(idx, "description", e.target.value)
                          }
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className={styles.addButtonSmall}
                    onClick={addItineraryDay}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Day
                  </button>
                </div>
              </div>

              {/* SECTION 3: Highlights */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <svg
                    className={styles.sectionIcon}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Trip Highlights
                </h3>

                <div className={styles.dynamicList}>
                  {highlights.map((item, idx) => (
                    <div key={idx} className={styles.dynamicItem}>
                      <div className={styles.dynamicItemHeader}>
                        <span className={styles.highlightNumber}>
                          Highlight {idx + 1}
                        </span>
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => removeHighlight(idx)}
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className={styles.dynamicItemContent}>
                        <input
                          className={styles.input}
                          placeholder="Highlight Title"
                          value={item.title}
                          onChange={(e) =>
                            updateHighlight(idx, "title", e.target.value)
                          }
                        />
                        <input
                          className={styles.input}
                          placeholder="Short description"
                          value={item.description}
                          onChange={(e) =>
                            updateHighlight(idx, "description", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className={styles.addButtonSmall}
                    onClick={addHighlight}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Highlight
                  </button>
                </div>
              </div>

              {/* SECTION 4: Inclusions & Exclusions */}
              <div className={styles.formGrid}>
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <svg
                      className={styles.sectionIcon}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Inclusions
                  </h3>

                  <div className={styles.dynamicListSimple}>
                    {inclusions.map((item, idx) => (
                      <div key={idx} className={styles.simpleItem}>
                        <div className={styles.simpleItemContent}>
                          <svg
                            className={styles.checkIcon}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <input
                            className={styles.input}
                            value={item}
                            onChange={(e) =>
                              updateInclusion(idx, e.target.value)
                            }
                            placeholder="Included item..."
                          />
                        </div>
                        <button
                          type="button"
                          className={styles.removeButtonSmall}
                          onClick={() => removeInclusion(idx)}
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className={styles.addButtonSmall}
                      onClick={addInclusion}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add Inclusion
                    </button>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <svg
                      className={styles.sectionIcon}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Exclusions
                  </h3>

                  <div className={styles.dynamicListSimple}>
                    {exclusions.map((item, idx) => (
                      <div key={idx} className={styles.simpleItem}>
                        <div className={styles.simpleItemContent}>
                          <svg
                            className={styles.xIcon}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <input
                            className={styles.input}
                            value={item}
                            onChange={(e) =>
                              updateExclusion(idx, e.target.value)
                            }
                            placeholder="Excluded item..."
                          />
                        </div>
                        <button
                          type="button"
                          className={styles.removeButtonSmall}
                          onClick={() => removeExclusion(idx)}
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className={styles.addButtonSmall}
                      onClick={addExclusion}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add Exclusion
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <div className={styles.loadingSpinnerSmall}></div>
                      Saving...
                    </>
                  ) : editingTrip ? (
                    "Update Trip"
                  ) : (
                    "Create Trip"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Trips List */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>All Trips</h3>
            <div className={styles.tableInfo}>
              Showing {filteredTrips.length} of {trips.length} trips
            </div>
          </div>

          {filteredTrips.length > 0 ? (
            <div className={styles.tableBody}>
              {filteredTrips.map((trip) => (
                <div key={trip.id} className={styles.tripCard}>
                  <div className={styles.tripImage}>
                    {trip.image ? (
                      <img src={trip.image} alt={trip.title} />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    <div
                      className={`${styles.statusBadge} ${trip.is_active ? styles.statusActive : styles.statusHidden}`}
                    >
                      {trip.is_active ? "Active" : "Hidden"}
                    </div>
                  </div>

                  <div className={styles.tripContent}>
                    <div className={styles.tripHeader}>
                      <h4 className={styles.tripTitle}>{trip.title}</h4>
                      <div className={styles.tripMeta}>
                        <span className={styles.metaItem}>
                          <svg
                            className={styles.metaIcon}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {trip.location}
                          {trip.country ? `, ${trip.country}` : ""}
                        </span>
                        <span className={styles.metaItem}>
                          <svg
                            className={styles.metaIcon}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {trip.duration_days} days
                        </span>
                        <span className={styles.metaItem}>
                          <svg
                            className={styles.metaIcon}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.584 1.032 2.79 1.032s2.228-.383 2.79-1.031a1 1 0 00-1.51-1.31c-.163.187-.452.377-.843.504v-1.941a4.535 4.535 0 001.676-.662C13.398 9.766 14 8.991 14 8c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 5.092V5z"
                              clipRule="evenodd"
                            />
                          </svg>
                          ₹{trip.price.toLocaleString()}
                        </span>
                        {trip.is_international && (
                          <span
                            className={styles.metaItem}
                            style={{
                              background: "rgba(63,158,143,0.1)",
                              color: "#3f9e8f",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            🌍 International
                          </span>
                        )}
                      </div>
                    </div>

                    <p className={styles.tripDescription}>
                      {trip.description?.substring(0, 150) ||
                        "No description provided..."}
                      {trip.description?.length > 150 && "..."}
                    </p>

                    <div className={styles.tripFeatures}>
                      <div className={styles.feature}>
                        <span className={styles.featureLabel}>
                          Itinerary Days:
                        </span>
                        <span className={styles.featureValue}>
                          {trip.itinerary?.length || 0}
                        </span>
                      </div>
                      <div className={styles.feature}>
                        <span className={styles.featureLabel}>Highlights:</span>
                        <span className={styles.featureValue}>
                          {trip.highlights?.length || 0}
                        </span>
                      </div>
                      <div className={styles.feature}>
                        <span className={styles.featureLabel}>Inclusions:</span>
                        <span className={styles.featureValue}>
                          {trip.inclusions?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className={styles.tripActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(trip)}
                      >
                        <svg
                          className={styles.actionIcon}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        className={
                          trip.is_active
                            ? styles.deactivateButton
                            : styles.activateButton
                        }
                        onClick={() => handleToggle(trip.id)}
                      >
                        <svg
                          className={styles.actionIcon}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          {trip.is_active ? (
                            <path
                              fillRule="evenodd"
                              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781z"
                              clipRule="evenodd"
                            />
                          ) : (
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          )}
                          {trip.is_active ? (
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          ) : null}
                        </svg>
                        {trip.is_active ? "Hide" : "Show"}
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteTrip(trip.id)}
                      >
                        <svg
                          className={styles.actionIcon}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className={styles.emptyTitle}>No Trips Found</h3>
              <p className={styles.emptyText}>
                {searchQuery || selectedStatus !== "all"
                  ? "No trips match your current filters. Try adjusting your search or filters."
                  : "You haven't created any trips yet. Get started by adding your first trip!"}
              </p>
              {(searchQuery || selectedStatus !== "all") && (
                <button
                  className={styles.clearFiltersButton}
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStatus("all");
                  }}
                >
                  Clear Filters
                </button>
              )}
              {!showForm && !searchQuery && selectedStatus === "all" && (
                <button
                  className={styles.createFirstButton}
                  onClick={() => setShowForm(true)}
                >
                  Create Your First Trip
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTrips;
