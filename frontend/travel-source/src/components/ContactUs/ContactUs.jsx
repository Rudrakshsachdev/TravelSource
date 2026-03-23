import { useState, useEffect, useRef } from "react";
import styles from "./ContactUs.module.css";
import { sendContactMessage } from "../../services/api";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle, 
  TrendingUp, 
  MessageSquare,
  HelpCircle,
  Send,
  User
} from "lucide-react";

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
  const textareaRef = useRef(null);

  // Auto-resize textarea
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
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: "Email Us",
      details: "hello@travelprofessor.com",
      description: "We typically reply within 2-4 hours",
      color: "#2563eb"
    },
    {
      icon: <Phone size={24} />,
      title: "Call Us",
      details: "+91 98765 43210",
      description: "Mon-Fri, 9 AM - 6 PM IST",
      color: "#3b82f6"
    },
    {
      icon: <MapPin size={24} />,
      title: "Visit Us",
      details: "123 Travel Street, Mumbai",
      description: "Maharashtra, India - 400001",
      color: "#1d4ed8"
    }
  ];

  const faqs = [
    {
      question: "How soon will I get a response?",
      answer: "Our team of travel experts typically responds within 2-4 hours during business hours."
    },
    {
      question: "Can I modify my trip after booking?",
      answer: "Yes, modifications are possible subject to availability and specific trip terms & conditions."
    },
    {
      question: "Do you offer group discounts?",
      answer: "Certainly! we provide special tailored rates for groups consisting of 6 or more travelers."
    }
  ];

  return (
    <section className={styles.pageWrapper}>
      <div className={styles.topAccent} />
      <div className={styles.backgroundPatterns} />

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <span className={styles.badge}>GET IN TOUCH</span>
            <h1 className={styles.heading}>
              Let's Plan Your
              <span className={styles.gradientText}> Perfect Journey</span>
            </h1>
            <p className={styles.subtitle}>
              Our travel specialists are waiting to help you design an unforgettable experience tailored to your dreams.
            </p>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>Expert Support</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>2-4h</div>
              <div className={styles.statLabel}>Fast Response</div>
            </div>
          </div>
        </div>

        <div className={styles.contentGrid}>
          {/* Left Column - Contact Details & FAQ */}
          <div className={styles.infoCol}>
            <div className={styles.contactCards}>
              {contactInfo.map((info, index) => (
                <div 
                  key={index} 
                  className={styles.contactCard}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.iconBox} style={{ color: info.color, background: `${info.color}10` }}>
                    {info.icon}
                  </div>
                  <div className={styles.cardInfo}>
                    <p className={styles.cardTitle}>{info.title}</p>
                    <h3 className={styles.cardDetails}>{info.details}</h3>
                    <p className={styles.cardDesc}>{info.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.faqCard}>
              <div className={styles.faqHeader}>
                <HelpCircle className={styles.faqIcon} />
                <h3>Common Questions</h3>
              </div>
              <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                  <div key={index} className={styles.faqItem}>
                    <h4>{faq.question}</h4>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.trustStrip}>
              <div className={styles.trustItem}>
                <ShieldCheck size={18} />
                <span>SSL Secured</span>
              </div>
              <div className={styles.trustItem}>
                <CheckCircle size={18} />
                <span>Trusted Travel</span>
              </div>
              <div className={styles.trustItem}>
                <TrendingUp size={18} />
                <span>Best Price</span>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you shortly.</p>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${activeField === 'name' ? styles.active : ''}`}>
                    <label htmlFor="name"><User size={16} /> Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => handleFocus('name')}
                      onBlur={handleBlur}
                      required
                    />
                  </div>
                  <div className={`${styles.formGroup} ${activeField === 'email' ? styles.active : ''}`}>
                    <label htmlFor="email"><Mail size={16} /> Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      required
                    />
                  </div>
                </div>

                <div className={`${styles.formGroup} ${activeField === 'phone' ? styles.active : ''}`}>
                  <label htmlFor="phone"><Phone size={16} /> Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+91 00000 00000"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => handleFocus('phone')}
                    onBlur={handleBlur}
                  />
                </div>

                <div className={`${styles.formGroup} ${activeField === 'message' ? styles.active : ''}`}>
                  <label htmlFor="message"><MessageSquare size={16} /> Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your travel plans..."
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => handleFocus('message')}
                    onBlur={handleBlur}
                    ref={textareaRef}
                    required
                  />
                </div>

                {error && <div className={styles.errorMsg}><HelpCircle size={16} /> {error}</div>}
                {success && <div className={styles.successMsg}><CheckCircle size={16} /> {success}</div>}

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? (
                    <span className={styles.loading}>Sending...</span>
                  ) : (
                    <>
                      Send Message <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className={styles.supportCard}>
              <div className={styles.supportInfo}>
                <Clock className={styles.supportIcon} />
                <div>
                  <h4>Emergency Support</h4>
                  <p>Our call center is available 24/7 for travelers currently on trips.</p>
                </div>
              </div>
              <a href="tel:+919876543210" className={styles.callBtn}>
                <Phone size={18} /> +91 98765 43210
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;