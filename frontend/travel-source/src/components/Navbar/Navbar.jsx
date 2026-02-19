import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";
import { getAuthData, logout } from "../../utils/auth";
import { useState, useEffect, useRef } from "react";
import logoIcon from "../../assets/logo-icon.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const authData = getAuthData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);

  // Luxury destinations for the dropdown
  const destinations = [
    { id: 1, name: "Swiss Alps", country: "Switzerland", type: "Luxury Ski" },
    { id: 2, name: "Santorini", country: "Greece", type: "Honeymoon" },
    { id: 3, name: "Kyoto", country: "Japan", type: "Cultural" },
    { id: 4, name: "Safari", country: "Kenya", type: "Adventure" },
    {
      id: 5,
      name: "Maldives",
      country: "Indian Ocean",
      type: "Private Island",
    },
    { id: 6, name: "Paris", country: "France", type: "Haute Couture" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleDestinationHover = (index) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveHover(index);
  };

  const handleDestinationLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveHover(null);
    }, 200);
  };

  return (
    <>
      {/* Luxury Top Bar */}
      <div
        className={`${styles.topBar} ${isScrolled ? styles.topBarHidden : ""}`}
      >
        <div className={styles.topBarContent}>
          <span className={styles.topBarText}>
            <span className={styles.topBarStar}>✦</span>
            <span className={styles.topBarMainText}>
              CURATING EXTRAORDINARY JOURNEYS SINCE 2005
            </span>
            <span className={styles.topBarStar}>✦</span>
          </span>
          <div className={styles.topBarIcons}>
            <span className={styles.topBarIcon}>24/7 CONCIERGE</span>
            <span className={styles.topBarDivider}>|</span>
            <span className={styles.topBarIcon}>EXCLUSIVE ACCESS</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}
        data-luxury-navbar
      >
        <div className={styles.container}>
          {/* Premium Logo Section */}
          <div
            className={styles.logoContainer}
            onClick={() => handleNavigation("/")}
            aria-label="Travel Professor - Luxury Travel Concierge"
          >
            <div className={styles.logoMark}>
              <img
                src={logoIcon}
                alt="Travel Professor"
                className={styles.logoImg}
              />
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoPrimary}>TRAVEL</span>
              <span className={styles.logoDivider}></span>
              <span className={styles.logoSecondary}>PROFESSOR</span>
              <div className={styles.logoSubtitle}>WORLD-CLASS JOURNEYS</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.navDesktop}>
            {/* Navigation Links */}
            <div className={styles.navLinks}>
              <button
                className={styles.navLink}
                onMouseEnter={() => handleDestinationHover(0)}
                onMouseLeave={handleDestinationLeave}
              >
                <span className={styles.linkNumber}>01</span>
                <span className={styles.linkText}>DESTINATIONS</span>
                <span className={styles.linkUnderline}></span>
              </button>

              <button
                className={styles.navLink}
                onClick={() => handleNavigation("/experiences")}
              >
                <span className={styles.linkNumber}>02</span>
                <span className={styles.linkText}>EXPERIENCES</span>
                <span className={styles.linkUnderline}></span>
              </button>

              <button
                className={styles.navLink}
                onClick={() => handleNavigation("/yachts")}
              >
                <span className={styles.linkNumber}>03</span>
                <span className={styles.linkText}>PRIVATE YACHTS</span>
                <span className={styles.linkUnderline}></span>
              </button>

              <button
                className={styles.navLink}
                onClick={() => handleNavigation("/about")}
              >
                <span className={styles.linkNumber}>04</span>
                <span className={styles.linkText}>OUR LEGACY</span>
                <span className={styles.linkUnderline}></span>
              </button>
            </div>

            {/* User Actions */}
            <div className={styles.userActions}>
              {authData && (
                <div className={styles.userSection}>
                  <span className={styles.userDivider}></span>
                  <div className={styles.userProfile}>
                    <div className={styles.avatarRing}>
                      <span className={styles.userInitial}>
                        {authData.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className={styles.userInfo}>
                      <span className={styles.userGreeting}>Hello,</span>
                      <span className={styles.userName}>
                        {authData.username}
                      </span>
                    </div>
                  </div>

                  {authData?.role?.toUpperCase() === "USER" && (
                    <button
                      className={styles.enquiryBtn}
                      onClick={() => handleNavigation("/my-enquiries")}
                    >
                      <span className={styles.enquiryIcon}>
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 1V19M1 10H19"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <span className={styles.enquiryText}>MY JOURNEYS</span>
                    </button>
                  )}
                </div>
              )}

              {/* Luxury CTA Button */}
              <button
                className={`${styles.primaryBtn} ${authData ? styles.logoutBtn : styles.ctaBtn}`}
                onClick={
                  authData ? handleLogout : () => handleNavigation("/login")
                }
                aria-label={authData ? "Logout" : "Begin Your Journey"}
              >
                <span className={styles.btnGlow}></span>
                <span className={styles.btnText}>
                  {authData ? "LOGOUT" : "BEGIN JOURNEY"}
                </span>
                <span className={styles.btnArrow}>
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 10H16M16 10L13 6M16 10L13 14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className={`${styles.mobileMenuToggle} ${isMenuOpen ? styles.active : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span className={styles.toggleText}>MENU</span>
            <div className={styles.toggleLines}>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

        {/* Luxury Destinations Dropdown */}
        {activeHover === 0 && (
          <div
            className={styles.destinationsDropdown}
            onMouseEnter={() => handleDestinationHover(0)}
            onMouseLeave={handleDestinationLeave}
          >
            <div className={styles.dropdownContent}>
              <div className={styles.dropdownHeader}>
                <span className={styles.dropdownTitle}>
                  EXCLUSIVE DESTINATIONS
                </span>
                <span className={styles.dropdownSubtitle}>
                  Curated by our global concierge team
                </span>
              </div>

              <div className={styles.destinationsGrid}>
                {destinations.map((dest) => (
                  <div
                    key={dest.id}
                    className={styles.destinationCard}
                    onClick={() =>
                      handleNavigation(
                        `/destinations/${dest.name.toLowerCase()}`,
                      )
                    }
                  >
                    <div className={styles.destinationNumber}>0{dest.id}</div>
                    <div className={styles.destinationInfo}>
                      <div className={styles.destinationName}>{dest.name}</div>
                      <div className={styles.destinationCountry}>
                        {dest.country}
                      </div>
                    </div>
                    <div className={styles.destinationType}>{dest.type}</div>
                    <div className={styles.destinationArrow}>
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 8H12M12 8L9 5M12 8L9 11"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.dropdownFooter}>
                <button className={styles.viewAllBtn}>
                  VIEW ALL 47 DESTINATIONS
                  <span className={styles.viewAllArrow}>
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 8H12M12 8L9 5M12 8L9 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Luxury Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ""}`}
      >
        <div className={styles.mobileMenuContainer} ref={menuRef}>
          <div className={styles.mobileHeader}>
            <div className={styles.mobileUser}>
              {authData ? (
                <>
                  <div className={styles.mobileAvatar}>
                    {authData.username.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.mobileUserInfo}>
                    <div className={styles.mobileWelcome}>Welcome back</div>
                    <div className={styles.mobileUsername}>
                      {authData.username}
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.mobileGuest}>
                  Welcome to Travel Professor
                </div>
              )}
            </div>
          </div>

          <nav className={styles.mobileNav}>
            <div className={styles.mobileNavSection}>
              <div className={styles.mobileNavTitle}>EXPLORE</div>
              {destinations.slice(0, 3).map((dest) => (
                <button
                  key={dest.id}
                  className={styles.mobileNavItem}
                  onClick={() =>
                    handleNavigation(`/destinations/${dest.name.toLowerCase()}`)
                  }
                >
                  <span className={styles.mobileItemNumber}>0{dest.id}</span>
                  <span className={styles.mobileItemText}>{dest.name}</span>
                  <span className={styles.mobileItemArrow}>
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 8H12M12 8L9 5M12 8L9 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              ))}
            </div>

            <div className={styles.mobileNavSection}>
              <div className={styles.mobileNavTitle}>NAVIGATION</div>
              <button
                className={styles.mobileNavItem}
                onClick={() => handleNavigation("/experiences")}
              >
                <span className={styles.mobileItemText}>
                  Premium Experiences
                </span>
              </button>
              <button
                className={styles.mobileNavItem}
                onClick={() => handleNavigation("/yachts")}
              >
                <span className={styles.mobileItemText}>
                  Private Yacht Charters
                </span>
              </button>
              <button
                className={styles.mobileNavItem}
                onClick={() => handleNavigation("/about")}
              >
                <span className={styles.mobileItemText}>Our Legacy</span>
              </button>

              {authData?.role?.toUpperCase() === "USER" && (
                <button
                  className={styles.mobileNavItem}
                  onClick={() => handleNavigation("/my-enquiries")}
                >
                  <span className={styles.mobileItemText}>My Journeys</span>
                </button>
              )}
            </div>
          </nav>

          <div className={styles.mobileActions}>
            <button
              className={`${styles.mobileCtaBtn} ${authData ? styles.mobileLogoutBtn : ""}`}
              onClick={
                authData ? handleLogout : () => handleNavigation("/concierge")
              }
            >
              {authData ? "LOGOUT" : "CONNECT WITH CONCIERGE"}
              <span className={styles.mobileCtaArrow}>
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 10H16M16 10L13 6M16 10L13 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            <div className={styles.mobileContact}>
              <div className={styles.contactTitle}>24/7 CONCIERGE</div>
              <a href="tel:+18005551234" className={styles.contactPhone}>
                +1 (800) 555-1234
              </a>
              <a
                href="mailto:concierge@travelprofessor.com"
                className={styles.contactEmail}
              >
                concierge@travelprofessor.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Overlay */}
      <div
        className={`${styles.menuOverlay} ${isMenuOpen ? styles.active : ""}`}
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;
