import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTripDetail, createBooking } from "../../services/api";
import { getAuthData } from "../../utils/auth";
import styles from "./BookingPage.module.css";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    persons: 1,
  });

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
    setFormData({
      ...formData,
      [name]:
        name === "persons" ? Math.max(1, parseInt(value, 10) || 1) : value,
    });
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

  const totalAmount = trip ? trip.price * formData.persons : 0;
  const serviceFee = 500;
  const grandTotal = totalAmount + serviceFee;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
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

  return (
    <div className={styles.pageWrapper}>
      {/* Background decoration */}
      <div className={styles.bgDecoration}></div>
      <div className={styles.bgDecoration2}></div>

      <div className={styles.container}>
        {/* Back Navigation */}
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
          Back to Trip
        </button>

        <div className={styles.bookingLayout}>
          {/* Left: Trip Summary Card */}
          <div className={styles.tripSummaryCard}>
            <div className={styles.tripImageWrapper}>
              <img
                src={trip.image}
                alt={trip.title}
                className={styles.tripImage}
              />
              <div className={styles.tripImageOverlay}></div>
              <div className={styles.tripBadge}>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="14"
                  height="14"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Premium Trip
              </div>
            </div>

            <div className={styles.tripDetails}>
              <h2 className={styles.tripTitle}>{trip.title}</h2>

              <div className={styles.tripMeta}>
                {trip.duration && (
                  <div className={styles.metaItem}>
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="16"
                      height="16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{trip.duration}</span>
                  </div>
                )}

                {trip.location && (
                  <div className={styles.metaItem}>
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="16"
                      height="16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{trip.location}</span>
                  </div>
                )}
              </div>

              <div className={styles.pricePerPerson}>
                <span className={styles.priceLabel}>Price per person</span>
                <span className={styles.priceValue}>
                  {formatPrice(trip.price)}
                </span>
              </div>
            </div>

            {/* Guarantees */}
            <div className={styles.guarantees}>
              <div className={styles.guaranteeItem}>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="16"
                  height="16"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Best Price Guarantee</span>
              </div>
              <div className={styles.guaranteeItem}>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="16"
                  height="16"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Flexible Cancellation</span>
              </div>
              <div className={styles.guaranteeItem}>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="16"
                  height="16"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className={styles.bookingFormCard}>
            <div className={styles.formHeader}>
              <h1 className={styles.formTitle}>Book Your Trip</h1>
              <p className={styles.formSubtitle}>
                Fill in your details to reserve your spot
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="full_name">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="16"
                    height="16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Full Name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="16"
                    height="16"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="phone">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="16"
                    height="16"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="16"
                    height="16"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Number of Travelers
                </label>
                <div className={styles.personsSelector}>
                  <button
                    type="button"
                    className={styles.personBtn}
                    onClick={decrementPersons}
                    disabled={formData.persons <= 1}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="16"
                      height="16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <span className={styles.personsCount}>
                    {formData.persons}
                  </span>
                  <button
                    type="button"
                    className={styles.personBtn}
                    onClick={incrementPersons}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="16"
                      height="16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className={styles.priceBreakdown}>
                <div className={styles.breakdownRow}>
                  <span>
                    {formatPrice(trip.price)} × {formData.persons} traveler
                    {formData.persons > 1 ? "s" : ""}
                  </span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className={styles.breakdownRow}>
                  <span>Service fee</span>
                  <span>{formatPrice(serviceFee)}</span>
                </div>
                <div className={styles.breakdownDivider}></div>
                <div className={styles.breakdownTotal}>
                  <span>Total Amount</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className={styles.buttonSpinner}></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="18"
                      height="18"
                    >
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Proceed to Payment
                  </>
                )}
              </button>

              <p className={styles.secureNote}>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="14"
                  height="14"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Your payment information is secure and encrypted
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
