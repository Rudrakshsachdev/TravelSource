import { useState } from "react";
import styles from "./TripDetailNew.module.css";

const ImageGallery = ({ images = [], title = "" }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // Use trip's main image as fallback, ensure at least 5 slots
  const gallery = images.length > 0 ? images : [];
  if (gallery.length === 0) return null;

  const openLightbox = (idx) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goNext = () => setLightboxIdx((prev) => (prev + 1) % gallery.length);
  const goPrev = () => setLightboxIdx((prev) => (prev - 1 + gallery.length) % gallery.length);

  // Cloudinary optimization: add quality & format transforms
  const optimizeUrl = (url) => {
    if (!url) return "";
    if (url.includes("res.cloudinary.com") && !url.includes("/q_auto")) {
      return url.replace("/upload/", "/upload/q_auto,f_auto/");
    }
    return url;
  };

  return (
    <>
      <div className={styles.galleryGrid}>
        {/* Main large image */}
        <div
          className={styles.galleryMain}
          onClick={() => openLightbox(0)}
        >
          <img
            src={optimizeUrl(gallery[0])}
            alt={title}
            loading="eager"
            className={styles.galleryImg}
          />
          <div className={styles.galleryOverlayText}>
            <h2 className={styles.galleryTitle}>{title}</h2>
          </div>
        </div>

        {/* Smaller images */}
        <div className={styles.gallerySide}>
          {gallery.slice(1, 5).map((img, i) => (
            <div
              key={i}
              className={styles.gallerySideItem}
              onClick={() => openLightbox(i + 1)}
            >
              <img
                src={optimizeUrl(img)}
                alt={`${title} ${i + 2}`}
                loading="lazy"
                className={styles.galleryImg}
              />
              {i === 3 && gallery.length > 5 && (
                <div className={styles.galleryMoreBadge}>
                  {gallery.length - 4}+ Photos &rsaquo;
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.lightboxClose} onClick={closeLightbox}>&times;</button>
            <button className={styles.lightboxArrow + " " + styles.lightboxPrev} onClick={goPrev}>&#8249;</button>
            <img
              src={optimizeUrl(gallery[lightboxIdx])}
              alt={`${title} ${lightboxIdx + 1}`}
              className={styles.lightboxImg}
            />
            <button className={styles.lightboxArrow + " " + styles.lightboxNext} onClick={goNext}>&#8250;</button>
            <div className={styles.lightboxCounter}>
              {lightboxIdx + 1} / {gallery.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
