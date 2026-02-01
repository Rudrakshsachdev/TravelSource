import { useEffect, useState } from "react";
import { fetchAdminEnquiries } from "../services/api";
import styles from "./AdminEnquiries.module.css";

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminEnquiries();
      setEnquiries(data);
    } catch (err) {
      setError("Unable to fetch enquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f97316";
      case "responded":
        return "#10b981";
      case "booked":
        return "#3b82f6";
      default:
        return "#64748b";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return (
          <svg className={styles.statusIcon} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case "responded":
        return (
          <svg className={styles.statusIcon} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case "booked":
        return (
          <svg className={styles.statusIcon} viewBox="0 0 20 20" fill="currentColor">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.584 1.032 2.79 1.032s2.228-.383 2.79-1.031a1 1 0 00-1.51-1.31c-.163.187-.452.377-.843.504v-1.941a4.535 4.535 0 001.676-.662C13.398 9.766 14 8.991 14 8c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 5.092V5z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className={styles.statusIcon} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    // TODO: Add API call to update status
    setEnquiries(prev => prev.map(enquiry =>
      enquiry.id === id ? { ...enquiry, status: newStatus } : enquiry
    ));
  };

  const handleSelectEnquiry = (id) => {
    setSelectedEnquiries(prev =>
      prev.includes(id)
        ? prev.filter(enquiryId => enquiryId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEnquiries.length === enquiries.length) {
      setSelectedEnquiries([]);
    } else {
      setSelectedEnquiries(enquiries.map(enquiry => enquiry.id));
    }
  };

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesStatus = selectedStatus === "all" || enquiry.status === selectedStatus;
    const matchesSearch = enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.trip_title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedEnquiries = [...filteredEnquiries].sort((a, b) => {
    if (sortBy === "date-desc") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === "date-asc") {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (sortBy === "name-asc") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "name-desc") {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  const stats = {
    total: enquiries.length,
    pending: enquiries.filter(e => e.status === "pending").length,
    responded: enquiries.filter(e => e.status === "responded").length,
    booked: enquiries.filter(e => e.status === "booked").length,
  };

  const statusOptions = [
    { id: "all", label: "All", count: stats.total },
    { id: "pending", label: "Pending", count: stats.pending },
    { id: "responded", label: "Responded", count: stats.responded },
    { id: "booked", label: "Booked", count: stats.booked },
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading enquiries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <svg className={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <h3 className={styles.errorTitle}>Error Loading Enquiries</h3>
        <p className={styles.errorText}>{error}</p>
        <button className={styles.retryButton} onClick={loadEnquiries}>
          <svg className={styles.retryIcon} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Try Again
        </button>
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
            <h1 className={styles.pageTitle}>Enquiry Management</h1>
            <p className={styles.pageSubtitle}>
              Manage and respond to customer travel enquiries
            </p>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.refreshButton} onClick={loadEnquiries}>
              <svg className={styles.refreshIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>

            <button className={styles.exportButton}>
              <svg className={styles.exportIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className={styles.statsSection}>
          {statusOptions.map((stat) => (
            <div
              key={stat.id}
              className={`${styles.statCard} ${selectedStatus === stat.id ? styles.statCardActive : ''}`}
              onClick={() => setSelectedStatus(stat.id)}
              style={{ '--stat-color': getStatusColor(stat.id) }}
            >
              <div className={styles.statHeader}>
                <h3 className={styles.statLabel}>{stat.label}</h3>
                <div className={styles.statCount}>{stat.count}</div>
              </div>
              <div className={styles.statProgress}>
                <div
                  className={styles.statProgressBar}
                  style={{
                    width: `${(stat.count / stats.total) * 100 || 0}%`,
                    backgroundColor: getStatusColor(stat.id)
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.searchContainer}>
            <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Search enquiries by name, email, or trip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.toolbarActions}>
            <div className={styles.sortContainer}>
              <svg className={styles.sortIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>
            </div>

            {selectedEnquiries.length > 0 && (
              <div className={styles.bulkActions}>
                <span className={styles.selectedCount}>
                  {selectedEnquiries.length} selected
                </span>
                <button className={styles.bulkButton}>
                  Mark as Responded
                </button>
                <button className={styles.bulkButton}>
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enquiries Table */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderCell} style={{ width: '60px' }}>
              <input
                type="checkbox"
                checked={selectedEnquiries.length === enquiries.length && enquiries.length > 0}
                onChange={handleSelectAll}
                className={styles.checkbox}
              />
            </div>
            <div className={styles.tableHeaderCell} style={{ flex: 2 }}>
              Customer & Trip
            </div>
            <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
              Contact Info
            </div>
            <div className={styles.tableHeaderCell} style={{ flex: 1.5 }}>
              Message
            </div>
            <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
              Date & Time
            </div>
            <div className={styles.tableHeaderCell} style={{ flex: 1 }}>
              Status
            </div>
            <div className={styles.tableHeaderCell} style={{ width: '120px' }}>
              Actions
            </div>
          </div>

          {sortedEnquiries.length > 0 ? (
            <div className={styles.tableBody}>
              {sortedEnquiries.map((enquiry) => (
                <div key={enquiry.id} className={styles.tableRow}>
                  <div className={styles.tableCell} style={{ width: '60px' }}>
                    <input
                      type="checkbox"
                      checked={selectedEnquiries.includes(enquiry.id)}
                      onChange={() => handleSelectEnquiry(enquiry.id)}
                      className={styles.checkbox}
                    />
                  </div>

                  <div className={styles.tableCell} style={{ flex: 2 }}>
                    <div className={styles.customerInfo}>
                      <div className={styles.customerAvatar}>
                        {enquiry.name.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.customerDetails}>
                        <h4 className={styles.customerName}>{enquiry.name}</h4>
                        <p className={styles.tripTitle}>{enquiry.trip_title}</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.tableCell} style={{ flex: 1 }}>
                    <div className={styles.contactInfo}>
                      <div className={styles.contactItem}>
                        <svg className={styles.contactIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className={styles.contactText}>{enquiry.email}</span>
                      </div>
                      <div className={styles.contactItem}>
                        <svg className={styles.contactIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className={styles.contactText}>{enquiry.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.tableCell} style={{ flex: 1.5 }}>
                    <div className={styles.messagePreview}>
                      {enquiry.message ? (
                        <>
                          <svg className={styles.messageIcon} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                          </svg>
                          <span className={styles.messageText}>
                            {enquiry.message.length > 100
                              ? `${enquiry.message.substring(0, 100)}...`
                              : enquiry.message}
                          </span>
                        </>
                      ) : (
                        <span className={styles.noMessage}>No message provided</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.tableCell} style={{ flex: 1 }}>
                    <div className={styles.dateInfo}>
                      <div className={styles.date}>
                        {new Date(enquiry.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className={styles.time}>
                        {new Date(enquiry.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className={styles.tableCell} style={{ flex: 1 }}>
                    <select
                      value={enquiry.status || "pending"}
                      onChange={(e) => handleStatusUpdate(enquiry.id, e.target.value)}
                      className={styles.statusSelect}
                      style={{
                        '--status-color': getStatusColor(enquiry.status || "pending"),
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="responded">Responded</option>
                      <option value="booked">Booked</option>
                    </select>
                  </div>

                  <div className={styles.tableCell} style={{ width: '120px' }}>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.viewButton}
                        title="View Details"
                      >
                        <svg className={styles.viewIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        className={styles.replyButton}
                        title="Reply"
                      >
                        <svg className={styles.replyIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        className={styles.deleteButton}
                        title="Delete"
                      >
                        <svg className={styles.deleteIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 7L13.03 12.7C12.7212 12.8934 12.3643 12.996 12 12.996C11.6357 12.996 11.2788 12.8934 10.97 12.7L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className={styles.emptyTitle}>No Enquiries Found</h3>
              <p className={styles.emptyText}>
                {searchQuery || selectedStatus !== "all"
                  ? "No enquiries match your current filters. Try adjusting your search or filters."
                  : "You haven't received any enquiries yet. They will appear here once customers start contacting you."}
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
            </div>
          )}
        </div>

        {/* Pagination */}
        {sortedEnquiries.length > 0 && (
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Showing {sortedEnquiries.length} of {enquiries.length} enquiries
            </div>
            <div className={styles.paginationControls}>
              <button className={styles.paginationButton} disabled>
                <svg className={styles.paginationIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Previous
              </button>
              <div className={styles.pageNumbers}>
                <span className={styles.pageNumberActive}>1</span>
                <span className={styles.pageNumber}>2</span>
                <span className={styles.pageNumber}>3</span>
                <span className={styles.pageNumber}>...</span>
                <span className={styles.pageNumber}>10</span>
              </div>
              <button className={styles.paginationButton}>
                Next
                <svg className={styles.paginationIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEnquiries;