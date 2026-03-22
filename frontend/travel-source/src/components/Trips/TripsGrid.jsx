import { useNavigate } from "react-router-dom";
import { TripCard } from ".";
import styles from "./TripsGrid.module.css";

const TripsGrid = ({
  sortedTrips,
  currentTrips,
  currentPage,
  totalPages,
  indexOfFirstTrip,
  indexOfLastTrip,
  onPageChange,
  searchQuery,
  onClearFilters,
  recordView,
}) => {
  const navigate = useNavigate();

  return (
    <section id="trips-grid" className={styles.mainContent}>
      <div className={styles.contentContainer}>
        {/* Content Header */}
        <div className={styles.contentHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.resultsTitle}>
              <span className={styles.resultsBadge}>SELECTED COLLECTION</span>
              <h2 className={styles.resultsHeading}>
                Premium Journeys
                <span className={styles.resultsCount}> ({sortedTrips.length})</span>
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
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
                Grid
              </button>
              <button className={styles.viewButton}>
                <span className={styles.viewIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="3" y="10" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="3" y="16" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.luxuryPagination}>
                <div className={styles.paginationInfo}>
                  Showing{" "}
                  <span className={styles.infoNumber}>{indexOfFirstTrip + 1}</span> -{" "}
                  <span className={styles.infoNumber}>{Math.min(indexOfLastTrip, sortedTrips.length)}</span>{" "}
                  of <span className={styles.infoNumber}>{sortedTrips.length}</span> journeys
                </div>

                <div className={styles.paginationControls}>
                  <button
                    className={`${styles.pageButton} ${currentPage === 1 ? styles.pageButtonDisabled : ""}`}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <span className={styles.pageButtonIcon}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    Previous
                  </button>

                  <div className={styles.pageNumbers}>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                          onClick={() => onPageChange(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className={styles.pageDots}>...</span>
                        <button className={styles.pageNumber} onClick={() => onPageChange(totalPages)}>
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    className={`${styles.pageButton} ${currentPage === totalPages ? styles.pageButtonDisabled : ""}`}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <span className={styles.pageButtonIcon}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            )}
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
                  ? `Our global portfolio doesn't contain journeys matching "${searchQuery}". Try broadening your search or explore our featured collections.`
                  : "Our premium journey collection is currently being updated. Please check back shortly."}
              </p>

              <div className={styles.noResultsActions}>
                {searchQuery && (
                  <button className={styles.noResultsButton} onClick={onClearFilters}>
                    View All Journeys
                  </button>
                )}
                <button className={styles.noResultsButtonSecondary} onClick={() => navigate("/contact")}>
                  Contact Our Concierge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TripsGrid;
