import { useEffect, useState } from "react";
import { fetchTrips } from "../../services/api";
import { TripCard } from ".";
import styles from "./TripsList.module.css";
import { useNavigate } from "react-router-dom";
import usePersonalization from "../../hooks/usePersonalization";
import PersonalizationSection from "./PersonalizationSection";
import PanoramaBanner from "./PanoramaBanner";
import CinematicPanorama from "./CinematicPanorama";
import InternationalTrips from "./InternationalTrips";

const TripsList = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 6;

  const {
    interests,
    setInterests,
    recommended,
    recentlyViewed,
    loadingRec,
    recordView,
  } = usePersonalization(trips);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await fetchTrips();
        setTrips(data);
      } catch (err) {
        setError("Unable to load trips.");
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  // Filter and sort trips
  const filteredTrips = trips.filter((trip) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        trip.title.toLowerCase().includes(query) ||
        trip.location.toLowerCase().includes(query) ||
        (trip.country || "").toLowerCase().includes(query) ||
        trip.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Sort trips
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "duration-long":
        return b.duration_days - a.duration_days;
      case "duration-short":
        return a.duration_days - b.duration_days;
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = sortedTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(sortedTrips.length / tripsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveFilter("all");
    setSortBy("featured");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className={styles.luxuryLoading}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingOrbit}>
            <div className={styles.orbitCenter}>
              <div className={styles.orbitLogo}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className={styles.orbitPoint}></div>
            <div className={styles.orbitPoint}></div>
            <div className={styles.orbitPoint}></div>
          </div>

          <div className={styles.loadingText}>
            <h2 className={styles.loadingTitle}>
              <span className={styles.titleWord}>Curating</span>
              <span className={styles.titleWord}>Extraordinary</span>
              <span className={styles.titleWord}>Journeys</span>
            </h2>
            <p className={styles.loadingSubtitle}>
              Accessing our global collection of premium travel experiences...
            </p>
          </div>

          <div className={styles.loadingStats}>
            <div className={styles.loadingStat}>
              <div className={styles.statNumber} data-count="100">
                0
              </div>
              <div className={styles.statLabel}>Destinations</div>
            </div>
            <div className={styles.loadingDivider}></div>
            <div className={styles.loadingStat}>
              <div className={styles.statNumber} data-count="500">
                0
              </div>
              <div className={styles.statLabel}>Experiences</div>
            </div>
            <div className={styles.loadingDivider}></div>
            <div className={styles.loadingStat}>
              <div className={styles.statNumber} data-count="24">
                0
              </div>
              <div className={styles.statLabel}>Hours</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.luxuryError}>
        <div className={styles.errorScene}>
          <div className={styles.errorGlobe}>
            <div className={styles.globeLines}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={styles.globeLine}
                  style={{ transform: `rotate(${i * 45}deg)` }}
                ></div>
              ))}
            </div>
            <div className={styles.globeCenter}>
              <div className={styles.errorSymbol}>!</div>
            </div>
          </div>

          <div className={styles.errorContent}>
            <h2 className={styles.errorTitle}>
              <span className={styles.errorTitleMain}>Navigation Error</span>
              <span className={styles.errorTitleSub}>
                Unable to Access Travel Portfolio
              </span>
            </h2>

            <div className={styles.errorCard}>
              <p className={styles.errorMessage}>
                Our global concierge network is experiencing temporary
                connectivity issues. Our team is already working to restore
                access to our premium travel collection.
              </p>

              <div className={styles.errorActions}>
                <button
                  className={styles.errorBtnPrimary}
                  onClick={() => window.location.reload()}
                >
                  <span className={styles.btnIcon}>
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.5 2.5V7.5H12.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.5 17.5V12.5H7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17.5 7.5L13.75 3.75C12.6825 2.6825 11.265 2 9.75 2C6.0225 2 3 5.0225 3 8.75C3 9.3525 3.085 9.935 3.2425 10.4875"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.5 12.5L6.25 16.25C7.3175 17.3175 8.735 18 10.25 18C13.9775 18 17 14.9775 17 11.25C17 10.6475 16.915 10.065 16.7575 9.5125"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className={styles.btnText}>Retrieve Collection</span>
                </button>

                <button
                  className={styles.errorBtnSecondary}
                  onClick={() => navigate("/contact")}
                >
                  <span className={styles.btnIcon}>
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.5 5.83333L9.0755 10.05C9.635 10.4242 10.365 10.4242 10.9245 10.05L17.5 5.83333M4.16667 15.8333H15.8333C16.7538 15.8333 17.5 15.0871 17.5 14.1667V5.83333C17.5 4.91286 16.7538 4.16667 15.8333 4.16667H4.16667C3.24619 4.16667 2.5 4.91286 2.5 5.83333V14.1667C2.5 15.0871 3.24619 15.8333 4.16667 15.8333Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className={styles.btnText}>Contact Concierge</span>
                </button>
              </div>
            </div>

            <div className={styles.errorFooter}>
              <div className={styles.errorStatus}>
                <div className={styles.statusIndicator}></div>
                <span className={styles.statusText}>
                  24/7 Support Available
                </span>
              </div>
              <a href="tel:+18005551234" className={styles.errorContact}>
                +1 (800) 555-1234
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.luxuryTripsPage}>
      {/* Luxury Background Elements */}
      <div className={styles.luxuryBackground}>
        <div className={styles.backgroundGlow}></div>
        <div className={styles.backgroundGrid}></div>
        {/* Enhanced floating particles */}
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.orbitRing}></div>
        <div className={styles.orbitRing}></div>
      </div>

      {/* Cinematic Panorama Banner */}
      <PanoramaBanner />

      {/* Cinematic Panoramic Hero with Sliding Background */}
      <CinematicPanorama />

      {/* International Trips Scrolling Showcase */}
      <InternationalTrips />

      {/* Search & Filter Section */}
      <section className={styles.searchSection}>
        <div className={styles.searchSectionContainer}>
          <div className={styles.luxurySearch}>
            <div className={styles.searchHeader}>
              <div className={styles.searchTitle}>
                <span className={styles.searchTitleNumber}>01</span>
                <h3 className={styles.searchTitleText}>
                  Find Your Perfect Journey
                </h3>
              </div>
              <div className={styles.searchSubtitle}>
                Filter by destination, experience, or preference
              </div>
            </div>

            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <div className={styles.searchIcon}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M16.5 16.5L21 21"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search destinations, experiences, or activities..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
                {searchQuery && (
                  <button
                    className={styles.searchClear}
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M15 9L9 15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9 9L15 15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
                <div className={styles.searchBorder}></div>
              </div>

              {/* Filter Controls */}
              <div className={styles.filterControls}>
                <div className={styles.filterSection}>
                  <div className={styles.filterTitle}>
                    <span className={styles.filterIcon}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 6H20"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M7 12H17"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M10 18H14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    Filter By Category
                  </div>
                  <div className={styles.filterButtons}>
                    {[
                      "all",
                      "luxury",
                      "adventure",
                      "cultural",
                      "beach",
                      "mountain",
                    ].map((filter) => (
                      <button
                        key={filter}
                        className={`${styles.filterButton} ${activeFilter === filter ? styles.filterButtonActive : ""}`}
                        onClick={() => setActiveFilter(filter)}
                      >
                        <span className={styles.filterButtonText}>
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </span>
                        <span className={styles.filterButtonUnderline}></span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.sortSection}>
                  <div className={styles.sortTitle}>
                    <span className={styles.sortIcon}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 6H21"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M8 12H21"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M8 18H21"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M3 6H3.01"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M3 12H3.01"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M3 18H3.01"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    Sort Journeys
                  </div>
                  <div className={styles.sortSelectWrapper}>
                    <select
                      className={styles.sortSelect}
                      value={sortBy}
                      onChange={handleSortChange}
                    >
                      <option value="featured">Featured First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="duration-short">Duration: Shortest</option>
                      <option value="duration-long">Duration: Longest</option>
                      <option value="popular">Most Popular</option>
                    </select>
                    <div className={styles.selectArrow}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {(searchQuery ||
                  activeFilter !== "all" ||
                  sortBy !== "featured") && (
                  <button
                    className={styles.clearAllButton}
                    onClick={clearFilters}
                  >
                    <span className={styles.clearIcon}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 6L6 18"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6 6L18 18"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className={styles.mainContent}>
        <div className={styles.contentContainer}>
          {/* Content Header */}
          <div className={styles.contentHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.resultsTitle}>
                <span className={styles.resultsBadge}>SELECTED COLLECTION</span>
                <h2 className={styles.resultsHeading}>
                  Premium Journeys
                  <span className={styles.resultsCount}>
                    {" "}
                    ({sortedTrips.length})
                  </span>
                </h2>
              </div>
              <p className={styles.resultsSubtitle}>
                {searchQuery
                  ? `Found ${sortedTrips.length} journeys matching "${searchQuery}"`
                  : "Handpicked experiences from our global portfolio"}
              </p>
            </div>

            <div className={styles.headerRight}>
              <div className={styles.viewControls}>
                <button className={styles.viewButton}>
                  <span className={styles.viewIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="14"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                  Grid
                </button>
                <button className={styles.viewButton}>
                  <span className={styles.viewIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="4"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="3"
                        y="10"
                        width="18"
                        height="4"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="3"
                        y="16"
                        width="18"
                        height="4"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Trips Grid */}
          {sortedTrips.length > 0 ? (
            <>
              <div className={styles.tripsGrid}>
                {currentTrips.map((trip, index) => (
                  <div
                    key={trip.id}
                    className={styles.tripCardWrapper}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <TripCard trip={trip} index={index} onView={recordView} />
                  </div>
                ))}
              </div>

              {/* Luxury Pagination */}
              {totalPages > 1 && (
                <div className={styles.luxuryPagination}>
                  <div className={styles.paginationInfo}>
                    Showing{" "}
                    <span className={styles.infoNumber}>
                      {indexOfFirstTrip + 1}
                    </span>{" "}
                    -
                    <span className={styles.infoNumber}>
                      {" "}
                      {Math.min(indexOfLastTrip, sortedTrips.length)}
                    </span>{" "}
                    of
                    <span className={styles.infoNumber}>
                      {" "}
                      {sortedTrips.length}
                    </span>{" "}
                    journeys
                  </div>

                  <div className={styles.paginationControls}>
                    <button
                      className={`${styles.pageButton} ${styles.pageButtonPrev} ${currentPage === 1 ? styles.pageButtonDisabled : ""}`}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <span className={styles.pageButtonIcon}>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15 6L9 12L15 18"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      Previous
                    </button>

                    <div className={styles.pageNumbers}>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNumber}
                              className={`${styles.pageNumber} ${currentPage === pageNumber ? styles.pageNumberActive : ""}`}
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          );
                        },
                      )}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className={styles.pageDots}>...</span>
                          <button
                            className={styles.pageNumber}
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      className={`${styles.pageButton} ${styles.pageButtonNext} ${currentPage === totalPages ? styles.pageButtonDisabled : ""}`}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <span className={styles.pageButtonIcon}>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 6L15 12L9 18"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Personalization Section */}
              <PersonalizationSection
                interests={interests}
                setInterests={setInterests}
                recommended={recommended}
                recentlyViewed={recentlyViewed}
                loadingRec={loadingRec}
                recordView={recordView}
              />

              {/* Travel Stats Section */}
              <div className={styles.travelStatsSection}>
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <div className={styles.statIconWrap}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17 21V19C17 17.9 16.1 17 15 17H9C7.9 17 7 17.9 7 19V21"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="9"
                          r="4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <path
                          d="M23 21V19C23 18 22.3 17.1 21 16.7"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 3.1C17.3 3.5 18 4.4 18 5.5C18 6.6 17.3 7.5 16 7.9"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className={styles.statNumber}>10,000+</div>
                    <div className={styles.statLabel}>Happy Travelers</div>
                  </div>

                  <div className={styles.statDivider}></div>

                  <div className={styles.statItem}>
                    <div className={styles.statIconWrap}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2L14.4 8.3H21.2L15.9 12.1L17.9 18.4L12 14.6L6.1 18.4L8.1 12.1L2.8 8.3H9.6L12 2Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div className={styles.statNumber}>4.9</div>
                    <div className={styles.statLabel}>Average Rating</div>
                  </div>

                  <div className={styles.statDivider}></div>

                  <div className={styles.statItem}>
                    <div className={styles.statIconWrap}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <path
                          d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                      </svg>
                    </div>
                    <div className={styles.statNumber}>120+</div>
                    <div className={styles.statLabel}>Curated Trips</div>
                  </div>

                  <div className={styles.statDivider}></div>

                  <div className={styles.statItem}>
                    <div className={styles.statIconWrap}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <ellipse
                          cx="12"
                          cy="12"
                          rx="3.5"
                          ry="9"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <path
                          d="M3 12H21"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                        <path
                          d="M4.5 7.5C7 8.5 10 9 12 9C14 9 17 8.5 19.5 7.5"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                        <path
                          d="M4.5 16.5C7 15.5 10 15 12 15C14 15 17 15.5 19.5 16.5"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className={styles.statNumber}>25</div>
                    <div className={styles.statLabel}>Countries Covered</div>
                  </div>
                </div>
              </div>

              {/* Featured Destination Highlight */}
              <div className={styles.featuredDestination}>
                {/* Left — content */}
                <div className={styles.featuredContent}>
                  <div className={styles.featuredEyebrow}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2l2.09 6.43H21l-5.47 3.97 2.09 6.43L12 14.86l-5.62 3.97 2.09-6.43L3 8.43h6.91L12 2z" />
                    </svg>
                    <span>Featured This Month</span>
                  </div>

                  <h2 className={styles.featuredTitle}>
                    Bali{" "}
                    <span className={styles.featuredTitleAccent}>Escape</span>
                  </h2>

                  <p className={styles.featuredDescription}>
                    Drift into lush rice terraces, sacred temple ceremonies, and
                    sun-drenched volcanic shores. Our Bali Escape is a curated
                    14-day immersion into the Island of the Gods — blending
                    barefoot luxury with authentic cultural encounters.
                  </p>

                  <div className={styles.featuredTags}>
                    <span className={styles.featuredTag}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <path
                          d="M12 6v6l4 2"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                      14 Days
                    </span>
                    <span className={styles.featuredTag}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <path
                          d="M12 8v4l3 3"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                      Indonesia
                    </span>
                    <span className={styles.featuredTag}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2L14.4 8.3H21.2L15.9 12.1L17.9 18.4L12 14.6L6.1 18.4L8.1 12.1L2.8 8.3H9.6L12 2Z"
                          fill="currentColor"
                        />
                      </svg>
                      4.9 Rated
                    </span>
                  </div>

                  <button
                    className={styles.featuredCTA}
                    onClick={() => navigate("/trips")}
                  >
                    <span>View Details</span>
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 10H16M16 10L11 5M16 10L11 15"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Right — visual panel */}
                <div className={styles.featuredVisual}>
                  <div className={styles.featuredVisualGlow}></div>

                  {/* Floating decoration rings */}
                  <div
                    className={styles.featuredRing}
                    style={{
                      width: "220px",
                      height: "220px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                    }}
                  ></div>
                  <div
                    className={styles.featuredRing}
                    style={{
                      width: "320px",
                      height: "320px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      opacity: "0.35",
                    }}
                  ></div>
                  <div
                    className={styles.featuredRing}
                    style={{
                      width: "420px",
                      height: "420px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      opacity: "0.18",
                    }}
                  ></div>

                  {/* Location pin center */}
                  <div className={styles.featuredPin}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>

                  {/* Floating info chips */}
                  <div
                    className={`${styles.featuredChip} ${styles.featuredChipTop}`}
                  >
                    <span className={styles.featuredChipDot}></span>
                    <span>Ubud · Rice Terraces</span>
                  </div>
                  <div
                    className={`${styles.featuredChip} ${styles.featuredChipBottom}`}
                  >
                    <span className={styles.featuredChipDot}></span>
                    <span>Seminyak · Beach Club</span>
                  </div>
                  <div
                    className={`${styles.featuredChip} ${styles.featuredChipLeft}`}
                  >
                    <span className={styles.featuredChipDot}></span>
                    <span>Tanah Lot · Temples</span>
                  </div>
                </div>
              </div>

              {/* Featured Destination 2 — Santorini (visual LEFT, content RIGHT) */}
              <div
                className={`${styles.featuredDestination} ${styles.featuredDestinationAlt}`}
              >
                {/* Left — visual panel */}
                <div
                  className={`${styles.featuredVisual} ${styles.featuredVisualSantorini}`}
                >
                  <div className={styles.featuredVisualGlow}></div>
                  <div
                    className={styles.featuredRing}
                    style={{
                      width: "220px",
                      height: "220px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                    }}
                  ></div>
                  <div
                    className={styles.featuredRing}
                    style={{
                      width: "320px",
                      height: "320px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      opacity: "0.35",
                    }}
                  ></div>
                  <div
                    className={styles.featuredRing}
                    style={{
                      width: "420px",
                      height: "420px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      opacity: "0.18",
                    }}
                  ></div>
                  <div className={styles.featuredPin}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div
                    className={`${styles.featuredChip} ${styles.featuredChipTop}`}
                  >
                    <span className={styles.featuredChipDot}></span>
                    <span>Oia · Caldera Views</span>
                  </div>
                  <div
                    className={`${styles.featuredChip} ${styles.featuredChipBottom}`}
                  >
                    <span className={styles.featuredChipDot}></span>
                    <span>Perissa · Black Beach</span>
                  </div>
                  <div
                    className={`${styles.featuredChip} ${styles.featuredChipLeft}`}
                  >
                    <span className={styles.featuredChipDot}></span>
                    <span>Fira · Sunset Terrace</span>
                  </div>
                </div>

                {/* Right — content panel */}
                <div className={styles.featuredContent}>
                  <div className={styles.featuredEyebrow}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2l2.09 6.43H21l-5.47 3.97 2.09 6.43L12 14.86l-5.62 3.97 2.09-6.43L3 8.43h6.91L12 2z" />
                    </svg>
                    <span>Editor&apos;s Pick</span>
                  </div>
                  <h2 className={styles.featuredTitle}>
                    Santorini{" "}
                    <span className={styles.featuredTitleAccent}>Reverie</span>
                  </h2>
                  <p className={styles.featuredDescription}>
                    Perched above the cobalt Aegean, whitewashed domes catch the
                    golden hour light while volcanic cliffs plunge into crystal
                    waters below. Our Santorini Reverie is a 10-day odyssey
                    through Greece&apos;s most iconic island — intimate,
                    unhurried, and utterly breathtaking.
                  </p>
                  <div className={styles.featuredTags}>
                    <span className={styles.featuredTag}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <path
                          d="M12 6v6l4 2"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                      10 Days
                    </span>
                    <span className={styles.featuredTag}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <path
                          d="M12 8v4l3 3"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                      Greece
                    </span>
                    <span className={styles.featuredTag}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2L14.4 8.3H21.2L15.9 12.1L17.9 18.4L12 14.6L6.1 18.4L8.1 12.1L2.8 8.3H9.6L12 2Z"
                          fill="currentColor"
                        />
                      </svg>
                      4.8 Rated
                    </span>
                  </div>
                  <button
                    className={styles.featuredCTA}
                    onClick={() => navigate("/trips")}
                  >
                    <span>View Details</span>
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 10H16M16 10L11 5M16 10L11 15"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Featured Destination 3 — Kyoto (visual RIGHT, content LEFT) */}
              <div className={styles.featuredDestination}>
                {/* Left — content */}
                <div className={styles.featuredContent}>
                  <div className={styles.featuredEyebrow}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2l2.09 6.43H21l-5.47 3.97 2.09 6.43L12 14.86l-5.62 3.97 2.09-6.43L3 8.43h6.91L12 2z" />
                    </svg>
                    <span>Signature Journey</span>
                  </div>
                  <h2 className={styles.featuredTitle}>
                    Kyoto{" "}
                    <span className={styles.featuredTitleAccent}>in Bloom</span>
                  </h2>
                  <p className={styles.featuredDescription}>
                    Follow the path of silk-robed geisha through stone lantern
                    alleys as cherry blossoms drift overhead. Our Kyoto in Bloom
                    is a 12-day cultural immersion into Japan&apos;s ancient
                    capital — where zen gardens, hidden tea houses, and
                    thousand-year-old shrines await at every turn.
                  </p>
                  <div className={styles.featuredTags}>
                    <span className={styles.featuredTag}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <path
                          d="M12 6v6l4 2"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                      12 Days
                    </span>
                    <span className={styles.featuredTag}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <path
                          d="M12 8v4l3 3"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                      Japan
                    </span>
                    <span className={styles.featuredTag}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2L14.4 8.3H21.2L15.9 12.1L17.9 18.4L12 14.6L6.1 18.4L8.1 12.1L2.8 8.3H9.6L12 2Z"
                          fill="currentColor"
                        />
                      </svg>
                      5.0 Rated
                    </span>
                  </div>
                  <button
                    className={styles.featuredCTA}
                    onClick={() => navigate("/trips")}
                  >
                    <span>View Details</span>
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 10H16M16 10L11 5M16 10L11 15"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Right — visual panel */}
                <div
                  className={`${styles.featuredVisual} ${styles.featuredVisualKyoto}`}
                >
                  <div className={styles.featuredVisualGlow}></div>
                  <div
                    className={styles.featuredRing}
                    style={{
                      width: "220px",
                      height: "220px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                    }}
                  ></div>
                  <div
                    className={styles.featuredRing}
                    style={{
                      width: "320px",
                      height: "320px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      opacity: "0.35",
                    }}
                  ></div>
                  <div
                    className={styles.featuredRing}
                    style={{
                      width: "420px",
                      height: "420px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      opacity: "0.18",
                    }}
                  ></div>
                  <div className={styles.featuredPin}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div
                    className={`${styles.featuredChip} ${styles.featuredChipTop}`}
                  >
                    <span className={styles.featuredChipDot}></span>
                    <span>Arashiyama · Bamboo</span>
                  </div>
                  <div
                    className={`${styles.featuredChip} ${styles.featuredChipBottom}`}
                  >
                    <span className={styles.featuredChipDot}></span>
                    <span>Fushimi · Shrine Gates</span>
                  </div>
                  <div
                    className={`${styles.featuredChip} ${styles.featuredChipLeft}`}
                  >
                    <span className={styles.featuredChipDot}></span>
                    <span>Gion · Geisha District</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsIllustration}>
                <div className={styles.compassAnimation}>
                  <div className={styles.compassRing}>
                    <div className={styles.compassNeedle}></div>
                  </div>
                </div>
              </div>

              <div className={styles.noResultsContent}>
                <h3 className={styles.noResultsTitle}>Journey Not Found</h3>
                <p className={styles.noResultsMessage}>
                  {searchQuery
                    ? `Our global portfolio doesn't contain journeys matching "${searchQuery}". 
                       Try broadening your search or explore our featured collections.`
                    : "Our premium journey collection is currently being updated. Please check back shortly."}
                </p>

                <div className={styles.noResultsActions}>
                  {searchQuery && (
                    <button
                      className={styles.noResultsButton}
                      onClick={clearFilters}
                    >
                      View All Journeys
                    </button>
                  )}
                  <button
                    className={styles.noResultsButtonSecondary}
                    onClick={() => navigate("/contact")}
                  >
                    Contact Our Concierge
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Floating CTA */}
      <div className={styles.floatingCTA}>
        <button className={styles.floatingButton}>
          <span className={styles.floatingIcon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M12 8V16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M8 12H16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className={styles.floatingText}>Create Custom Journey</span>
        </button>
      </div>
    </div>
  );
};

export default TripsList;
