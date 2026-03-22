import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTripDetail, createBooking } from "../../services/api";
import { getAuthData } from "../../utils/auth";
import styles from "./BookingPage.module.css";

// Helper Date Formatter
const formatDate = (dateStr) => {
  if (!dateStr) return { formatted: "", month: "" };
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return { formatted: "Invalid", month: "" };
    const day = date.toLocaleDateString("en-US", { day: "2-digit" });
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return {
      formatted: `${day}-${month}`,
      month,
    };
  } catch (e) {
    return { formatted: "Error", month: "" };
  }
};

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // User input state
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    persons: 1,
  });

  // UI Selection State
  const [selectedItinerary, setSelectedItinerary] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedBatchIdx, setSelectedBatchIdx] = useState(0);
  const [selectedOccupancyIndex, setSelectedOccupancyIndex] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    const auth = getAuthData();
    if (!auth) {
      navigate("/login");
      return;
    }

    const loadTrip = async () => {
      try {
        const data = await fetchTripDetail(id);
        setTrip(data);
      } catch {
        navigate(`/trips/${id}`);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const incrementPersons = () => {
    setFormData((prev) => ({ ...prev, persons: prev.persons + 1 }));
  };

  const decrementPersons = () => {
    setFormData((prev) => ({
      ...prev,
      persons: Math.max(1, prev.persons - 1),
    }));
  };

  // Batches Processing
  const processedBatches = useMemo(() => {
    if (!trip || !trip.batches) return [];
    return trip.batches.map((batch, idx) => {
      const start = formatDate(batch.startDate);
      const end = formatDate(batch.endDate);
      return {
        ...batch,
        originalIndex: idx,
        displayDate: `${start.formatted} To ${end.formatted}`,
        startMonth: start.month,
      };
    });
  }, [trip]);

  const availableMonths = useMemo(() => {
    const months = new Set(processedBatches.map((b) => b.startMonth).filter(Boolean));
    return ["All", ...Array.from(months)];
  }, [processedBatches]);

  const filteredBatches = useMemo(() => {
    if (selectedMonth === "All") return processedBatches;
    return processedBatches.filter((b) => b.startMonth === selectedMonth);
  }, [processedBatches, selectedMonth]);

  // Pricing Options Processing
  const priceOptions = useMemo(() => {
    if (!trip) return [];
    return Array.isArray(trip.price_options) && trip.price_options.length > 0
      ? trip.price_options
      : [{ occupancy: "Trip Package", price: trip.price }];
  }, [trip]);

  const currentOption = priceOptions[selectedOccupancyIndex] || priceOptions[0];

  // Calculations
  const basePrice = currentOption?.price || 0;
  const amount = basePrice * formData.persons;
  const gst = amount * 0.05; // 5% GST
  const grandTotal = amount + gst;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(price || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const bookingPayload = {
        trip: trip.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        persons: formData.persons,
        total_amount: grandTotal,
        // Assuming backend supports these or ignores them:
        // batch_index: selectedBatchIdx,
        // occupancy_type: currentOption.occupancy
      };

      await createBooking(bookingPayload);
      alert("Booking created successfully! Redirecting to your bookings...");
      navigate("/my-bookings");
    } catch {
      alert("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading trip details...</p>
      </div>
    );
  }

  if (!trip) return null;

  const itineraryLabel =
    trip.pickup_location && trip.drop_location
      ? `${trip.pickup_location} to ${trip.drop_location}`
      : "Standard Itinerary";

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <button
          className={styles.backButton}
          onClick={() => navigate(`/trips/${id}`)}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to trips
        </button>

        <div className={styles.bookingLayout}>
          {/* LEFT COLUMN */}
          <div className={styles.leftColumn}>
            {/* Trip Header Card */}
            <div className={styles.card}>
              <h1 className={styles.cardTitleBig}>
                {trip.title} | {trip.location || "India"} | {trip.duration_days}{" "}
                Days
              </h1>
            </div>

            {/* Itineraries Card */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Itineraries</h2>
              <div
                className={`${styles.radioRow} ${
                  selectedItinerary === 0 ? styles.radioRowActive : ""
                }`}
                onClick={() => setSelectedItinerary(0)}
              >
                <div className={styles.radioLeft}>
                  <div className={styles.radioCircle}>
                    {selectedItinerary === 0 && (
                      <div className={styles.radioCircleInner}></div>
                    )}
                  </div>
                  <span className={styles.radioLabel}>{itineraryLabel}</span>
                </div>
                {selectedItinerary === 0 && (
                  <span className={styles.pillSelected}>Selected</span>
                )}
              </div>
            </div>

            {/* Batches Card */}
            {processedBatches.length > 0 && (
              <div className={styles.card}>
                <div className={styles.batchesHeader}>
                  <h2 className={styles.cardTitle} style={{ margin: 0 }}>
                    Batches
                  </h2>
                  <div className={styles.monthFilters}>
                    {availableMonths.map((month) => (
                      <span
                        key={month}
                        className={`${styles.monthFilter} ${
                          selectedMonth === month
                            ? styles.monthFilterActive
                            : ""
                        }`}
                        onClick={() => setSelectedMonth(month)}
                      >
                        {month}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.batchesGrid}>
                  {filteredBatches.map((batch) => {
                    const status = batch.status || "Available";
                    const isFull = status === "Full";
                    const isFillingFast = status === "Filling Fast";
                    const isActive = selectedBatchIdx === batch.originalIndex;

                    let pillClass = styles.pillAvailable;
                    if (isFull) pillClass = styles.pillFull;
                    else if (isFillingFast) pillClass = styles.pillFillingFast;

                    return (
                      <div
                        key={batch.originalIndex}
                        className={`${styles.batchItem} ${
                          isActive ? styles.batchItemActive : ""
                        } ${isFull ? styles.batchItemDisabled : ""}`}
                        onClick={() => {
                          if (!isFull) setSelectedBatchIdx(batch.originalIndex);
                        }}
                      >
                        <div className={styles.radioLeft}>
                          <div className={styles.radioCircle}>
                            {isActive && (
                              <div className={styles.radioCircleInner}></div>
                            )}
                          </div>
                          <span
                            className={styles.radioLabel}
                            style={{ fontSize: "0.9rem" }}
                          >
                            {batch.displayDate}
                          </span>
                        </div>
                        <span className={pillClass}>{status}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Occupancy Card */}
            {priceOptions && priceOptions.length > 0 && (
              <div className={styles.card}>
                <div className={styles.occupancyHeader}>
                  <div>
                    <h2 className={styles.cardTitle} style={{ margin: 0 }}>
                      Occupancy
                    </h2>
                    <span className={styles.occupancySubtext}>
                      (Room Arrangement or Room Sharing)
                    </span>
                  </div>
                  <div className={styles.occupancyTabs}>
                    {priceOptions.map((opt, idx) => (
                      <div
                        key={idx}
                        className={`${styles.occTab} ${
                          selectedOccupancyIndex === idx
                            ? styles.occTabActive
                            : ""
                        }`}
                        onClick={() => setSelectedOccupancyIndex(idx)}
                      >
                        {opt.occupancy}
                        <span>({formData.persons} members)</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.occDetails}>
                  <div className={styles.occHeader}>
                    Volvo Bus or Tempo Traveller
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="16"
                      height="16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className={styles.occRow}>
                    <div>
                      <div className={styles.occLabel}>Occupancy</div>
                      <div className={styles.occValue}>
                        {currentOption.occupancy}
                      </div>
                    </div>
                    <div>
                      <div className={styles.occLabel}>Price</div>
                      <div className={styles.occValue}>
                        {formatPrice(currentOption.price).split(".")[0]}
                      </div>
                    </div>
                    <div>
                      <div className={styles.occLabel}>Qty.</div>
                      <div className={styles.qtyControl}>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={decrementPersons}
                          disabled={formData.persons <= 1}
                        >
                          -
                        </button>
                        <span className={styles.qtyValue}>
                          {formData.persons}
                        </span>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={incrementPersons}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Traveler Details Card */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Traveler Details</h2>
              <form id="booking-form" onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Full Name</label>
                    <input
                      name="full_name"
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email Address</label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone Number</label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className={styles.formInput}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN (STICKY) */}
          <div className={styles.rightColumn}>
            <div className={`${styles.card} ${styles.sidebarSticky}`}>
              <div className={styles.amountToPay}>
                <span className={styles.amountToPayLabel}>Amount to Pay</span>
                <span className={styles.amountToPayValue}>
                  {formatPrice(grandTotal)}
                </span>
              </div>

              <div className={styles.summaryTable}>
                <div className={styles.summaryHeader}>
                  <span>Travel Mode</span>
                  <span>Rider</span>
                  <span>Occupancy</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Volvo Bus or Tempo Traveller</span>
                  <span>-</span>
                  <span>{currentOption.occupancy}</span>
                </div>
              </div>

              <div className={styles.couponsSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionTitle}>Coupons & Offers</span>
                  <span className={styles.viewAll}>View All</span>
                </div>
                <div className={styles.couponInputWrapper}>
                  <input
                    type="text"
                    placeholder="Apply Coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={styles.couponInput}
                  />
                  <button type="button" className={styles.applyBtn}>
                    &gt;
                  </button>
                </div>
              </div>

              <div className={styles.costBreakdown}>
                <div className={styles.costRow}>
                  <span>Amount</span>
                  <span>{formatPrice(amount)}</span>
                </div>
                <div className={styles.costRow}>
                  <span>GST (5%)</span>
                  <span>{formatPrice(gst)}</span>
                </div>
                <div className={styles.costRow}>
                  <span>Subtotal</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>

                <div className={styles.costTotal}>
                  <span>Amount To Pay</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="booking-form"
                className={styles.proceedBtn}
                disabled={submitting}
              >
                {submitting ? (
                  <div className={styles.spinner}></div>
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
