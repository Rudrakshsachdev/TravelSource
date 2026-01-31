/*
this component is used to display the list of trips
*/

import { useEffect, useState } from "react";
import { fetchTrips } from "../../services/api";
import { TripCard } from ".";
import styles from "./TripsList.module.css";

const TripsList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 6;

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
  const filteredTrips = trips.filter(trip => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return trip.title.toLowerCase().includes(query) ||
             trip.location.toLowerCase().includes(query) ||
             trip.description.toLowerCase().includes(query);
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
        return 0; // featured order (original order)
    }
  });

  // Pagination
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = sortedTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(sortedTrips.length / tripsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div className={styles.loadingContainer}>
        <div className={styles.loadingAnimation}>
          <div className={styles.planeWrapper}>
            <div className={styles.plane}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.cloud}></div>
            <div className={styles.cloud} style={{ left: '40%', top: '30%' }}></div>
            <div className={styles.cloud} style={{ left: '70%', top: '50%' }}></div>
          </div>
          <h2 className={styles.loadingTitle}>Charting Your Course</h2>
          <p className={styles.loadingSubtitle}>Discovering extraordinary travel experiences just for you...</p>
          <div className={styles.loadingProgress}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
            <span className={styles.progressText}>Loading amazing trips</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <div className={styles.errorIllustration}>
            <div className={styles.compass}>
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2"/>
                <path d="M50 10V90" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 50H90" stroke="currentColor" strokeWidth="2"/>
                <path d="M30 30L70 70" stroke="currentColor" strokeWidth="2"/>
                <path d="M30 70L70 30" stroke="currentColor" strokeWidth="2"/>
                <circle cx="50" cy="50" r="8" fill="currentColor"/>
              </svg>
            </div>
            <div className={styles.errorSymbol}>!</div>
          </div>
          <h2 className={styles.errorTitle}>Navigation Error</h2>
          <p className={styles.errorMessage}>We're having trouble loading the travel routes. Please check your connection and try again.</p>
          <div className={styles.errorActions}>
            <button 
              className={styles.primaryErrorButton} 
              onClick={() => window.location.reload()}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
              </svg>
              Retry Connection
            </button>
            <button 
              className={styles.secondaryErrorButton}
              onClick={() => navigate('/')}
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tripsPage}>
      {/* Animated Background Elements */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.floatingShape} style={{ top: '10%', left: '5%', animationDelay: '0s' }}></div>
        <div className={styles.floatingShape} style={{ top: '20%', right: '8%', animationDelay: '1s' }}></div>
        <div className={styles.floatingShape} style={{ bottom: '30%', left: '15%', animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGradient}></div>
          <div className={styles.heroPattern}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleLine}>Discover</span>
              <span className={styles.heroTitleLine}>Extraordinary</span>
              <span className={styles.heroTitleLine}>Journeys</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Where every destination tells a story, and every journey creates memories that last a lifetime.
            </p>
            
            {/* Interactive Stats */}
            <div className={styles.interactiveStats}>
              <div className={styles.statCard}>
                <div className={styles.statNumber} data-count={trips.length}>{trips.length}</div>
                <div className={styles.statLabel}>Curated Experiences</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber} data-count="50">50</div>
                <div className={styles.statLabel}>Destinations</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber} data-count="98">100</div>
                <div className={styles.statLabel}>Happy Travelers</div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className={styles.searchSection}>
            <div className={styles.searchContainer}>
              <div className={styles.searchIcon}>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                </svg>
              </div>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search destinations, activities, or themes..."
                value={searchQuery}
                onChange={handleSearch}
              />
              {searchQuery && (
                <button className={styles.clearSearch} onClick={() => setSearchQuery("")}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                </button>
              )}
            </div>

            <div className={styles.filterControls}>
              <div className={styles.sortControl}>
                <label htmlFor="sort-select" className={styles.sortLabel}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zm0 4a1 1 0 000 2h5a1 1 0 000-2H3zm0 4a1 1 0 100 2h4a1 1 0 100-2H3zm10 5a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" clipRule="evenodd"/>
                  </svg>
                  Sort By:
                </label>
                <select 
                  id="sort-select" 
                  className={styles.sortSelect}
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="duration-short">Duration: Short to Long</option>
                  <option value="duration-long">Duration: Long to Short</option>
                </select>
              </div>

              <div className={styles.filterButtons}>
                <button 
                  className={`${styles.filterButton} ${activeFilter === "all" ? styles.filterButtonActive : ''}`}
                  onClick={() => setActiveFilter("all")}
                >
                  All Trips
                </button>
                <button 
                  className={`${styles.filterButton} ${activeFilter === "adventure" ? styles.filterButtonActive : ''}`}
                  onClick={() => setActiveFilter("adventure")}
                >
                  Adventure
                </button>
                <button 
                  className={`${styles.filterButton} ${activeFilter === "luxury" ? styles.filterButtonActive : ''}`}
                  onClick={() => setActiveFilter("luxury")}
                >
                  Luxury
                </button>
                <button 
                  className={`${styles.filterButton} ${activeFilter === "cultural" ? styles.filterButtonActive : ''}`}
                  onClick={() => setActiveFilter("cultural")}
                >
                  Cultural
                </button>
              </div>

              {(searchQuery || activeFilter !== "all" || sortBy !== "featured") && (
                <button className={styles.clearFiltersButton} onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentHeader}>
          <div className={styles.resultsInfo}>
            <h2 className={styles.resultsTitle}>
              Available Journeys
              <span className={styles.resultsCount}> ({sortedTrips.length} trips)</span>
            </h2>
            <p className={styles.resultsSubtitle}>
              {searchQuery ? `Showing results for "${searchQuery}"` : "Explore our handpicked journeys, designed to inspire."}
            </p>
          </div>

          <div className={styles.viewControls}>
            <button className={styles.viewToggle}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
            <button className={styles.viewToggle}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        {sortedTrips.length > 0 ? (
          <>
            {/* Trips Grid */}
            <div className={styles.grid}>
              {currentTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button 
                  className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button 
                  className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                </button>

                <div className={styles.pageInfo}>
                  Showing {indexOfFirstTrip + 1}-{Math.min(indexOfLastTrip, sortedTrips.length)} of {sortedTrips.length} trips
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.noResults}>
            <div className={styles.noResultsIllustration}>
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 100C50 73.4903 71.4903 52 98 52C124.51 52 146 73.4903 146 100" stroke="currentColor" strokeWidth="4"/>
                <path d="M100 150C133.137 150 160 123.137 160 90C160 56.8629 133.137 30 100 30C66.8629 30 40 56.8629 40 90C40 123.137 66.8629 150 100 150Z" stroke="currentColor" strokeWidth="4"/>
                <circle cx="98" cy="100" r="8" fill="currentColor"/>
                <path d="M180 100C180 143.078 145.078 178 102 178C58.9218 178 24 143.078 24 100C24 56.9218 58.9218 22 102 22C145.078 22 180 56.9218 180 100Z" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8"/>
              </svg>
            </div>
            <h3 className={styles.noResultsTitle}>No Journeys Found</h3>
            <p className={styles.noResultsMessage}>
              {searchQuery 
                ? `We couldn't find any trips matching "${searchQuery}". Try different keywords or browse all available trips.`
                : "Our travel collection is currently being updated. Check back soon for new adventures!"}
            </p>
            {searchQuery && (
              <button className={styles.noResultsAction} onClick={clearFilters}>
                View All Trips
              </button>
            )}
          </div>
        )}

        {/* Newsletter CTA */}
        <div className={styles.newsletterCTA}>
          <div className={styles.newsletterContent}>
            <div className={styles.newsletterIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className={styles.newsletterText}>
              <h3>Never Miss an Adventure</h3>
              <p>Subscribe to our newsletter for exclusive deals and new destinations</p>
            </div>
            <div className={styles.newsletterForm}>
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripsList;