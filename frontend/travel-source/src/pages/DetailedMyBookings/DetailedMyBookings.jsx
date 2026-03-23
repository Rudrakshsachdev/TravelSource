import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMyBookingDetail } from "../../services/api";
import {
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Clock,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Percent
} from "lucide-react";
import styles from "./DetailedMyBookings.module.css";

const DetailedMyBookings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBookingDetail = async () => {
      try {
        setLoading(true);
        const data = await fetchMyBookingDetail(id);
        setBooking(data);
      } catch (err) {
        setError(err.message || "Could not load booking details");
      } finally {
        setLoading(false);
      }
    };

    loadBookingDetail();
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle size={20} />;
      case "DECLINED":
        return <XCircle size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  const formatDate = (dateString, withTime = false) => {
    if (!dateString) return "Not specified";
    const options = { year: "numeric", month: "long", day: "numeric" };
    if (withTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
    }
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
          <p>Fetching your itinerary details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.errorContainer}>
          <AlertCircle size={64} className={styles.errorIcon} />
          <h2>Oops! Something went wrong</h2>
          <p>{error || "Unable to find the requested booking."}</p>
          <button className={styles.backBtn} onClick={() => navigate("/my-bookings")}>
            <ArrowLeft size={18} /> Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const { trip } = booking;
  const originalPrice = parseFloat(trip.price) * booking.persons;
  const discountAmount = parseFloat(booking.discount_amount || 0);
  const isDiscounted = discountAmount > 0;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.topAccent} />

      <div className={styles.container}>
        <button className={styles.backLink} onClick={() => navigate("/my-bookings")}>
          <ArrowLeft size={16} /> Back to Bookings
        </button>

        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.bookingId}>Booking Reference #BK-{booking.id.toString().padStart(5, "0")}</span>
            <h1 className={styles.title}>{trip.title}</h1>
            <div className={styles.locationMeta}>
              <MapPin size={18} />
              <span>{trip.location}</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={`${styles.statusBadge} ${styles[booking.status.toLowerCase()]}`}>
              {getStatusIcon(booking.status)}
              {booking.status}
            </div>
            <span className={styles.dateBooked}>Booked on {formatDate(booking.created_at)}</span>
          </div>
        </header>

        {booking.admin_note && (
          <div className={styles.adminNoteBlock}>
            <AlertCircle size={24} className={styles.adminNoteIcon} />
            <div className={styles.adminNoteContent}>
              <h4>Provider Note</h4>
              <p>{booking.admin_note}</p>
            </div>
          </div>
        )}

        <div className={styles.twoColGrid}>
          {/* Main Content Column */}
          <div className={styles.mainCol}>
            
            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>
                <FileText size={20} />
                Booking Information
              </h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoGroup}>
                  <label>Primary Traveler Name</label>
                  <p>{booking.full_name}</p>
                </div>
                <div className={styles.infoGroup}>
                  <label>Email Address</label>
                  <p>{booking.email}</p>
                </div>
                <div className={styles.infoGroup}>
                  <label>Phone Number</label>
                  <p>{booking.phone}</p>
                </div>
                <div className={styles.infoGroup}>
                  <label>Travelers</label>
                  <p>{booking.persons} Members</p>
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>
                <Calendar size={20} />
                Trip Specifics
              </h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoGroup}>
                  <label>Travel Date / Batch</label>
                  <p className={styles.highlightText}>{booking.batch_details || formatDate(booking.travel_date)}</p>
                </div>
                {booking.itinerary && (
                  <div className={styles.infoGroup}>
                    <label>Pickup & Drop Route</label>
                    <p>{booking.itinerary}</p>
                  </div>
                )}
                <div className={styles.infoGroup}>
                  <label>Occupancy Strategy</label>
                  <p>{booking.occupancy_details || "Standard Shared"}</p>
                </div>
              </div>
            </section>

            {trip.itinerary && trip.itinerary.length > 0 && (
              <section className={styles.card}>
                <h2 className={styles.sectionTitle}>Day-by-Day Itinerary</h2>
                <div className={styles.itineraryList}>
                  {trip.itinerary.map((day, idx) => {
                    const title = typeof day === "string" ? day : day.title || day.day || `Day ${idx + 1}`;
                    const desc = typeof day === "string" ? "" : day.description || day.desc || day.details || "";
                    return (
                      <div key={idx} className={styles.itineraryItem}>
                        <div className={styles.dayIndicator}>Day {idx + 1}</div>
                        <div className={styles.itineraryContent}>
                          <h4>{title}</h4>
                          <p>{desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {trip.highlights && trip.highlights.length > 0 && (
              <section className={styles.card}>
                <h2 className={styles.sectionTitle}>Trip Highlights</h2>
                <ul className={styles.genericList}>
                  {trip.highlights.map((hlt, idx) => {
                    const text = typeof hlt === "string" ? hlt : hlt.text || hlt.title || hlt.name || "";
                    return (
                      <li key={idx} className={styles.genericListItem}>
                        <span className={styles.genericBullet}>✨</span>
                        {text}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {(trip.inclusions?.length > 0 || trip.exclusions?.length > 0) && (
              <section className={styles.card}>
                <h2 className={styles.sectionTitle}>Inclusions & Exclusions</h2>
                <div className={styles.incExcGrid}>
                  {trip.inclusions && trip.inclusions.length > 0 && (
                    <div className={styles.incExcCol}>
                      <h3 className={styles.incTitle}>✅ Inclusions</h3>
                      <ul className={styles.incExcList}>
                        {trip.inclusions.map((item, i) => {
                          const text = typeof item === "string" ? item : item.text || item.label || item.name || "";
                          return (
                            <li key={i} className={styles.incItem}>
                              <span className={styles.incBullet}>✓</span>
                              {text}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                  {trip.exclusions && trip.exclusions.length > 0 && (
                    <div className={styles.incExcCol}>
                      <h3 className={styles.excTitle}>❌ Exclusions</h3>
                      <ul className={styles.incExcList}>
                        {trip.exclusions.map((item, i) => {
                          const text = typeof item === "string" ? item : item.text || item.label || item.name || "";
                          return (
                            <li key={i} className={styles.excItem}>
                              <span className={styles.excBullet}>✗</span>
                              {text}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {trip.things_to_pack && trip.things_to_pack.length > 0 && (
              <section className={styles.card}>
                <h2 className={styles.sectionTitle}>Things To Pack</h2>
                <ul className={styles.genericList}>
                  {trip.things_to_pack.map((item, idx) => {
                    const text = typeof item === "string" ? item : item.item || item.text || item.name || "";
                    return (
                      <li key={idx} className={styles.genericListItem}>
                        <span className={styles.genericBullet}>🎒</span>
                        {text}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

          </div>

          {/* Right Sidebar Column */}
          <div className={styles.sideCol}>
            <div className={styles.stickySidebar}>
              
              <div className={styles.tripSummaryCard}>
                <div className={styles.tripImageWrap}>
                  <img src={trip.image || "/placeholder-trip.jpg"} alt={trip.title} className={styles.tripImage} />
                  <div className={styles.tripDurationBadge}>{trip.duration_days} Days</div>
                </div>
                <div className={styles.tripSummaryInfo}>
                  <h3>{trip.title}</h3>
                  <a href={`/trips/${trip.id}`} className={styles.viewTripLink}>View Trip Page &rarr;</a>
                </div>
              </div>

              <div className={styles.pricingCard}>
                <h3 className={styles.pricingTitle}>Payment Summary</h3>
                
                <div className={styles.priceRow}>
                  <span>Base Booking ({booking.persons} {booking.persons > 1 ? "Members" : "Member"})</span>
                  <span>{formatCurrency(originalPrice)}</span>
                </div>
                
                {isDiscounted && (
                  <>
                    <div className={`${styles.priceRow} ${styles.discountRow}`}>
                      <span>
                        <Percent size={14} className={styles.inlineIcon} />
                        Coupon ({booking.coupon_code})
                      </span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                    <div className={styles.priceRow}>
                      <span>Original Estimate</span>
                      <span className={styles.strikethrough}>{formatCurrency(originalPrice)}</span>
                    </div>
                  </>
                )}
                
                <div className={styles.divider} />
                
                <div className={styles.totalRow}>
                  <span>Total Amount Paid</span>
                  <span className={styles.totalPrice}>{formatCurrency(booking.total_amount)}</span>
                </div>

                <div className={styles.paymentStatusBlock}>
                  <CheckCircle size={16} /> Payment Verified via Travel Professor
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedMyBookings;
