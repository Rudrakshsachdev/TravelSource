import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { INTEREST_OPTIONS } from "../../hooks/usePersonalization";
import styles from "./PersonalizationSection.module.css";

/* ─── Mini Trip Card (horizontal scroll row) ─────────────────────────────── */
const MiniCard = ({ trip, onView }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onView(trip.id);
    navigate(`/trips/${trip.id}`);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className={styles.miniCard} onClick={handleClick}>
      <div className={styles.miniCardImage}>
        {trip.image ? (
          <img src={trip.image} alt={trip.title} loading="lazy" />
        ) : (
          <div className={styles.miniCardPlaceholder}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <ellipse
                cx="12"
                cy="12"
                rx="3.5"
                ry="9"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M3 12H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
        <div className={styles.miniCardOverlay}></div>
        <div className={styles.miniCardPrice}>{formatPrice(trip.price)}</div>
      </div>
      <div className={styles.miniCardViewPill}>View Trip →</div>
      <div className={styles.miniCardBody}>
        <p className={styles.miniCardLocation}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              fill="currentColor"
            />
          </svg>
          {trip.location}
        </p>
        <h4 className={styles.miniCardTitle}>{trip.title}</h4>
        <div className={styles.miniCardFooter}>
          <span className={styles.miniCardDuration}>
            {trip.duration_days} {trip.duration_days === 1 ? "day" : "days"}
          </span>
          <span className={styles.miniCardArrow}>
            <svg
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6H10M10 6L7 3M10 6L7 9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─── Horizontal Scrollable Row ──────────────────────────────────────────── */
const TripRow = ({ trips, onView, loading }) => {
  if (loading) {
    return (
      <div className={styles.rowScroll}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`${styles.miniCard} ${styles.miniCardSkeleton}`}
          />
        ))}
      </div>
    );
  }

  if (!trips.length) {
    return (
      <div className={styles.rowEmpty}>
        <p>Nothing to show yet — start exploring trips above!</p>
      </div>
    );
  }

  return (
    <div className={styles.rowScroll}>
      {trips.map((trip) => (
        <MiniCard key={trip.id} trip={trip} onView={onView} />
      ))}
    </div>
  );
};

/* ─── Interests Picker ───────────────────────────────────────────────────── */
const InterestsPicker = ({ selected, onChange }) => {
  const [draft, setDraft] = useState(selected);

  const toggle = (id) => {
    setDraft((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSave = () => onChange(draft);

  return (
    <div className={styles.interestsPicker}>
      <div className={styles.interestsGrid}>
        {INTEREST_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            className={`${styles.interestChip} ${
              draft.includes(opt.id) ? styles.interestChipActive : ""
            }`}
            onClick={() => toggle(opt.id)}
            type="button"
          >
            <span className={styles.interestIcon}>{opt.icon}</span>
            <span>{opt.label}</span>
            {draft.includes(opt.id) && (
              <span className={styles.interestCheck}>
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
      {draft.length > 0 && (
        <button className={styles.saveInterestsBtn} onClick={handleSave}>
          <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 10H16M16 10L11 5M16 10L11 15"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Save My Interests &amp; Personalise
        </button>
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const PersonalizationSection = ({
  interests,
  setInterests,
  recommended,
  recentlyViewed,
  loadingRec,
  recordView,
}) => {
  const [editingInterests, setEditingInterests] = useState(false);
  const showInterestsPicker = interests.length === 0 || editingInterests;

  const handleSaveInterests = (next) => {
    setInterests(next);
    setEditingInterests(false);
  };

  return (
    <section className={styles.personalizationSection}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.headerOrb1} />
        <div className={styles.headerOrb2} />
        <div className={styles.headerOrb3} />
        <div className={styles.sectionEyebrow}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
              fill="currentColor"
            />
          </svg>
          <span>Personalised For You</span>
        </div>
        <h2 className={styles.sectionTitle}>
          Your Travel <span className={styles.sectionTitleAccent}>Profile</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Tell us what moves you — we&apos;ll curate the perfect journeys.
        </p>
      </div>

      {/* Interests picker / active interests */}
      <div className={styles.interestsBlock}>
        <div className={styles.interestsBlockHeader}>
          <h3>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
            Your Travel Interests
          </h3>
          {interests.length > 0 && !editingInterests && (
            <button
              className={styles.editBtn}
              onClick={() => setEditingInterests(true)}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5 2.5L13.5 4.5M2 14l3-1L12.5 5.5 10.5 3.5 3 11l-1 3z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit
            </button>
          )}
        </div>

        {showInterestsPicker ? (
          <InterestsPicker
            selected={interests}
            onChange={handleSaveInterests}
          />
        ) : (
          <div className={styles.activeInterests}>
            {interests.map((id) => {
              const opt = INTEREST_OPTIONS.find((o) => o.id === id);
              return opt ? (
                <span key={id} className={styles.activeInterestChip}>
                  <span>{opt.icon}</span>
                  {opt.label}
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Recommended For You */}
      <div className={styles.rowBlock}>
        <div className={styles.rowHeader}>
          <div className={styles.rowHeaderLeft}>
            <div className={styles.rowDot}></div>
            <h3>Recommended for You</h3>
            <span className={styles.rowBadge}>
              {interests.length > 0
                ? "Based on your interests"
                : "Popular picks"}
            </span>
          </div>
        </div>
        <TripRow trips={recommended} onView={recordView} loading={loadingRec} />
      </div>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className={styles.rowBlock}>
          <div className={styles.rowHeader}>
            <div className={styles.rowHeaderLeft}>
              <div
                className={`${styles.rowDot} ${styles.rowDotSecondary}`}
              ></div>
              <h3>Recently Viewed</h3>
              <span className={styles.rowBadge}>Your browsing history</span>
            </div>
          </div>
          <TripRow trips={recentlyViewed} onView={recordView} loading={false} />
        </div>
      )}
    </section>
  );
};

export default PersonalizationSection;
