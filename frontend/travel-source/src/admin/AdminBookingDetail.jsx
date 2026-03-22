import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAdminBookings, updateBookingStatus } from "../services/api";
import styles from "./AdminBookingDetail.module.css";

const AdminBookingDetail = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [updating, setUpdating] = useState(false);

  // Fallback: fetch from list if navigated directly (no location state)
  useEffect(() => {
    if (!booking) {
      const load = async () => {
        try {
          const all = await fetchAdminBookings();
          const found = all.find((b) => b.id === parseInt(bookingId, 10));
          if (found) setBooking(found);
          else navigate("/admin/bookings");
        } catch {
          navigate("/admin/bookings");
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [bookingId, booking, navigate]);

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      await updateBookingStatus(booking.id, status);
      setBooking((prev) => ({ ...prev, status }));
    } catch (err) {
      console.error("Failed to update:", err);
    } finally {
      setUpdating(false);
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

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  const trip = booking.trip || {};

  const infoSections = [
    {
      title: "Trip Information",
      icon: "✈️",
      items: [
        { label: "Trip Name", value: trip.title || "—" },
        {
          label: "Location",
          value: `${trip.location || "—"}${trip.country ? `, ${trip.country}` : ""}`,
        },
        {
          label: "Duration",
          value: trip.duration_days
            ? `${trip.duration_days} Days${trip.duration_nights ? ` / ${trip.duration_nights} Nights` : ""}`
            : "—",
        },
        { label: "Price (per person)", value: trip.price ? `₹${Number(trip.price).toLocaleString()}` : "—" },
      ],
    },
    {
      title: "Booking Selections",
      icon: "📋",
      items: [
        { label: "Itinerary", value: booking.itinerary || "—" },
        { label: "Batch", value: booking.batch_details || "—" },
        { label: "Occupancy", value: booking.occupancy_details || "—" },
        { label: "Group Size", value: `${booking.persons} Person(s)` },
      ],
    },
    {
      title: "Customer Information",
      icon: "👤",
      items: [
        { label: "Full Name", value: booking.full_name },
        { label: "Email", value: booking.email },
        { label: "Phone", value: booking.phone },
        {
          label: "Booking Date",
          value: booking.created_at
            ? new Date(booking.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "—",
        },
      ],
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Back Button */}
        <button className={styles.backBtn} onClick={() => navigate("/admin/bookings")}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Bookings
        </button>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.bookingIdLabel}>
              BOOKING ID: BOOK-{booking.id.toString().padStart(4, "0")}
            </span>
            <h1 className={styles.pageTitle}>{trip.title || "Booking Details"}</h1>
            {trip.location && (
              <p className={styles.pageSubtitle}>
                📍 {trip.location}
                {trip.country ? `, ${trip.country}` : ""}
                {trip.duration_days ? ` · ${trip.duration_days} Days` : ""}
              </p>
            )}
          </div>
          <div>
            <div
              className={styles.statusBadge}
              style={{
                background: `${getStatusColor(booking.status)}15`,
                color: getStatusColor(booking.status),
                borderColor: getStatusColor(booking.status),
              }}
            >
              <span
                className={styles.statusDot}
                style={{ background: getStatusColor(booking.status) }}
              ></span>
              {booking.status}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Info Sections */}
          <div className={styles.leftCol}>
            {infoSections.map((section, idx) => (
              <div key={idx} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>{section.icon}</span>
                  <h2 className={styles.cardTitle}>{section.title}</h2>
                </div>
                <div className={styles.cardBody}>
                  {section.items.map((item, i) => (
                    <div key={i} className={styles.infoRow}>
                      <span className={styles.infoLabel}>{item.label}</span>
                      <span className={styles.infoValue}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className={styles.rightCol}>
            {/* Payment Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>💰</span>
                <h2 className={styles.cardTitle}>Payment Summary</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Persons</span>
                  <span className={styles.infoValue}>{booking.persons}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Total Amount</span>
                  <span className={styles.infoValue} style={{ fontWeight: 800, fontSize: "1.3rem", color: "#1e293b" }}>
                    ₹{parseFloat(booking.total_amount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            {booking.status === "PENDING" && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>⚡</span>
                  <h2 className={styles.cardTitle}>Actions</h2>
                </div>
                <div className={styles.actionsBody}>
                  <button
                    className={styles.approveBtn}
                    onClick={() => handleStatusUpdate("APPROVED")}
                    disabled={updating}
                  >
                    ✅ Approve Booking
                  </button>
                  <button
                    className={styles.declineBtn}
                    onClick={() => handleStatusUpdate("DECLINED")}
                    disabled={updating}
                  >
                    ❌ Decline Booking
                  </button>
                </div>
              </div>
            )}

            {booking.status !== "PENDING" && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>📌</span>
                  <h2 className={styles.cardTitle}>Decision</h2>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.finalStatus} style={{ color: getStatusColor(booking.status) }}>
                    {booking.status === "APPROVED" ? "✅ Booking Approved" : "❌ Booking Declined"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetail;
