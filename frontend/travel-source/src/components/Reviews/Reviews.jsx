import { useEffect, useState } from "react";
import styles from "./Reviews.module.css";
import { fetchReviews, submitReview } from "../../services/api";

const SEED_REVIEWS = [
  {
    name: "Aman Verma",
    country: "India",
    rating: 5,
    review:
      "The Ladakh trip was extremely well planned. Great stays, helpful coordinators, and smooth travel throughout.",
    trip: "Ladakh Adventure",
    date: "2 weeks ago",
    avatar: "AV",
  },
  {
    name: "Ritika Sharma",
    country: "India",
    rating: 5,
    review:
      "I was traveling solo but never felt alone. The group, the guide, everything was perfect.",
    trip: "Spiti Valley Trek",
    date: "1 month ago",
    avatar: "RS",
  },
  {
    name: "Karan Malhotra",
    country: "India",
    rating: 4,
    review:
      "Very professional team. Transparent pricing and amazing itinerary.",
    trip: "Kashmir Winter Tour",
    date: "3 weeks ago",
    avatar: "KM",
  },
  {
    name: "Emily Carter",
    country: "UK",
    rating: 5,
    review:
      "One of the best travel experiences I've had in India. Everything was organized perfectly.",
    trip: "Golden Triangle",
    date: "2 months ago",
    avatar: "EC",
  },
  {
    name: "Daniel Müller",
    country: "Germany",
    rating: 5,
    review:
      "Fantastic experience! The local knowledge made the trip truly special.",
    trip: "Himalayan Trek",
    date: "1 month ago",
    avatar: "DM",
  },
  {
    name: "Sarah Johnson",
    country: "USA",
    rating: 4,
    review:
      "Safe, fun, and well managed. Loved the overall experience with Travel Professor.",
    trip: "Kerala Backwaters",
    date: "6 weeks ago",
    avatar: "SJ",
  },
  {
    name: "Raj Patel",
    country: "India",
    rating: 5,
    review:
      "Exceptional service from start to finish. Will definitely travel with them again!",
    trip: "Goa Beach Vacation",
    date: "3 weeks ago",
    avatar: "RP",
  },
  {
    name: "Priya Desai",
    country: "India",
    rating: 4,
    review:
      "Great attention to detail and amazing local guides. Made our trip memorable.",
    trip: "Rajasthan Heritage",
    date: "1 month ago",
    avatar: "PD",
  },
  {
    name: "Rudraksh Sachdeva",
    country: "India",
    rating: 4,
    review:
      "The trip was well organized and the guides were very helpful. Would recommend to anyone.",
    trip: "Himalayan Trek",
    date: "2 weeks ago",
    avatar: "RS",
  },
];

// ─── Review Modal ────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: "",
  country: "India",
  trip: "",
  rating: 0,
  review: "",
};

