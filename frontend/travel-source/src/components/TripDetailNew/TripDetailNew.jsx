import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { fetchTripDetail } from "../../services/api";
import styles from "./TripDetailNew.module.css";

import ImageGallery from "./ImageGallery";
import TripInfoBar from "./TripInfoBar";
import PricingSidebar from "./PricingSidebar";
import TrustBadges from "./TrustBadges";
import ContentTabs from "./ContentTabs";
import OverviewSection from "./OverviewSection";
import ItinerarySection from "./ItinerarySection";
import InclusionsExclusions from "./InclusionsExclusions";
import CancellationPolicy from "./CancellationPolicy";
import ThingsToPack from "./ThingsToPack";
import FAQSection from "./FAQSection";

const TripDetailNew = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadTrip = async () => {
      try {
        setLoading(true);
        const data = await fetchTripDetail(id);
        setTrip(data);
      } catch (err) {
        setError(err.message || "Failed to load trip details");
      } finally {
        setLoading(false);
      }
    };
    loadTrip();
    window.scrollTo(0, 0);
  }, [id]);

  // Track which section is visible for tab highlighting
  const handleScroll = useCallback(() => {
    const sections = ["overview", "itinerary", "inclusions", "cancellation", "packing"];
    for (const sectionId of sections.reverse()) {
      const el = document.getElementById(`section-${sectionId}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 160) {
          setActiveTab(sectionId);
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ── LOADING STATE ──
  if (loading) {
    return (
      <div className={styles.loaderWrap}>
        <div className={styles.loader} />
        <p>Loading trip details...</p>
      </div>
    );
  }

  // ── ERROR STATE ──
  if (error || !trip) {
    return (
      <div className={styles.errorWrap}>
        <h2>😕 Oops!</h2>
        <p>{error || "Trip not found"}</p>
        <a href="/" className={styles.backLink}>← Back to Home</a>
      </div>
    );
  }

  // Build gallery sources: use gallery_image_urls first, fall back to main image
  const galleryImages = trip.gallery_image_urls && trip.gallery_image_urls.length > 0
    ? trip.gallery_image_urls
    : trip.image
      ? [trip.image]
      : [];

  return (
    <div className={styles.page}>
      {/* Image Gallery */}
      <ImageGallery images={galleryImages} title={trip.title} />

      <div className={styles.mainLayout}>
        {/* Left content area */}
        <div className={styles.contentCol}>
          <TripInfoBar trip={trip} />
          <TrustBadges />
          <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className={styles.sectionsWrap}>
            <OverviewSection
              overview={trip.overview || trip.description}
              highlights={trip.highlights || []}
            />
            
            <ItinerarySection itinerary={trip.itinerary || []} />
            <InclusionsExclusions
              inclusions={trip.inclusions || []}
              exclusions={trip.exclusions || []}
            />
            <CancellationPolicy policy={trip.cancellation_policy} />
            <ThingsToPack items={trip.things_to_pack || []} />
            <FAQSection faqs={trip.faqs || []} />
          </div>
        </div>

        {/* Right sticky sidebar */}
        <PricingSidebar trip={trip} />
      </div>
    </div>
  );
};

export default TripDetailNew;
