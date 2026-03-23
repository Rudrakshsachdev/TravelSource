import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { fetchTripGalleryImages } from "../../services/api";
import styles from "./GalleryModal.module.css";
// Optional: a lightweight masonry layout library could be used here, but we'll use CSS columns for simplicity

export default function GalleryModal({ trip, onClose }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    if (!trip) return;
    
    let isMounted = true;
    const loadImages = async () => {
      try {
        setLoading(true);
        const data = await fetchTripGalleryImages(trip.id);
        if (isMounted) {
          setImages(data);
        }
      } catch (err) {
        console.error("Failed to load gallery images", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    loadImages();
    
    // Prevent body scrolling
    document.body.style.overflow = "hidden";
    
    return () => {
      isMounted = false;
      document.body.style.overflow = "auto";
    };
  }, [trip]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (lightboxOpen) setLightboxOpen(false);
        else onClose();
      }
      
      if (lightboxOpen) {
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "ArrowRight") nextImage();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, images.length]);

  const openLightbox = (idx) => {
    setCurrentImageIdx(idx);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  // Helper to split images into columns for masonry effect
  const getColumns = () => {
    const numCols = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    const cols = Array.from({ length: numCols }, () => []);
    
    images.forEach((img, i) => {
      cols[i % numCols].push(img);
    });
    
    return cols;
  };

  if (!trip) return null;

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div 
          className={styles.modalContent} 
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>
              {trip.title} Collection
            </h2>
            <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
              <X size={24} />
            </button>
          </div>
          
          <div className={styles.modalBody}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading memorable moments...</p>
              </div>
            ) : images.length === 0 ? (
              <div className={styles.emptyContainer}>
                <Camera size={48} color="#94a3b8" style={{ marginBottom: "1rem" }} />
                <h3>No images available yet</h3>
                <p>We are collecting the best frames of {trip.title}. Check back later!</p>
              </div>
            ) : (
              <div className={styles.masonryGrid}>
                {getColumns().map((col, colIdx) => (
                  <div key={colIdx} className={styles.masonryColumn} style={{ flex: 1 }}>
                    {col.map((img) => (
                      <div 
                        key={img.id} 
                        className={styles.galleryImageWrapper}
                        onClick={() => openLightbox(images.findIndex(i => i.id === img.id))}
                      >
                        <img 
                          src={img.image} 
                          alt={img.caption || `Gallery image from ${trip.title}`} 
                          className={styles.galleryImage}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {lightboxOpen && images.length > 0 && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxOpen(false)}>
          <button 
            className={styles.lightboxClose}
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
          >
            <X size={24} />
          </button>
          
          <button 
            className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
          >
            <ChevronLeft size={32} />
          </button>
          
          <img 
            src={images[currentImageIdx].image} 
            alt={images[currentImageIdx].caption || ""} 
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
          
          <button 
            className={`${styles.lightboxNav} ${styles.lightboxNext}`}
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </>
  );
}
