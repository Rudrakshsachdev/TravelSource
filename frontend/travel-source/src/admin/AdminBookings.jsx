import { useEffect, useState } from "react";
import { fetchAdminBookings, updateBookingStatus } from "../services/api";
import styles from "./AdminBookings.module.css";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadBookings = async () => {
    try {
      const data = await fetchAdminBookings();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadBookings();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, status } : booking
        )
      );
    } catch (err) {
      console.error("Failed to update booking status:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "#10b981";
      case "DECLINED":
        return "#ef4444";
      case "PENDING":
        return "#f59e0b";
      default:
        return "#64748b";
    }
  };

  // Filtered bookings for search
  const filteredBookings = bookings.filter(b =>
    b.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.trip?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats calculation
  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: "📅",
      color: "#1e3a8a",
      subtext: "All time total",
    },
    {
      label: "Pending Review",
      value: bookings.filter(b => b.status === "PENDING").length,
      icon: "⏳",
      color: "#f59e0b",
      subtext: "Requires action",
    },
    {
      label: "Approved",
      value: bookings.filter(b => b.status === "APPROVED").length,
      icon: "✅",
      color: "#10b981",
      subtext: "Confirmed trips",
    },
    {
      label: "Revenue",
      value: `₹${bookings.filter(b => b.status === "APPROVED").reduce((acc, b) => acc + (parseFloat(b.total_amount) || 0), 0).toLocaleString()}`,
      icon: "💰",
      color: "#3b82f6",
      subtext: "From approved only",
    },
  ];

  if (loading && !isRefreshing) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.container}>
          <div className={styles.loadingSpinner} style={{ margin: "100px auto" }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Booking Management</h1>
            <p className={styles.pageSubtitle}>Review and process customer travel reservations</p>
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
                placeholder="Search by name, trip, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <button
              className={`${styles.refreshButton} ${isRefreshing ? styles.refreshing : ""}`}
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

        {/* Stats Section */}
        <div className={styles.statsSection}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={styles.statIconWrapper} style={{ background: `${stat.color}15` }}>
                  <span className={styles.statIcon}>{stat.icon}</span>
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

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Booking Requests</h2>
        </div>

        {filteredBookings.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📂</span>
            <h3 className={styles.emptyTitle}>No Bookings Found</h3>
            <p className={styles.emptyText}>There are no bookings matching your current criteria</p>
          </div>
        ) : (
          <div className={styles.bookingsContainer}>
            {filteredBookings.map((booking) => (
              <div key={booking.id} className={styles.bookingCard}>
                <div className={styles.cardTop}>
                  <div className={styles.bookingId}>ID: BOOK-{booking.id.toString().padStart(4, "0")}</div>
                  <div
                    className={styles.statusTag}
                    style={{
                      background: `${getStatusColor(booking.status)}15`,
                      color: getStatusColor(booking.status),
                    }}
                  >
                    <span
                      className={styles.statusDot}
                      style={{ background: getStatusColor(booking.status) }}
                    ></span>
                    {booking.status}
                  </div>
                </div>

                <div className={styles.tripInfo}>
                  <div className={styles.tripIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </svg>
                  </div>
                  <div className={styles.tripDetails}>
                    <h3 className={styles.tripTitle}>{booking.trip?.title || "Unknown Destination"}</h3>
                    <div className={styles.bookingDate}>
                      📅 {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  </div>
                </div>

                <div className={styles.clientSection}>
                  <div className={styles.clientInfo}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Client</span>
                      <span className={styles.infoValue}>{booking.full_name}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Group</span>
                      <span className={styles.infoValue}>{booking.persons} Persons</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Email</span>
                      <span className={styles.infoValue}>{booking.email}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Phone</span>
                      <span className={styles.infoValue}>{booking.phone}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.paymentSection}>
                  <div className={styles.amountBox}>
                    <span className={styles.amountLabel}>Total Amount</span>
                    <span className={styles.amountValue}>₹{parseFloat(booking.total_amount).toLocaleString()}</span>
                  </div>

                  {booking.status === "PENDING" && (
                    <div className={styles.cardActions}>
                      <button
                        className={styles.approveBtn}
                        onClick={() => handleStatusUpdate(booking.id, "APPROVED")}
                      >
                        Approve
                      </button>
                      <button
                        className={styles.declineBtn}
                        onClick={() => handleStatusUpdate(booking.id, "DECLINED")}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
