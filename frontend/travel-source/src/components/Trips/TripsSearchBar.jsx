import styles from "./TripsSearchBar.module.css";

const FILTER_OPTIONS = [
  "all",
  "luxury",
  "adventure",
  "cultural",
  "beach",
  "mountain",
  "monsoon",
  "community",
];

const TripsSearchBar = ({
  searchQuery,
  onSearchChange,
  onSearchClear,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  onClearAll,
}) => {
  const showClear =
    searchQuery || activeFilter !== "all" || sortBy !== "featured";

  return (
    <section className={styles.searchSection}>
      <div className={styles.searchSectionContainer}>
        <div className={styles.luxurySearch}>
          {/* Header */}
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
            {/* Search Input */}
            <div className={styles.searchInputWrapper}>
              <div className={styles.searchIcon}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search destinations, experiences, or activities..."
                value={searchQuery}
                onChange={onSearchChange}
              />
              {searchQuery && (
                <button className={styles.searchClear} onClick={onSearchClear} aria-label="Clear search">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M15 9L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M9 9L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M7 12H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M10 18H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  Filter By Category
                </div>
                <div className={styles.filterButtons}>
                  {FILTER_OPTIONS.map((filter) => (
                    <button
                      key={filter}
                      className={`${styles.filterButton} ${activeFilter === filter ? styles.filterButtonActive : ""}`}
                      onClick={() => onFilterChange(filter)}
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
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 6H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M8 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M8 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M3 6H3.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M3 12H3.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M3 18H3.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  Sort Journeys
                </div>
                <div className={styles.sortSelectWrapper}>
                  <select className={styles.sortSelect} value={sortBy} onChange={onSortChange}>
                    <option value="featured">Featured First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="duration-short">Duration: Shortest</option>
                    <option value="duration-long">Duration: Longest</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  <div className={styles.selectArrow}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {showClear && (
                <button className={styles.clearAllButton} onClick={onClearAll}>
                  <span className={styles.clearIcon}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
  );
};

export default TripsSearchBar;
