import React, { useState, useEffect } from "react";
import {
  fetchAdminTrips,
  updateTrip,
  fetchTripGalleryImages,
  addTripGalleryImage,
  deleteTripGalleryImage,
  uploadImageToCloudinary,
} from "../services/api";
import styles from "./AdminJourneyFrames.module.css";

const AdminJourneyFrames = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Gallery Modal State
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminTrips();
      // Sort: those with show_in_journey_in_frames=true first, then by order
      const sorted = data.sort((a, b) => {
        if (a.show_in_journey_in_frames && !b.show_in_journey_in_frames) return -1;
        if (!a.show_in_journey_in_frames && b.show_in_journey_in_frames) return 1;
        return (a.journey_in_frames_order || 0) - (b.journey_in_frames_order || 0);
      });
      setTrips(sorted);
    } catch (err) {
      console.error("Failed to load trips", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShow = async (trip) => {
    try {
      await updateTrip(trip.id, {
        ...trip,
        show_in_journey_in_frames: !trip.show_in_journey_in_frames
      });
      loadTrips();
    } catch (err) {
      alert("Failed to update trip");
    }
  };

  const handleOrderChange = async (trip, newOrder) => {
    try {
      await updateTrip(trip.id, {
        ...trip,
        journey_in_frames_order: Number(newOrder)
      });
      loadTrips();
    } catch (err) {
      alert("Failed to update order");
    }
  };

  const openGalleryModal = async (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
    try {
      const images = await fetchTripGalleryImages(trip.id);
      setGalleryImages(images);
    } catch (err) {
      alert("Failed to load gallery images");
    }
  };

  const closeGalleryModal = () => {
    setSelectedTrip(null);
    setGalleryImages([]);
    setIsModalOpen(false);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !selectedTrip) return;

    setUploading(true);
    try {
      for (const file of files) {
        const url = await uploadImageToCloudinary(file);
        const newImage = await addTripGalleryImage({
          trip: selectedTrip.id,
          image: url,
          image_type: "GALLERY"
        });
        setGalleryImages((prev) => [...prev, newImage]);
      }
    } catch (err) {
      alert("Failed to upload image(s)");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = null;
    }
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await deleteTripGalleryImage(id);
      setGalleryImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      alert("Failed to delete image");
    }
  };


  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Journey in Frames</h1>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Trip</th>
              <th>Show in Section</th>
              <th>Display Order</th>
              <th>Gallery</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.title}</td>
                <td>
                  <button
                    className={`${styles.toggleBtn} ${!trip.show_in_journey_in_frames ? styles.inactive : ""}`}
                    onClick={() => handleToggleShow(trip)}
                  >
                    {trip.show_in_journey_in_frames ? "Visible" : "Hidden"}
                  </button>
                </td>
                <td>
                  <input
                    type="number"
                    value={trip.journey_in_frames_order || 0}
                    onChange={(e) => handleOrderChange(trip, e.target.value)}
                    style={{ width: "60px", padding: "0.25rem" }}
                  />
                </td>
                <td>
                  <button
                    className={styles.actionBtn}
                    onClick={() => openGalleryModal(trip)}
                  >
                    Manage Gallery
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedTrip && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={closeGalleryModal}>&times;</button>
            <h2 className={styles.modalTitle}>
              Gallery Images - {selectedTrip.title}
            </h2>

            <div className={styles.uploadSection}>
              <div className={styles.uploadForm}>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <span>Uploading...</span>}
              </div>
            </div>

            <div className={styles.galleryGrid}>
              {galleryImages.map((img) => (
                <div key={img.id} className={styles.imageCard}>
                  <img src={img.image} alt={img.caption || "Gallery"} />
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteImage(img.id)}
                    title="Delete Image"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            
            {galleryImages.length === 0 && !uploading && (
              <p>No gallery images uploaded yet for this trip.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJourneyFrames;
