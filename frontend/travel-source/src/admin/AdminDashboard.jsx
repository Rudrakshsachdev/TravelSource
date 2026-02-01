// import { useEffect, useState } from "react";
// import { fetchAdminEnquiries } from "../services/api";

// const AdminDashboard = () => {
//   const [count, setCount] = useState(0);
//   const [latest, setLatest] = useState([]);

//   useEffect(() => {
//     const loadData = async () => {
//       const data = await fetchAdminEnquiries();
//       setCount(data.length);
//       setLatest(data.slice(0, 5));
//     };

//     loadData();
//   }, []);

//   return (
//     <>
//       <div style={{ marginBottom: "32px" }}>
//         <h3>Total Enquiries</h3>
//         <p style={{ fontSize: "2rem", fontWeight: "600" }}>
//           {count}
//         </p>
//       </div>

//       <div>
//         <h3>Recent Enquiries</h3>

//         {latest.map((e) => (
//           <div
//             key={e.id}
//             style={{
//               background: "white",
//               padding: "16px",
//               borderRadius: "12px",
//               marginTop: "12px",
//             }}
//           >
//             <strong>{e.trip_title}</strong>
//             <p>{e.name} • {e.phone}</p>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default AdminDashboard;



import { useEffect, useState } from "react";
import { fetchAdminEnquiries } from "../services/api";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [count, setCount] = useState(0);
  const [latest, setLatest] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("today");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchAdminEnquiries();
      setCount(data.length);
      setLatest(data.slice(0, 5));
    } catch (error) {
      console.error("Failed to load enquiries:", error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const statuses = [
    { id: "all", label: "All", color: "#64748b" },
    { id: "pending", label: "Pending", color: "#f97316" },
    { id: "responded", label: "Responded", color: "#10b981" },
    { id: "booked", label: "Booked", color: "#3b82f6" },
  ];

  const timeFilters = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "All Time", value: "all" },
  ];

  const getStatusCount = (status) => {
    return latest.filter((e) => e.status === status).length;
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

  const stats = [
    {
      label: "Total Enquiries",
      value: count,
      trend: "↑ 12%",
      icon: "📋",
      color: "#1e3a8a",
      subtext: "All time total",
    },
    {
      label: "Pending Review",
      value: getStatusCount("pending"),
      trend: "⚠️ 3 urgent",
      icon: "⏳",
      color: "#f97316",
      subtext: "Requires attention",
    },
    {
      label: "Responded",
      value: getStatusCount("responded"),
      trend: "↑ 8%",
      icon: "✅",
      color: "#10b981",
      subtext: "Reply rate: 85%",
    },
    {
      label: "Converted",
      value: getStatusCount("booked"),
      trend: "↑ 15%",
      icon: "💰",
      color: "#3b82f6",
      subtext: "Booking rate: 32%",
    },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Background Overlay */}
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Enquiry Dashboard</h1>
            <p className={styles.pageSubtitle}>
              Manage and respond to customer travel enquiries
            </p>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.searchContainer}>
              <div className={styles.searchIcon}>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search enquiries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <button
              className={`${styles.refreshButton} ${isRefreshing ? styles.refreshing : ''}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <div className={styles.loadingSpinner}></div>
              ) : (
                <svg className={styles.refreshIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              )}
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className={styles.statsSection}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={styles.statIconWrapper} style={{ background: `${stat.color}15` }}>
                  <span className={styles.statIcon}>{stat.icon}</span>
                </div>
                <div className={styles.statTrend} style={{ color: stat.color }}>
                  {stat.trend}
                </div>
              </div>

              <div className={styles.statContent}>
                <h3 className={styles.statLabel}>{stat.label}</h3>
                <p className={styles.statNumber}>{stat.value}</p>
                <span className={styles.statSubtext}>{stat.subtext}</span>
              </div>

              <div className={styles.statWave} style={{ background: `${stat.color}10` }}></div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Filter by Status:</div>
            <div className={styles.statusFilters}>
              {statuses.map((status) => (
                <button
                  key={status.id}
                  className={`${styles.statusFilterButton} ${selectedStatus === status.id ? styles.statusFilterButtonActive : ""
                    }`}
                  onClick={() => setSelectedStatus(status.id)}
                  style={{
                    '--status-color': status.color,
                  }}
                >
                  <span className={styles.filterButtonText}>{status.label}</span>
                  {status.id !== "all" && (
                    <span className={styles.filterBadge}>
                      {getStatusCount(status.id)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>Time Period:</div>
            <div className={styles.timeFilters}>
              {timeFilters.map((filter) => (
                <button
                  key={filter.value}
                  className={`${styles.timeFilterButton} ${timeFilter === filter.value ? styles.timeFilterButtonActive : ""
                    }`}
                  onClick={() => setTimeFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterActions}>
            <button className={styles.exportButton}>
              <svg className={styles.exportIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export Data
            </button>
            <button className={styles.newButton}>
              <svg className={styles.plusIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Add Manual
            </button>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className={styles.recentSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Recent Enquiries</h2>
              <p className={styles.sectionSubtitle}>Latest 5 enquiries from customers</p>
            </div>
            <button className={styles.viewAllButton}>
              View All Enquiries
              <svg className={styles.arrowIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className={styles.enquiriesContainer}>
            {latest.length > 0 ? (
              latest.map((enquiry, index) => (
                <div
                  key={enquiry.id}
                  className={styles.enquiryCard}
                  onMouseEnter={() => setHoveredCard(enquiry.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    transform: hoveredCard === enquiry.id ? "translateY(-8px)" : "translateY(0)",
                  }}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.priorityBadge}>
                      <span
                        className={styles.priorityDot}
                        style={{
                          background: index === 0 ? "#ef4444" : "#f59e0b",
                          animation: index === 0 ? "pulse 2s infinite" : "none"
                        }}
                      ></span>
                      {index === 0 ? "High Priority" : "Normal"}
                    </div>
                    <button className={styles.menuButton}>
                      <span className={styles.menuIcon}>⋯</span>
                    </button>
                  </div>

                  <div className={styles.cardContent}>
                    <div className={styles.tripInfo}>
                      <div className={styles.tripIcon}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                      </div>
                      <div className={styles.tripDetails}>
                        <h4 className={styles.tripTitle}>{enquiry.trip_title}</h4>
                        <div className={styles.userInfo}>
                          <svg className={styles.userIcon} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span className={styles.userName}>{enquiry.name}</span>
                          <span className={styles.divider}>•</span>
                          <svg className={styles.phoneIcon} viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <span className={styles.userPhone}>{enquiry.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.messagePreview}>
                      {enquiry.message ? (
                        <>
                          <svg className={styles.messageIcon} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                          </svg>
                          <span className={styles.messageText}>
                            {enquiry.message.length > 80
                              ? `${enquiry.message.substring(0, 80)}...`
                              : enquiry.message}
                          </span>
                        </>
                      ) : (
                        <span className={styles.noMessage}>No message provided</span>
                      )}
                    </div>

                    <div className={styles.cardMeta}>
                      <div className={styles.metaItem}>
                        <svg className={styles.metaIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className={styles.metaText}>
                          {new Date(enquiry.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className={styles.metaItem}>
                        <svg className={styles.metaIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className={styles.metaText}>
                          {new Date(enquiry.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div
                      className={styles.statusTag}
                      style={{
                        backgroundColor: `${getStatusColor(enquiry.status || "pending")}20`,
                        color: getStatusColor(enquiry.status || "pending"),
                      }}
                    >
                      <span
                        className={styles.statusDot}
                        style={{ backgroundColor: getStatusColor(enquiry.status || "pending") }}
                      ></span>
                      {enquiry.status || "Pending"}
                    </div>

                    <div className={styles.cardActions}>
                      <button className={styles.replyButton}>
                        <svg className={styles.replyIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                        Reply
                      </button>
                      <button className={styles.viewButton}>
                        <svg className={styles.viewIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <h3 className={styles.emptyTitle}>No Enquiries Found</h3>
                <p className={styles.emptyText}>
                  There are no enquiries matching your current filters
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className={styles.quickStats}>
          <div className={styles.statMini}>
            <div className={styles.statMiniIcon}>📈</div>
            <div>
              <div className={styles.statMiniNumber}>24</div>
              <div className={styles.statMiniLabel}>Today</div>
            </div>
          </div>
          <div className={styles.statMini}>
            <div className={styles.statMiniIcon}>📊</div>
            <div>
              <div className={styles.statMiniNumber}>156</div>
              <div className={styles.statMiniLabel}>This Week</div>
            </div>
          </div>
          <div className={styles.statMini}>
            <div className={styles.statMiniIcon}>🎯</div>
            <div>
              <div className={styles.statMiniNumber}>42%</div>
              <div className={styles.statMiniLabel}>Response Rate</div>
            </div>
          </div>
          <div className={styles.statMini}>
            <div className={styles.statMiniIcon}>⏱️</div>
            <div>
              <div className={styles.statMiniNumber}>2.4h</div>
              <div className={styles.statMiniLabel}>Avg. Response</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Travel Professor Admin Dashboard • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;