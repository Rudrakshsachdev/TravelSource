// import { useState } from "react";
// import styles from "./ContactUs.module.css";
// import { sendContactMessage } from "../../services/api";

// const ContactUs = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       await sendContactMessage(formData);
//       setSuccess("Your message has been sent successfully!");
//       setFormData({ name: "", email: "", phone: "", message: "" });
//     } catch (err) {
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className={styles.section}>
//       <h4 className={styles.subHeading}>CONTACT US</h4>
//       <h1 className={styles.heading}>We’d love to hear from you</h1>

//       <p className={styles.text}>
//         Have questions about a trip or need help planning your journey?
//         Fill out the form below and our team will get back to you shortly.
//       </p>

//       <form className={styles.form} onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Your Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Your Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="text"
//           name="phone"
//           placeholder="Phone Number (optional)"
//           value={formData.phone}
//           onChange={handleChange}
//         />

//         <textarea
//           name="message"
//           placeholder="Your Message"
//           rows="5"
//           value={formData.message}
//           onChange={handleChange}
//           required
//         />

//         {error && <p className={styles.error}>{error}</p>}
//         {success && <p className={styles.success}>{success}</p>}

//         <button type="submit" disabled={loading}>
//           {loading ? "Sending..." : "Send Message"}
//         </button>
//       </form>
//     </section>
//   );
// };

// export default ContactUs;


