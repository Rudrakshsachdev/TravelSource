import { useState, useEffect } from "react";
import { fetchAdminCoupons, createAdminCoupon, updateAdminCoupon, deleteAdminCoupon } from "../services/api";
import styles from "./AdminCoupons.module.css";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "PERCENTAGE",
    discount_value: "",
    max_discount: "",
    min_booking_amount: 0,
    is_active: true,
    usage_limit: 0,
    expiry_date: "",
  });

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminCoupons();
      setCoupons(data);
    } catch (err) {
      setError("Failed to fetch coupons. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        ...coupon,
        expiry_date: coupon.expiry_date ? new Date(coupon.expiry_date).toISOString().slice(0, 16) : "",
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: "",
        discount_type: "PERCENTAGE",
        discount_value: "",
        max_discount: "",
        min_booking_amount: 0,
        is_active: true,
        usage_limit: 0,
        expiry_date: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up empty strings for numbers/dates
      const payload = { ...formData };
      if (!payload.max_discount) payload.max_discount = null;
      if (!payload.expiry_date) payload.expiry_date = null;
      payload.code = payload.code.toUpperCase().trim();

      if (editingCoupon) {
        await updateAdminCoupon(editingCoupon.id, payload);
      } else {
        await createAdminCoupon(payload);
      }
      handleCloseModal();
      loadCoupons();
    } catch (err) {
      alert(err.message || "Operation failed.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteAdminCoupon(id);
        loadCoupons();
      } catch (err) {
        alert("Failed to delete coupon.");
      }
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      await updateAdminCoupon(coupon.id, { is_active: !coupon.is_active });
      loadCoupons();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <div className={styles.loading}>Loading Coupons...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Coupons Management</h1>
        <button onClick={() => handleOpenModal()} className={styles.createBtn}>
          + Create New Coupon
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Type / Value</th>
              <th>Status</th>
              <th>Usage limit</th>
              <th>Used</th>
              <th>Expiry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="7" className={styles.emptyState}>
                  No coupons found. Create one!
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id}>
                  <td className={styles.codeCell}>{c.code}</td>
                  <td>
                    {c.discount_type === "PERCENTAGE" ? `${c.discount_value}%` : `₹${c.discount_value}`} 
                    {c.discount_type === "PERCENTAGE" && c.max_discount && ` (Max ₹${c.max_discount})`}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleToggleActive(c)}
                      className={c.is_active ? styles.statusActive : styles.statusInactive}
                    >
                      {c.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>{c.usage_limit > 0 ? c.usage_limit : "Unlimited"}</td>
                  <td>{c.times_used}</td>
                  <td>{c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : "Never"}</td>
                  <td className={styles.actionsCell}>
                    <button onClick={() => handleOpenModal(c)} className={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(c.id)} className={styles.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{editingCoupon ? "Edit Coupon" : "Create Coupon"}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Coupon Code *</label>
                  <input required name="code" value={formData.code} onChange={handleChange} placeholder="e.g. SUMMER20" />
                </div>
                <div className={styles.formGroup}>
                  <label>Discount Type</label>
                  <select name="discount_type" value={formData.discount_type} onChange={handleChange}>
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Discount Value *</label>
                  <input required type="number" step="0.01" name="discount_value" value={formData.discount_value} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>Max Discount Cap (₹) {formData.discount_type === "FLAT" && "(Ignored)"}</label>
                  <input type="number" step="0.01" name="max_discount" value={formData.max_discount} onChange={handleChange} disabled={formData.discount_type === "FLAT"} placeholder="Leave empty for none" />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Min. Booking Amount (₹)</label>
                  <input type="number" step="0.01" name="min_booking_amount" value={formData.min_booking_amount} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>Usage Limit</label>
                  <input type="number" name="usage_limit" value={formData.usage_limit} onChange={handleChange} title="0 = Unlimited" />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Expiry Date & Time</label>
                  <input type="datetime-local" name="expiry_date" value={formData.expiry_date} onChange={handleChange} />
                </div>
                <div className={styles.formGroupCheckbox}>
                  <label>
                    <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
                    Coupon is Active
                  </label>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={handleCloseModal} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>Save Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
