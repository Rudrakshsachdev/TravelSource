import styles from "./Navbar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuthData, logout } from "../../utils/auth";
import { useState, useEffect, useRef, useCallback } from "react";
import { fetchTrips } from "../../services/api";
import {
  Search,
  Phone,
  User,
  LogOut,
  BookOpen,
  Compass,
  MapPin,
  Mountain,
  Bike,
  Mail,
  Shield,
  FileText,
  ChevronDown,
  X,
  Flame,
  Star,
  Users,
} from "lucide-react";
import tpLogo from "../../assets/logog.png";

/* ═══════════════════════════════════════════════════════════════
   Navbar — Advanced JustWravel-style | Travel Professor
   Glassmorphism, search overlay, rich dropdowns, user avatar
   ═══════════════════════════════════════════════════════════════ */

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authData = getAuthData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHover, setActiveHover] = useState("");
  const [activeMobileGroup, setActiveMobileGroup] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);
  const userDropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);
  const rafRef = useRef(null);

  const [destinations, setDestinations] = useState([]);
  const [tripsCount, setTripsCount] = useState(0);

  /* ── Scroll handler ── */
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > 10);
      rafRef.current = null;
    });
  }, []);

  /* ── Body lock on mobile menu ── */
  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isSearchOpen]);

  /* ── Load data + listeners ── */
  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const trips = await fetchTrips();
        setTripsCount(trips.length);

        const uniqueLocations = [];
        const seen = new Set();

        trips.forEach((trip) => {
          const locName = trip.location;
          if (!seen.has(locName)) {
            seen.add(locName);
            uniqueLocations.push({
              id: trip.id,
              name: trip.location,
              country: trip.country || "Destination",
            });
          }
        });

        setDestinations(uniqueLocations.slice(0, 6));
      } catch (err) {
        console.error("Failed to load navbar destinations:", err);
      }
    };

    loadDestinations();

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsUserDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  /* ── Focus search input when overlay opens ── */
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setActiveMobileGroup("");
    setActiveHover("");
    setIsUserDropdownOpen(false);
    setIsSearchOpen(false);
  };

  const handleDesktopHover = (menuKey) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveHover(menuKey);
  };

  const handleDesktopLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveHover("");
    }, 250);
  };

  const goToHomeSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
    }

    setIsMenuOpen(false);
    setActiveHover("");
    setActiveMobileGroup("");
    setIsSearchOpen(false);

    const delay = location.pathname !== "/" ? 400 : 50;
    setTimeout(() => {
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, delay);
  };

  /* ── Rich menu structure with icons ── */
  const desktopMenus = [
    {
      key: "backpacking",
      label: "Backpacking Trips",
      submenu: [
        {
          icon: <Star size={14} />,
          label: "Featured Tours",
          desc: "Our most popular trips",
          action: () => goToHomeSection("trips-grid"),
        },
        {
          icon: <BookOpen size={14} />,
          label: "My Bookings",
          desc: "View your reservations",
          action: () => handleNavigation("/my-bookings"),
        },
      ],
    },
    {
      key: "bestsellers",
      label: "Best Sellers",
      submenu: destinations.map((dest) => ({
        icon: <MapPin size={14} />,
        label: dest.name,
        desc: dest.country,
        action: () => handleNavigation(`/trips/${dest.id}`),
      })),
    },
    {
      key: "biking",
      label: "Biking Trips",
      submenu: [
        {
          icon: <Mountain size={14} />,
          label: "Adventure",
          desc: "Thrilling outdoor rides",
          action: () => goToHomeSection("trips-grid"),
        },
        {
          icon: <Users size={14} />,
          label: "Group Trips",
          desc: "Travel with friends",
          action: () => goToHomeSection("trips-grid"),
        },
        {
          icon: <Mail size={14} />,
          label: "Contact Concierge",
          desc: "Get expert help",
          action: () => handleNavigation("/contact"),
        },
      ],
    },
    {
      key: "more",
      label: "More",
      submenu: [
        {
          icon: <Compass size={14} />,
          label: "Contact",
          desc: "Reach our team",
          action: () => handleNavigation("/contact"),
        },
        {
          icon: <FileText size={14} />,
          label: "Terms",
          desc: "Terms of service",
          action: () => handleNavigation("/terms"),
        },
        {
          icon: <Shield size={14} />,
          label: "Privacy",
          desc: "Your data matters",
          action: () => handleNavigation("/privacy"),
        },
        {
          icon: <FileText size={14} />,
          label: "Refund Policy",
          desc: "Returns & refunds",
          action: () => handleNavigation("/refund-policy"),
        },
      ],
    },
  ];

  const searchHints = [
    "Goa",
    "Manali",
    "Leh Ladakh",
    "Kashmir",
    "Rishikesh",
    "Weekend Trips",
    "Group Tours",
  ];

  return (
    <>
      <header
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}
      >
        <div className={styles.container}>
          {/* ── Logo ── */}
          <div
            className={styles.logoContainer}
            onClick={() => handleNavigation("/")}
            aria-label="Travel Professor home"
          >
            <img
              src={tpLogo}
              alt="Travel Professor"
              className={styles.logoImg}
            />
          </div>

          {/* ── Desktop Nav ── */}
          <nav className={styles.navDesktop}>
            <ul className={styles.navLinks}>
              {/* "Good Friday" animated badge */}
              <li className={styles.navItem}>
                <button
                  className={styles.highlightBadge}
                  onClick={() => goToHomeSection("trips-grid")}
                >
                  Good Friday
                  <span className={styles.liveBadge}>LIVE NOW</span>
                </button>
              </li>

              {desktopMenus.map((item) => (
                <li
                  key={item.key}
                  className={styles.navItem}
                  onMouseEnter={() =>
                    item.submenu && handleDesktopHover(item.key)
                  }
                  onMouseLeave={handleDesktopLeave}
                >
                  <button className={styles.navLink} onClick={item.action}>
                    {item.label}
                    {item.submenu ? <span className={styles.caret} /> : null}
                  </button>

                  {/* Rich dropdown with icons & descriptions */}
                  {item.submenu && activeHover === item.key ? (
                    <div className={styles.dropdown}>
                      {item.submenu.map((subItem) => (
                        <button
                          key={`${item.key}-${subItem.label}`}
                          className={styles.dropdownItem}
                          onClick={subItem.action}
                        >
                          {subItem.icon && (
                            <span className={styles.dropdownIcon}>
                              {subItem.icon}
                            </span>
                          )}
                          <span className={styles.dropdownItemText}>
                            <span className={styles.dropdownItemLabel}>
                              {subItem.label}
                            </span>
                            {subItem.desc && (
                              <span className={styles.dropdownItemDesc}>
                                {subItem.desc}
                              </span>
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>

            {/* ── Right Actions ── */}
            <div className={styles.rightActions}>
              {/* Phone CTA with ring animation */}
              <a
                href="tel:+919797972175"
                className={styles.phoneCta}
                aria-label="Call us"
              >
                <span className={styles.phoneIconWrap}>
                  <Phone size={14} strokeWidth={2} />
                </span>
                <span className={styles.phoneTextWrap}>
                  <span className={styles.phoneLabel}>Call Us</span>
                  <span className={styles.phoneNumber}>
                    +91 97 97 97 21 75
                  </span>
                </span>
              </a>

              {/* Search — opens overlay */}
              <button
                className={styles.searchBtn}
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search size={18} strokeWidth={2.5} />
              </button>

              {/* Auth: User avatar dropdown OR Login button */}
              {authData ? (
                <div
                  className={styles.navItem}
                  ref={userDropdownRef}
                  style={{ position: "relative" }}
                >
                  <button
                    className={styles.userBtn}
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  >
                    <span className={styles.userAvatar}>
                      {authData.username.charAt(0).toUpperCase()}
                    </span>
                    <span className={styles.userName}>
                      {authData.username}
                    </span>
                    <span className={styles.userCaret} />
                  </button>

                  {isUserDropdownOpen && (
                    <div className={styles.userDropdown}>
                      <button
                        className={styles.userDropdownItem}
                        onClick={() => handleNavigation("/my-enquiries")}
                      >
                        <User size={16} />
                        My Journeys
                      </button>
                      <button
                        className={styles.userDropdownItem}
                        onClick={() => handleNavigation("/my-bookings")}
                      >
                        <BookOpen size={16} />
                        My Bookings
                      </button>
                      <div className={styles.userDivider} />
                      <button
                        className={`${styles.userDropdownItem} ${styles.logoutItem}`}
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className={styles.loginBtn}
                  onClick={() => handleNavigation("/login")}
                >
                  Login
                </button>
              )}
            </div>
          </nav>

          {/* ── Mobile Toggle ── */}
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
              <span></span>
            </div>
          </button>
        </div>
      </header>

      {/* ═══ Search Overlay ═══ */}
      <div
        className={`${styles.searchOverlay} ${isSearchOpen ? styles.active : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsSearchOpen(false);
        }}
      >
        <div className={styles.searchModal}>
          <div className={styles.searchInputWrap}>
            <Search size={20} strokeWidth={2} />
            <input
              ref={searchInputRef}
              className={styles.searchInput}
              type="text"
              placeholder="Search destinations, trips, activities..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsSearchOpen(false);
                  goToHomeSection("trips-grid");
                }
              }}
            />
            <button
              className={styles.searchClose}
              onClick={() => setIsSearchOpen(false)}
            >
              ESC
            </button>
          </div>
          <div className={styles.searchHints}>
            {searchHints.map((hint) => (
              <button
                key={hint}
                className={styles.searchHint}
                onClick={() => {
                  setIsSearchOpen(false);
                  goToHomeSection("trips-grid");
                }}
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
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
                  <div>
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
              <button
                className={styles.mobileNavTitle}
                onClick={() => handleNavigation("/")}
              >
                🏠 Home
              </button>
              <button
                className={styles.mobileNavTitle}
                onClick={() => goToHomeSection("trips-grid")}
              >
                🎒 Backpacking Trips
              </button>
              <button
                className={styles.mobileNavTitle}
                onClick={() =>
                  setActiveMobileGroup((prev) =>
                    prev === "destinations" ? "" : "destinations",
                  )
                }
              >
                ⭐ Best Sellers
              </button>

              {activeMobileGroup === "destinations"
                ? destinations.map((dest) => (
                    <button
                      key={dest.id}
                      className={styles.mobileNavItem}
                      onClick={() => handleNavigation(`/trips/${dest.id}`)}
                    >
                      {dest.name}
                    </button>
                  ))
                : null}
            </div>

            <div className={styles.mobileNavSection}>
              <button
                className={styles.mobileNavTitle}
                onClick={() => goToHomeSection("trips-grid")}
              >
                🚴 Biking Trips
              </button>
              <button
                className={styles.mobileNavTitle}
                onClick={() => handleNavigation("/contact")}
              >
                📞 Contact
              </button>

              <button
                className={styles.mobileNavItem}
                onClick={() => handleNavigation("/my-bookings")}
              >
                My Bookings
              </button>

              {authData?.role?.toUpperCase() === "USER" && (
                <button
                  className={styles.mobileNavItem}
                  onClick={() => handleNavigation("/my-enquiries")}
                >
                  My Journeys
                </button>
              )}
            </div>
          </nav>

          <div className={styles.mobileActions}>
            {!authData && (
              <button
                className={styles.mobileCtaBtn}
                onClick={() => handleNavigation("/login")}
              >
                Sign In / Register
              </button>
            )}

            <button
              className={`${styles.mobileCtaBtn} ${authData ? styles.mobileLogoutBtn : styles.mobileSecondaryBtn}`}
              onClick={
                authData ? handleLogout : () => goToHomeSection("trips-grid")
              }
            >
              {authData ? "Logout" : "Start Booking"}
            </button>

            <div className={styles.mobileContact}>
              <div className={styles.contactTitle}>TRIP OPTIONS</div>
              <span className={styles.contactCount}>
                {tripsCount} tours available
              </span>
              <a href="tel:+919797972175" className={styles.contactPhone}>
                +91 97 97 97 21 75
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
