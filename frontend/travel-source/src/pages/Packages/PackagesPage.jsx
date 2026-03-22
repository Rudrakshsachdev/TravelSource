import { useState, useEffect } from 'react';
import { fetchCategories } from '../../services/api';
import { Link } from 'react-router-dom';
import { ArrowRight, Box } from 'lucide-react';
import styles from './PackagesPage.module.css';

/* ── Skeleton card for loading state ────────────────────────── */
const SkeletonCard = () => (
  <div className={styles.skelCard}>
    <div className={styles.skelShimmer} />
  </div>
);

const PackagesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    (async () => {
      try {
        const data = await fetchCategories();
        // Assume packages are essentially travel collections.
        // We can sort or filter to show only those marked as packages if needed,
        // but for now, we display all fetched categories.
        setCategories(data);
      } catch (err) {
        setError(err.message || 'Failed to load packages.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className={styles.pageContainer}>
      {/* Decorative top accent */}
      <div className={styles.topAccent} />

      <div className={styles.inner}>
        {/* Page Header */}
        <header className={styles.pageHeader}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Exclusive Collections
          </span>
          <h1 className={styles.heading}>Travel Packages</h1>
          <p className={styles.subheading}>
            Hand-crafted journeys designed for unforgettable experiences. 
            Choose your theme and start exploring.
          </p>
        </header>

        {/* Content */}
        {loading ? (
          <div className={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <h2>Oops! Something went wrong.</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryBtn}>
              Try Again
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No packages available right now.</h2>
            <p>Please check back later for new exclusive collections!</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {categories.map((category, idx) => (
              <Link 
                to={`/${category.slug}`} 
                className={styles.card} 
                key={category.slug}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                {/* Full-cover image */}
                <div className={styles.imgWrap}>
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className={styles.img}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className={styles.placeholderImgWrap}>
                      <Box size={40} opacity={0.3} color="#cbd5e1" />
                    </div>
                  )}
                </div>

                {/* Gradient layers */}
                <div className={styles.gradientTop} />
                <div className={styles.gradientBot} />

                {/* Top Badge (Emoji) */}
                {category.emoji && (
                  <span className={styles.badgeEmoji}>{category.emoji}</span>
                )}

                {/* Content Overlay */}
                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{category.name}</h3>
                  
                  <div className={styles.metaStrip}>
                    <span className={styles.metaTag}>
                      <Box size={14} /> Handpicked Experiences
                    </span>
                  </div>

                  <div className={styles.cardFoot}>
                    <span className={styles.exploreText}>Explore Trips</span>
                    <span className={styles.arrowIcon}>
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
