import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PopularDestinations.module.css';

// Mock data matching the user's provided screenshot
const topRowDestinations = [
  { id: 1, name: "Singapore", code: "SG", color: "linear-gradient(135deg, #ec4899, #be185d)", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=100&h=100&fit=crop" },
  { id: 2, name: "Maldives", code: "MV", color: "linear-gradient(135deg, #0ea5e9, #0369a1)", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=100&h=100&fit=crop" },
  { id: 3, name: "Japan", code: "JP", color: "linear-gradient(135deg, #ef4444, #b91c1c)", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=100&h=100&fit=crop" },
  { id: 4, name: "Switzerland", code: "CH", color: "linear-gradient(135deg, #3b82f6, #1d4ed8)", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=100&h=100&fit=crop" },
  { id: 5, name: "Iceland", code: "IS", color: "linear-gradient(135deg, #06b6d4, #0e7490)", image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=100&h=100&fit=crop" },
  { id: 6, name: "Greece", code: "GR", color: "linear-gradient(135deg, #6366f1, #4338ca)", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=100&h=100&fit=crop" },
  { id: 7, name: "USA", code: "US", color: "linear-gradient(135deg, #4f46e5, #3730a3)", image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=100&h=100&fit=crop" },
  { id: 8, name: "Canada", code: "CA", color: "linear-gradient(135deg, #dc2626, #991b1b)", image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=100&h=100&fit=crop" },
  { id: 17, name: "Australia", code: "AU", color: "linear-gradient(135deg, #0f766e, #134e4a)", image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=100&h=100&fit=crop" },
  { id: 18, name: "Turkey", code: "TR", color: "linear-gradient(135deg, #be123c, #881337)", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=100&h=100&fit=crop" },
  { id: 19, name: "Italy", code: "IT", color: "linear-gradient(135deg, #15803d, #14532d)", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=100&h=100&fit=crop" },
  { id: 20, name: "France", code: "FR", color: "linear-gradient(135deg, #1d4ed8, #1e3a8a)", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100&h=100&fit=crop" }
];

const bottomRowDestinations = [
  { id: 9, name: "New Zealand", code: "NZ", color: "linear-gradient(135deg, #10b981, #047857)", image: "https://images.unsplash.com/photo-1469521669194-babbdf9aa9b9?w=100&h=100&fit=crop" },
  { id: 10, name: "Sri Lanka", code: "LK", color: "linear-gradient(135deg, #059669, #064e3b)", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=100&h=100&fit=crop" },
  { id: 11, name: "Cambodia", code: "KH", color: "linear-gradient(135deg, #8b5cf6, #6d28d9)", image: "https://images.unsplash.com/photo-1600100397608-f010f4cc4d63?w=100&h=100&fit=crop" },
  { id: 12, name: "Morocco", code: "MA", color: "linear-gradient(135deg, #f97316, #c2410c)", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=100&h=100&fit=crop" },
  { id: 13, name: "Kerala", code: "IN", color: "linear-gradient(135deg, #22c55e, #15803d)", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=100&h=100&fit=crop" },
  { id: 14, name: "Kashmir", code: "IN", color: "linear-gradient(135deg, #a855f7, #7e22ce)", image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=100&h=100&fit=crop" },
  { id: 15, name: "Rajasthan", code: "IN", color: "linear-gradient(135deg, #ea580c, #9a3412)", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=100&h=100&fit=crop" },
  { id: 16, name: "Ladakh", code: "IN", color: "linear-gradient(135deg, #0284c7, #0369a1)", image: "https://images.unsplash.com/photo-1626014435965-f463c6c06a09?w=100&h=100&fit=crop" },
  { id: 21, name: "Bali", code: "ID", color: "linear-gradient(135deg, #14b8a6, #0d9488)", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100&h=100&fit=crop" },
  { id: 22, name: "Egypt", code: "EG", color: "linear-gradient(135deg, #ca8a04, #a16207)", image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9688?w=100&h=100&fit=crop" },
  { id: 23, name: "Thailand", code: "TH", color: "linear-gradient(135deg, #ef4444, #991b1b)", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=100&h=100&fit=crop" },
  { id: 24, name: "Dubai", code: "AE", color: "linear-gradient(135deg, #b45309, #78350f)", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100&h=100&fit=crop" }
];

export const PopularDestinations = () => {
  const navigate = useNavigate();

  const handleChipClick = (destName) => {
    // Navigate to trips list filtered by this destination. Adjust route as needed.
    navigate(`/trips`);
  };

  const DestinationChip = ({ dest }) => (
    <div 
      className={styles.chip} 
      style={{ background: dest.color }}
      onClick={() => handleChipClick(dest.name)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleChipClick(dest.name)}
    >
      <div className={styles.chipImgWrapper}>
        <img src={dest.image} alt={dest.name} className={styles.chipImg} loading="lazy" />
      </div>
      <span className={styles.chipCode}>{dest.code}</span>
      <span className={styles.chipName}>{dest.name}</span>
    </div>
  );

  return (
    <section className={styles.section}>
      <div className={styles.subHeading}>POPULAR DESTINATIONS</div>
      <h2 className={styles.heading}>
        Explore <span className={styles.headingHighlight}>500+</span> Destinations Worldwide
      </h2>
      <p className={styles.description}>
        Click on any destination to discover amazing holiday packages
      </p>

      <div className={styles.marqueeContainer}>
        {/* Top Row - Scrolls Left */}
        <div className={styles.marqueeRow}>
          <div className={styles.marqueeTrack}>
            {/* We duplicate the array to create a seamless infinite loop */}
            {[...topRowDestinations, ...topRowDestinations].map((dest, index) => (
              <DestinationChip key={`${dest.id}-${index}`} dest={dest} />
            ))}
          </div>
        </div>

        {/* Bottom Row - Scrolls Right */}
        <div className={styles.marqueeRow}>
          <div className={`${styles.marqueeTrack} ${styles.reverse}`}>
            {[...bottomRowDestinations, ...bottomRowDestinations].map((dest, index) => (
              <DestinationChip key={`${dest.id}-${index}`} dest={dest} />
            ))}
          </div>
        </div>
      </div>

      <button className={styles.viewAllBtn} onClick={() => navigate('/trips')}>
        View All Holiday Packages
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </section>
  );
};
