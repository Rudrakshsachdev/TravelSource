import { useState } from "react";
import styles from "./BookingForm.module.css";

const BookingForm = ({ trip, onSubmit }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    persons: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "persons" ? parseInt(value, 10) || 1 : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("BookingForm submitted:", formData);
    onSubmit(formData);
  };

  const totalAmount = trip.price * formData.persons;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Book Your Trip</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          name="persons"
          type="number"
          min="1"
          value={formData.persons}
          onChange={handleChange}
          required
        />

        <div className={styles.total}>
          Total Amount: <strong>₹{totalAmount}</strong>
        </div>

        <button type="submit">Proceed to Payment</button>
      </form>
    </div>
  );
};

export default BookingForm;
