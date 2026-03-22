import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchTrips, fetchCategories } from "../../services/api";
import styles from "./CategoryTripsPage.module.css";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Filter,
  LayoutGrid,
  List,
  Sparkles,
  ArrowLeft
} from "lucide-react";

/**
 * CategoryTripsPage: Dynamic page for /himachal-trips, /kerala-trips, etc.
 */
const CategoryTripsPage = () => {
  const { categorySlug } = useParams();
  const [trips, setTrips] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 1. Fetch this specific category metadata
        const allCategories = await fetchCategories();
        const currentCat = allCategories.find(c => c.slug === categorySlug);
        setCategory(currentCat);

        // 2. Fetch trips for this category
        const tripsData = await fetchTrips(categorySlug);
        setTrips(tripsData);
      } catch (err) {
        console.error("Failed to load category trips:", err);
        setError("Could not load trips for this category.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    window.scrollTo(0, 0);
  }, [categorySlug]);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Fetching amazing trips for you...</p>
      </div>
    );
  }

  if (!category && !loading) {
    return (
      <div className={styles.errorWrapper}>
        <h2>Category Not Found</h2>
        <p>Sorry, we couldn't find the travel package you're looking for.</p>
        <Link to="/packages" className={styles.backButton}>View All Packages</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Category Hero */}
      <section
        className={styles.hero}
        style={{
          '--grad-start': category.grad_start || '#3b82f6',
          '--grad-end': category.grad_end || '#1d4ed8',
        }}
      >
        {category.image && (
          <img
            src={category.image}
            alt={category.name}
            className={styles.heroBg}
          />
        )}
        <div className={styles.heroOverlay} />
        <div className={styles.heroGlowOne} aria-hidden="true" />
        <div className={styles.heroGlowTwo} aria-hidden="true" />
        <div className={styles.heroNoise} aria-hidden="true" />

        <div className={styles.heroContent}>
          <Link to="/packages" className={styles.breadcrumb}>
            <ArrowLeft size={16} />
            All Packages
          </Link>
          <div className={styles.catInfo}>
            <span className={styles.catEmoji}>{category?.emoji || "🌍"}</span>
            <h1 className={styles.title}>{category?.name}</h1>
          </div>
          <p className={styles.tripCount}>{trips.length} Handpicked Experiences</p>
        </div>
      </section>

      {/* Trips Grid */}
      <section className={styles.content}>
        <div className={styles.container}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.tripsGrid}>
            {trips.map((trip) => (
              <Link
                key={trip.id}
                to={`/trips/${trip.id}`}
                className={styles.tripCard}
              >
                <div className={styles.imageContainer}>
                  <img src={trip.image} alt={trip.title} className={styles.tripImage} />
                  <div className={styles.priceTag}>
                    From ₹{trip.price.toLocaleString()}
                  </div>
                  {trip.is_featured && (
                    <div className={styles.featureBadge}>
                      <Sparkles size={12} />
                      Featured
                    </div>
                  )}
                </div>

                <div className={styles.tripDetails}>
                  <div className={styles.tripLocation}>
                    <MapPin size={14} />
                    <span>{trip.location}</span>
                  </div>
                  <h3 className={styles.tripTitle}>{trip.title}</h3>

                  <div className={styles.metaInfo}>
                    <div className={styles.metaItem}>
                      <Clock size={14} />
                      <span>{trip.duration_days}D/{trip.duration_nights}N</span>
                    </div>
                    {trip.state && (
                      <div className={styles.metaItem}>
                        <MapPin size={14} />
                        <span>{trip.state}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.tripFooter}>
                    <span className={styles.viewLink}>View Details</span>
                    <ChevronRight size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {trips.length === 0 && (
            <div className={styles.emptyState}>
              <h3>No Trips Found</h3>
              <p>We're currently adding new trips to this category. Check back soon!</p>
              <Link to="/packages" className={styles.backButton}>Explore Other Packages</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryTripsPage;