import { useState, useEffect, useRef } from "react";
import styles from "./ContactUs.module.css";
import { sendContactMessage } from "../../services/api";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeField, setActiveField] = useState(null);
  const formRef = useRef(null);

  // Auto-resize textarea
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Form validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      await sendContactMessage(formData);
      setSuccess("Your message has been sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      ),
      title: "Email Us",
      details: "hello@travelprofessor.com",
      description: "We typically reply within 2-4 hours",
      color: "#7ecfc0"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      ),
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri, 9 AM - 6 PM IST",
      color: "#3f9e8f"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      ),
      title: "Visit Us",
      details: "123 Travel Street, Mumbai",
      description: "India - 400001",
      color: "#1a3a35"
    }
  ];

  const faqs = [
    {
      question: "How soon will I get a response?",
      answer: "We typically respond within 2-4 hours during business hours."
    },
    {
      question: "Can I modify my trip after booking?",
      answer: "Yes, modifications are possible subject to availability and terms."
    },
    {
      question: "Do you offer group discounts?",
      answer: "We provide special rates for groups of 6 or more travelers."
    }
  ];

  return (
    <section className={styles.section}>
      {/* Background Overlay - Matching Reviews section */}
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h4 className={styles.subHeading}>GET IN TOUCH</h4>
            <h1 className={styles.heading}>
              Let's Plan Your
              <span className={styles.gradientText}> Perfect Journey</span>
            </h1>
            <p className={styles.subtitle}>
              Our travel experts are ready to help you create unforgettable memories
            </p>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>Support Available</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>2-4h</div>
              <div className={styles.statLabel}>Response Time</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>Satisfaction</div>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {/* Left Column - Contact Info & FAQs */}
          <div className={styles.infoColumn}>
            <div className={styles.contactCards}>
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className={styles.contactCard}
                  style={{ borderTop: `4px solid ${info.color}` }}
                >
                  <div
                    className={styles.contactIcon}
                    style={{ backgroundColor: `${info.color}15` }}
                  >
                    <div style={{ color: info.color }}>
                      {info.icon}
                    </div>
                  </div>
                  <div className={styles.contactDetails}>
                    <h3 className={styles.contactTitle}>{info.title}</h3>
                    <p className={styles.contactMain}>{info.details}</p>
                    <p className={styles.contactDescription}>{info.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className={styles.faqSection}>
              <h3 className={styles.faqTitle}>
                <svg className={styles.faqIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Frequently Asked Questions
              </h3>

              <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                  <div key={index} className={styles.faqItem}>
                    <h4 className={styles.faqQuestion}>{faq.question}</h4>
                    <p className={styles.faqAnswer}>{faq.answer}</p>
                  </div>
                ))}
              </div>

              <button className={styles.faqButton}>
                <svg className={styles.buttonIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                View All FAQs
              </button>
            </div>

            {/* Trust Badges */}
            <div className={styles.trustBadges}>
              <div className={styles.badge}>
                <svg className={styles.badgeIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>SSL Secured</span>
              </div>
              <div className={styles.badge}>
                <svg className={styles.badgeIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Trusted Travel</span>
              </div>
              <div className={styles.badge}>
                <svg className={styles.badgeIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Best Price</span>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className={styles.formColumn}>
            <div
              className={styles.formCard}
              ref={formRef}
            >
              <div className={styles.formHeader}>
                <h3 className={styles.formTitle}>Send us a message</h3>
                <p className={styles.formSubtitle}>
                  Fill out the form below and our travel experts will get back to you shortly
                </p>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label
                      className={`${styles.formLabel} ${activeField === 'name' ? styles.active : ''}`}
                      htmlFor="name"
                    >
                      <svg className={styles.labelIcon} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => handleFocus('name')}
                      onBlur={handleBlur}
                      required
                      className={`${styles.input} ${formData.name ? styles.filled : ''}`}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label
                      className={`${styles.formLabel} ${activeField === 'email' ? styles.active : ''}`}
                      htmlFor="email"
                    >
                      <svg className={styles.labelIcon} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      required
                      className={`${styles.input} ${formData.email ? styles.filled : ''}`}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label
                    className={`${styles.formLabel} ${activeField === 'phone' ? styles.active : ''}`}
                    htmlFor="phone"
                  >
                    <svg className={styles.labelIcon} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => handleFocus('phone')}
                    onBlur={handleBlur}
                    className={`${styles.input} ${formData.phone ? styles.filled : ''}`}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label
                    className={`${styles.formLabel} ${activeField === 'message' ? styles.active : ''}`}
                    htmlFor="message"
                  >
                    <svg className={styles.labelIcon} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your travel plans, questions, or special requirements..."
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => handleFocus('message')}
                    onBlur={handleBlur}
                    required
                    rows="4"
                    ref={textareaRef}
                    className={`${styles.textarea} ${formData.message ? styles.filled : ''}`}
                  />
                  <div className={styles.charCount}>
                    {formData.message.length}/500 characters
                  </div>
                </div>

                {/* Status Messages */}
                {error && (
                  <div className={styles.errorMessage}>
                    <svg className={styles.statusIcon} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}

                {success && (
                  <div className={styles.successMessage}>
                    <svg className={styles.statusIcon} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {success}
                  </div>
                )}

                <div className={styles.formFooter}>
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.submitButton}
                  >
                    {loading ? (
                      <>
                        <svg className={styles.spinner} viewBox="0 0 50 50">
                          <circle className={styles.spinnerPath} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className={styles.buttonIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>

                  <p className={styles.formNote}>
                    By submitting this form, you agree to our
                    <a href="/privacy" className={styles.privacyLink}> Privacy Policy</a>.
                    We'll never share your information with third parties.
                  </p>
                </div>
              </form>
            </div>

            {/* Live Chat Widget */}
            <div className={styles.chatWidget}>
              <div className={styles.chatHeader}>
                <div className={styles.agentAvatar}>
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="Travel Expert"
                  />
                  <div className={styles.agentStatus}></div>
                </div>
                <div className={styles.agentInfo}>
                  <h4>Alex - Travel Expert</h4>
                  <p>Online • Ready to help</p>
                </div>
              </div>
              <p className={styles.chatPrompt}>
                Need immediate assistance? Start a live chat with our travel experts.
              </p>
              <button className={styles.chatButton}>
                <svg className={styles.chatIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                Start Live Chat
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={styles.bottomCta}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>Prefer to talk directly?</h3>
            <p className={styles.ctaText}>
              Call our travel consultants for personalized assistance
            </p>
            <div className={styles.ctaPhone}>
              <svg className={styles.phoneIcon} viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <a href="tel:+15551234567" className={styles.phoneNumber}>
                +1 (555) 123-4567
              </a>
            </div>
          </div>
          <div className={styles.ctaHours}>
            <div className={styles.hoursBadge}>
              <svg className={styles.clockIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Mon-Sun, 24/7 Support
            </div>
            <p className={styles.hoursText}>
              Emergency support available for travelers in India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;