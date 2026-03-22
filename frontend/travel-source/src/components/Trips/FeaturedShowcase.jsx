import { useNavigate } from "react-router-dom";
import styles from "./FeaturedShowcase.module.css";

/* ═══════════════════════════════════════════════════════════════
   FeaturedShowcase — Travel Stats + Featured Destination Cards
   ═══════════════════════════════════════════════════════════════ */

const TravelStats = () => (
  <div className={styles.travelStatsSection}>
    <div className={styles.statsGrid}>
      <div className={styles.statItem}>
        <div className={styles.statIconWrap}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9 16.1 17 15 17H9C7.9 17 7 17.9 7 19V21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="1.6" />
            <path d="M23 21V19C23 18 22.3 17.1 21 16.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 3.1C17.3 3.5 18 4.4 18 5.5C18 6.6 17.3 7.5 16 7.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className={styles.statNumber}>10,000+</div>
        <div className={styles.statLabel}>Happy Travelers</div>
      </div>
      <div className={styles.statDivider}></div>
      <div className={styles.statItem}>
        <div className={styles.statIconWrap}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.4 8.3H21.2L15.9 12.1L17.9 18.4L12 14.6L6.1 18.4L8.1 12.1L2.8 8.3H9.6L12 2Z" fill="currentColor" />
          </svg>
        </div>
        <div className={styles.statNumber}>4.9</div>
        <div className={styles.statLabel}>Average Rating</div>
      </div>
      <div className={styles.statDivider}></div>
      <div className={styles.statItem}>
        <div className={styles.statIconWrap}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <div className={styles.statNumber}>120+</div>
        <div className={styles.statLabel}>Curated Trips</div>
      </div>
      <div className={styles.statDivider}></div>
      <div className={styles.statItem}>
        <div className={styles.statIconWrap}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <ellipse cx="12" cy="12" rx="3.5" ry="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3 12H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M4.5 7.5C7 8.5 10 9 12 9C14 9 17 8.5 19.5 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M4.5 16.5C7 15.5 10 15 12 15C14 15 17 15.5 19.5 16.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>
        <div className={styles.statNumber}>25</div>
        <div className={styles.statLabel}>Countries Covered</div>
      </div>
    </div>
  </div>
);

const FeaturedCard = ({ trip, idx }) => {
  const navigate = useNavigate();

  const eyebrows = ["Featured This Month", "Editor\u2019s Pick", "Signature Journey"];
  const eyebrow = eyebrows[idx % eyebrows.length];

  const words = trip.title.split(" ");
  const titleMain = words.length > 1 ? words.slice(0, -1).join(" ") : words[0];
  const titleAccent = words.length > 1 ? words[words.length - 1] : "";

  const isAlt = idx % 2 === 1;
  const chips = trip.featured_highlights || [];

  const contentPanel = (
    <div className={styles.featuredContent} key={`content-${trip.id}`}>
      <div className={styles.featuredEyebrow}>
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l2.09 6.43H21l-5.47 3.97 2.09 6.43L12 14.86l-5.62 3.97 2.09-6.43L3 8.43h6.91L12 2z" />
        </svg>
        <span>{eyebrow}</span>
      </div>

      <h2 className={styles.featuredTitle}>
        {titleMain}{" "}
        {titleAccent && <span className={styles.featuredTitleAccent}>{titleAccent}</span>}
      </h2>

      <p className={styles.featuredDescription}>
        {trip.description
          ? trip.description.length > 280
            ? trip.description.slice(0, 280) + "\u2026"
            : trip.description
          : trip.short_description || "Explore this handpicked journey curated by our travel experts."}
      </p>

      <div className={styles.featuredTags}>
        <span className={styles.featuredTag}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {trip.duration_days} Days{trip.duration_nights > 0 ? " / " + trip.duration_nights + " Nights" : ""}
        </span>
        <span className={styles.featuredTag}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {trip.country || trip.location}
        </span>
        <span className={styles.featuredTag}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.4 8.3H21.2L15.9 12.1L17.9 18.4L12 14.6L6.1 18.4L8.1 12.1L2.8 8.3H9.6L12 2Z" fill="currentColor" />
          </svg>
          4.9 Rated
        </span>
      </div>

      <button className={styles.featuredCTA} onClick={() => navigate(`/trips/${trip.id}`)}>
        <span>View Details</span>
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );

  const visualPanel = (
    <div className={`${styles.featuredVisual}${isAlt ? " " + styles.featuredVisualSantorini : ""}`} key={`visual-${trip.id}`}>
      <div className={styles.featuredVisualGlow}></div>
      {[220, 320, 420].map((size, ri) => (
        <div
          key={ri}
          className={styles.featuredRing}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            opacity: ri === 0 ? undefined : ri === 1 ? "0.35" : "0.18",
          }}
        ></div>
      ))}
      <div className={styles.featuredPin}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" />
        </svg>
      </div>
      {chips[0] && (
        <div className={`${styles.featuredChip} ${styles.featuredChipTop}`}>
          <span className={styles.featuredChipDot}></span>
          <span>{chips[0]}</span>
        </div>
      )}
      {chips[1] && (
        <div className={`${styles.featuredChip} ${styles.featuredChipBottom}`}>
          <span className={styles.featuredChipDot}></span>
          <span>{chips[1]}</span>
        </div>
      )}
      {chips[2] && (
        <div className={`${styles.featuredChip} ${styles.featuredChipLeft}`}>
          <span className={styles.featuredChipDot}></span>
          <span>{chips[2]}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className={`${styles.featuredDestination}${isAlt ? " " + styles.featuredDestinationAlt : ""}`}>
      {isAlt ? (
        <>{visualPanel}{contentPanel}</>
      ) : (
        <>{contentPanel}{visualPanel}</>
      )}
    </div>
  );
};

const FeaturedShowcase = ({ featuredTrips, featuredLoading }) => (
  <>
    <TravelStats />

    {featuredLoading ? (
      <div
        className={styles.featuredDestination}
        style={{ justifyContent: "center", alignItems: "center", minHeight: 200, opacity: 0.5 }}
      >
        <p>Loading featured destinations…</p>
      </div>
    ) : featuredTrips.length > 0 ? (
      featuredTrips.map((trip, idx) => <FeaturedCard key={trip.id} trip={trip} idx={idx} />)
    ) : null}
  </>
);

export default FeaturedShowcase;
