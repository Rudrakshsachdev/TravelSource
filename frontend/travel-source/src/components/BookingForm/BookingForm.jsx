import { useState } from "react";
import styles from "./BookingForm.module.css";

const BookingForm = ({ trip, onSubmit }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    persons: 1,
    travel_date: "",
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
          placeholder="Number of Persons"
          value={formData.persons}
          onChange={handleChange}
          required
        />

        <div className={styles.dateField}>
          <label htmlFor="travel_date">Travel Date</label>
          <input
            id="travel_date"
            name="travel_date"
            type="date"
            value={formData.travel_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.total}>
          Total Amount: <strong>₹{totalAmount}</strong>
        </div>

        <button type="submit">Proceed to Payment</button>
      </form>
    </div>
  );
};

export default BookingForm;