const ReviewModal = ({ onClose, onSubmitted }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.trip.trim()) e.trip = "Trip name is required";
    if (!form.rating) e.rating = "Please select a rating";
    if (!form.review.trim()) e.review = "Review text is required";
    return e;
  };

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleStarClick = (star) =>
    setForm((prev) => ({ ...prev, rating: star }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const created = await submitReview(form);
      setSubmitDone(true);
      onSubmitted(created);
      setTimeout(onClose, 1800);
    } catch {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Write a Review"
      >
        {submitDone ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className={styles.successTitle}>Thank You!</h3>
            <p className={styles.successText}>Your review has been added.</p>
          </div>
        ) : (
          <>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Write a Review</h3>
              <button
                className={styles.modalClose}
                onClick={onClose}
                aria-label="Close"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="18"
                  height="18"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.modalRow}>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Your Name *</label>
                  <input
                    className={`${styles.modalInput} ${errors.name ? styles.inputError : ""}`}
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="e.g. Aman Verma"
                  />
                  {errors.name && (
                    <span className={styles.fieldError}>{errors.name}</span>
                  )}
                </div>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Country</label>
                  <input
                    className={styles.modalInput}
                    value={form.country}
                    onChange={handleChange("country")}
                    placeholder="India"
                  />
                </div>
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Trip Name *</label>
                <input
                  className={`${styles.modalInput} ${errors.trip ? styles.inputError : ""}`}
                  value={form.trip}
                  onChange={handleChange("trip")}
                  placeholder="e.g. Ladakh Adventure"
                />
                {errors.trip && (
                  <span className={styles.fieldError}>{errors.trip}</span>
                )}
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Rating *</label>
                <div className={styles.starPicker}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`${styles.starBtn} ${star <= form.rating ? styles.starBtnFilled : ""}`}
                      onClick={() => handleStarClick(star)}
                      aria-label={`${star} star`}
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
                {errors.rating && (
                  <span className={styles.fieldError}>{errors.rating}</span>
                )}
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Your Review *</label>
                <textarea
                  className={`${styles.modalTextarea} ${errors.review ? styles.inputError : ""}`}
                  value={form.review}
                  onChange={handleChange("review")}
                  placeholder="Share your experience…"
                  rows={4}
                />
                {errors.review && (
                  <span className={styles.fieldError}>{errors.review}</span>
                )}
              </div>

              {errors.submit && (
                <p className={styles.submitErrorMsg}>{errors.submit}</p>
              )}

              <button
                type="submit"
                className={styles.modalSubmitBtn}
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Reviews = () => {
  const [allReviews, setAllReviews] = useState(SEED_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const totalReviews = allReviews.length;

  // Fetch live reviews on mount and prepend to seed
  useEffect(() => {
    fetchReviews()
      .then((data) => {
        if (data.length > 0) setAllReviews([...data, ...SEED_REVIEWS]);
      })
      .catch(() => {}); // silently fall back to seed data
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalReviews);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, totalReviews]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalReviews);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const getRatingStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <svg
          key={i}
          className={i < rating ? styles.starFilled : styles.starEmpty}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ));
  };

  return (
    <section className={styles.reviewsSection}>
      {/* Background Overlay */}
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <div className={styles.subHeading}>
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="13"
                height="13"
              >
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
              </svg>
              Client Reviews
            </div>
            <h2 className={styles.heading}>
              What Our Travelers{" "}
              <span className={styles.headingAccent}>Say</span>
            </h2>
            <p className={styles.subtitle}>
              Real experiences from travelers who explored India with us
            </p>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>
                {allReviews.length
                  ? (
                      allReviews.reduce((s, r) => s + r.rating, 0) /
                      allReviews.length
                    ).toFixed(1)
                  : "—"}
              </div>
              <div className={styles.statLabel}>Average Rating</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{allReviews.length}+</div>
              <div className={styles.statLabel}>Happy Travelers</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>Recommended</div>
            </div>
          </div>
        </div>

        {/* Desktop Marquee View */}
        <div className={styles.desktopView}>
          <div className={styles.marqueeWrapper}>
            <div
              className={`${styles.marquee} ${isPaused ? styles.paused : ""}`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className={styles.track}>
                {[...allReviews, ...allReviews].map((item, index) => (
                  <div className={styles.reviewCard} key={index}>
                    <div className={styles.cardHeader}>
                      <div className={styles.userInfo}>
                        <div className={styles.avatar}>{item.avatar}</div>
                        <div>
                          <h4 className={styles.userName}>{item.name}</h4>
                          <div className={styles.userMeta}>
                            <span className={styles.country}>
                              <svg
                                className={styles.flagIcon}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {item.country}
                            </span>
                            <span className={styles.date}>{item.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.rating}>
                        {getRatingStars(item.rating)}
                      </div>
                    </div>

                    <div className={styles.tripBadge}>
                      <svg
                        className={styles.tripIcon}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item.trip}
                    </div>

                    <p className={styles.reviewText}>
                      <svg
                        className={styles.quoteIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M10 11H6C5.44772 11 5 10.5523 5 10V6C5 5.44772 5.44772 5 6 5H10C10.5523 5 11 5.44772 11 6V10C11 10.5523 10.5523 11 10 11Z"
                          fill="currentColor"
                        />
                        <path
                          d="M19 11H15C14.4477 11 14 10.5523 14 10V6C14 5.44772 14.4477 5 15 5H19C19.5523 5 20 5.44772 20 6V10C20 10.5523 19.5523 11 19 11Z"
                          fill="currentColor"
                        />
                        <path
                          d="M6 19H10C10.5523 19 11 18.5523 11 18V14C11 13.4477 10.5523 13 10 13H6C5.44772 13 5 13.4477 5 14V18C5 18.5523 5.44772 19 6 19Z"
                          fill="currentColor"
                        />
                        <path
                          d="M15 19H19C19.5523 19 20 18.5523 20 18V14C20 13.4477 19.5523 13 19 13H15C14.4477 13 14 13.4477 14 14V18C14 18.5523 14.4477 19 15 19Z"
                          fill="currentColor"
                        />
                      </svg>
                      {item.review}
                    </p>

                    <div className={styles.cardFooter}>
                      <button className={styles.likeButton}>
                        <svg
                          className={styles.likeIcon}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Helpful
                      </button>
                      <button className={styles.shareButton}>
                        <svg
                          className={styles.shareIcon}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Carousel View */}
        <div className={styles.mobileView}>
          <div className={styles.carousel}>
            <div
              className={styles.carouselInner}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {allReviews.map((item, index) => (
                <div className={styles.carouselItem} key={index}>
                  <div className={styles.reviewCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.userInfo}>
                        <div className={styles.avatar}>{item.avatar}</div>
                        <div>
                          <h4 className={styles.userName}>{item.name}</h4>
                          <div className={styles.userMeta}>
                            <span className={styles.country}>
                              <svg
                                className={styles.flagIcon}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {item.country}
                            </span>
                            <span className={styles.date}>{item.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.rating}>
                        {getRatingStars(item.rating)}
                      </div>
                    </div>

                    <div className={styles.tripBadge}>
                      <svg
                        className={styles.tripIcon}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item.trip}
                    </div>

                    <p className={styles.reviewText}>
                      <svg
                        className={styles.quoteIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M10 11H6C5.44772 11 5 10.5523 5 10V6C5 5.44772 5.44772 5 6 5H10C10.5523 5 11 5.44772 11 6V10C11 10.5523 10.5523 11 10 11Z"
                          fill="currentColor"
                        />
                        <path
                          d="M19 11H15C14.4477 11 14 10.5523 14 10V6C14 5.44772 14.4477 5 15 5H19C19.5523 5 20 5.44772 20 6V10C20 10.5523 19.5523 11 19 11Z"
                          fill="currentColor"
                        />
                        <path
                          d="M6 19H10C10.5523 19 11 18.5523 11 18V14C11 13.4477 10.5523 13 10 13H6C5.44772 13 5 13.4477 5 14V18C5 18.5523 5.44772 19 6 19Z"
                          fill="currentColor"
                        />
                        <path
                          d="M15 19H19C19.5523 19 20 18.5523 20 18V14C20 13.4477 19.5523 13 19 13H15C14.4477 13 14 13.4477 14 14V18C14 18.5523 14.4477 19 15 19Z"
                          fill="currentColor"
                        />
                      </svg>
                      {item.review}
                    </p>

                    <div className={styles.cardFooter}>
                      <button className={styles.likeButton}>
                        <svg
                          className={styles.likeIcon}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Helpful
                      </button>
                      <button className={styles.shareButton}>
                        <svg
                          className={styles.shareIcon}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.carouselControls}>
              <button
                className={styles.controlButton}
                onClick={handlePrev}
                aria-label="Previous review"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div className={styles.dots}>
                {allReviews.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ""}`}
                    onClick={() => handleDotClick(index)}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>

              <button
                className={styles.controlButton}
                onClick={handleNext}
                aria-label="Next review"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Write a Review Modal */}
        {modalOpen && (
          <ReviewModal
            onClose={() => setModalOpen(false)}
            onSubmitted={(newReview) => {
              setAllReviews((prev) => [newReview, ...prev]);
            }}
          />
        )}

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>Share Your Experience</h3>
            <p className={styles.ctaText}>
              Have you traveled with Travel Professor? We'd love to hear about
              your journey!
            </p>
            <button
              className={styles.ctaButton}
              onClick={() => setModalOpen(true)}
            >
              <svg
                className={styles.ctaIcon}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              Write a Review
            </button>
          </div>

          <div className={styles.ratingSummary}>
            <div className={styles.ratingHeader}>
              <div className={styles.ratingScore}>
                {allReviews.length
                  ? (
                      allReviews.reduce((s, r) => s + r.rating, 0) /
                      allReviews.length
                    ).toFixed(1)
                  : "—"}
              </div>
              <div className={styles.ratingStars}>
                {getRatingStars(5)}
                <span className={styles.ratingCount}>
                  ({allReviews.length} reviews)
                </span>
              </div>
            </div>

            <div className={styles.ratingBars}>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = allReviews.filter(
                  (r) => r.rating === stars,
                ).length;
                const percentage = (count / allReviews.length) * 100;

                return (
                  <div key={stars} className={styles.ratingBar}>
                    <span className={styles.barLabel}>
                      {stars} star{stars !== 1 ? "s" : ""}
                    </span>
                    <div className={styles.barContainer}>
                      <div
                        className={styles.barFill}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className={styles.barCount}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
