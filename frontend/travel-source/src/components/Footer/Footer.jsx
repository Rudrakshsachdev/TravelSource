import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import skylineImg from "../../assets/footer.png";


const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className={styles.footer}>
      {/* Decorative top border */}
      <div className={styles.topAccent} />

      <div className={styles.container}>
        {/* ── Upper Section ── */}
        <div className={styles.upper}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoIcon}>✦</span>
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>Travel Professor</span>
                <span className={styles.logoTagline}>Curated Journeys</span>
              </div>
            </Link>
            <p className={styles.brandDesc}>
              We transform ordinary trips into extraordinary journeys with
              expertise, care, and attention to every detail. Travel with
              confidence — travel with us.
            </p>
            <div className={styles.socials}>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Twitter"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.linksList}>
              <li>
                <Link to="/" className={styles.footerLink}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#trips" className={styles.footerLink}>
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/#why-choose-us" className={styles.footerLink}>
                  Why Choose Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className={styles.footerLink}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/login" className={styles.footerLink}>
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Travel Services */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Services</h4>
            <ul className={styles.linksList}>
              <li>
                <span className={styles.footerLink}>Curated Itineraries</span>
              </li>
              <li>
                <span className={styles.footerLink}>Group Adventures</span>
              </li>
              <li>
                <span className={styles.footerLink}>Custom Packages</span>
              </li>
              <li>
                <span className={styles.footerLink}>Honeymoon Specials</span>
              </li>
              <li>
                <span className={styles.footerLink}>Travel Insurance</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>Get in Touch</h4>
            <div className={styles.contactList}>
              <a
                href="mailto:concierge@travelprofessor.com"
                className={styles.contactItem}
              >
                <svg
                  className={styles.contactIcon}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>concierge@travelprofessor.com</span>
              </a>
              <a href="tel:+18005551234" className={styles.contactItem}>
                <svg
                  className={styles.contactIcon}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+1 (800) 555-1234</span>
              </a>
              <div className={styles.contactItem}>
                <svg
                  className={styles.contactIcon}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>New Delhi, India</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className={styles.newsletter}>
              <p className={styles.newsletterLabel}>Stay Updated</p>
              <form
                className={styles.newsletterForm}
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  className={styles.newsletterInput}
                  aria-label="Email for newsletter"
                />
                <button type="submit" className={styles.newsletterBtn}>
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="16"
                    height="16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>

      {/* ── Skyline Graphic (Full Width) ── */}
      <div className={styles.skylineWrapper}>
        <img src={skylineImg} alt="" className={styles.skylineImage} />
      </div>

      <div className={styles.container} style={{ paddingTop: 0 }}>
        {/* ── Divider ── */}
        <div className={styles.divider} />

        {/* ── Bottom Bar ── */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} Travel Professor. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <span className={styles.bottomLink}>Privacy Policy</span>
            <span className={styles.bottomDot}>·</span>
            <span className={styles.bottomLink}>Terms of Service</span>
            <span className={styles.bottomDot}>·</span>
            <span className={styles.bottomLink}>Refund Policy</span>
          </div>
          <button
            className={styles.backToTop}
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
