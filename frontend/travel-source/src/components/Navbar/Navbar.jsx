import styles from "./Navbar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuthData, logout } from "../../utils/auth";
import { useState, useEffect, useRef, useCallback } from "react";
import { fetchTrips } from "../../services/api";
import {
  Search,
  X,
  Phone,
  User,
  LogOut,
  BookOpen,
  Compass,
  MapPin,
  Mountain,
  Mail,
  Shield,
  FileText,
  Star,
  Users,
  ArrowRight,
  Bike,
  Globe,
  Heart,
  Sparkles,
} from "lucide-react";
import tpLogo from "../../assets/logog.png";
import { useMagnetic } from "../../hooks/useMagnetic";

/* ═══════════════════════════════════════════════════════════════
   Navbar — Production-Level | Travel Professor
   Mega-menus · Keyboard A11y · Micro-interactions · ⌘K Search
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

  // Floating pill state
  const [pillStyle, setPillStyle] = useState({ opacity: 0, left: 0, width: 0 });

  const menuRef = useRef(null);
  const navContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const userDropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);
  const pillTimeoutRef = useRef(null);
  const rafRef = useRef(null);

  // Magnetic refs
  const magneticPhone = useMagnetic(0.25);
  const magneticSearch = useMagnetic(0.2);
  const magneticLogin = useMagnetic(0.15);

  const [destinations, setDestinations] = useState([]);
  const [tripsCount, setTripsCount] = useState(0);

  /* ── Scroll with rAF throttle ── */
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > 10);
      rafRef.current = null;
    });
  }, []);

  /* ── Body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isSearchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isSearchOpen]);

  /* ── Load data + global listeners ── */
  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const trips = await fetchTrips();
        setTripsCount(trips.length);

        const unique = [];
        const seen = new Set();
        trips.forEach((trip) => {
          if (!seen.has(trip.location)) {
            seen.add(trip.location);
            unique.push({
              id: trip.id,
              name: trip.location,
              country: trip.country || "Destination",
            });
          }
        });
        setDestinations(unique.slice(0, 6));
      } catch (err) {
        console.error("Failed to load navbar destinations:", err);
      }
    };

    loadDestinations();

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsUserDropdownOpen(false);
        setActiveHover("");
      }
      // ⌘K / Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
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
      if (pillTimeoutRef.current) clearTimeout(pillTimeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  /* ── Auto-focus search input ── */
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [isSearchOpen]);

  /* ── Navigation helpers ── */
  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  const go = useCallback(
    (path) => {
      navigate(path);
      setIsMenuOpen(false);
      setActiveMobileGroup("");
      setActiveHover("");
      setIsUserDropdownOpen(false);
      setIsSearchOpen(false);
    },
    [navigate],
  );

  const handleDesktopHover = (e, key) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    if (pillTimeoutRef.current) clearTimeout(pillTimeoutRef.current);
    setActiveHover(key);

    // Update floating pill position
    if (e.currentTarget && navContainerRef.current) {
      const elRect = e.currentTarget.getBoundingClientRect();
      const containerRect = navContainerRef.current.getBoundingClientRect();
      setPillStyle({
        opacity: 1,
        left: elRect.left - containerRect.left,
        width: elRect.width,
      });
    }
  };

  const handleDesktopLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveHover(""), 220);
    pillTimeoutRef.current = setTimeout(
      () => setPillStyle({ ...pillStyle, opacity: 0 }),
      250,
    );
  };

  const goToSection = useCallback(
    (sectionId) => {
      if (location.pathname !== "/") navigate("/");
      setIsMenuOpen(false);
      setActiveHover("");
      setActiveMobileGroup("");
      setIsSearchOpen(false);

      const delay = location.pathname !== "/" ? 400 : 50;
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, delay);
    },
    [location.pathname, navigate],
  );

  /* ── Keyboard navigation for dropdowns ── */
  const handleNavKeyDown = (e, menuKey) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveHover((prev) => (prev === menuKey ? "" : menuKey));
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveHover(menuKey);
    }
    if (e.key === "Escape") {
      setActiveHover("");
    }
  };

  /* ═══ MEGA-MENU STRUCTURE ═══ */
  const desktopMenus = [
    {
      key: "backpacking",
      label: "Backpacking Trips",
      header: "EXPLORE TRIPS",
      submenu: [
        {
          icon: <Sparkles size={16} />,
          label: "Featured Tours",
          desc: "Our most loved trips",
          action: () => goToSection("trips-grid"),
        },
        {
          icon: <Globe size={16} />,
          label: "All Destinations",
          desc: "Browse every location",
          action: () => goToSection("trips-grid"),
        },
        {
          icon: <BookOpen size={16} />,
          label: "My Bookings",
          desc: "View your reservations",
          action: () => go("/my-bookings"),
        },
      ],
      footer: {
        label: "View all trips",
        action: () => goToSection("trips-grid"),
      },
    },
    {
      key: "bestsellers",
      label: "Best Sellers",
      header: "TOP DESTINATIONS",
      submenu: destinations.map((dest) => ({
        icon: <MapPin size={16} />,
        label: dest.name,
        desc: dest.country,
        action: () => go(`/trips/${dest.id}`),
      })),
      footer: {
        label: "See all destinations",
        action: () => goToSection("trips-grid"),
      },
    },
    {
      key: "biking",
      label: "Biking Trips",
      header: "ADVENTURE RIDES",
      submenu: [
        {
          icon: <Mountain size={16} />,
          label: "Mountain Rides",
          desc: "High-altitude thrills",
          action: () => goToSection("trips-grid"),
        },
        {
          icon: <Users size={16} />,
          label: "Group Expeditions",
          desc: "Ride with a crew",
          action: () => goToSection("trips-grid"),
        },
        {
          icon: <Heart size={16} />,
          label: "Solo Adventures",
          desc: "Go at your own pace",
          action: () => goToSection("trips-grid"),
        },
        {
          icon: <Mail size={16} />,
          label: "Trip Concierge",
          desc: "Expert help & planning",
          action: () => go("/contact"),
        },
      ],
    },
    {
      key: "more",
      label: "More",
      header: "RESOURCES",
      submenu: [
        {
          icon: <Compass size={16} />,
          label: "Contact Us",
          desc: "Get in touch anytime",
          action: () => go("/contact"),
        },
        {
          icon: <FileText size={16} />,
          label: "Terms of Service",
          desc: "Rules & agreements",
          action: () => go("/terms"),
        },
        {
          icon: <Shield size={16} />,
          label: "Privacy Policy",
          desc: "Your data matters",
          action: () => go("/privacy"),
        },
        {
          icon: <FileText size={16} />,
          label: "Refund Policy",
          desc: "Returns & cancellation",
          action: () => go("/refund-policy"),
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

  /* ═══ RENDER ═══ */
  return (
    <>
      <header
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}
        role="banner"
      >
        <div className={styles.container}>
          {/* ── Logo ── */}
          <div
            className={styles.logoContainer}
            onClick={() => go("/")}
            onKeyDown={(e) => e.key === "Enter" && go("/")}
            tabIndex={0}
            role="link"
            aria-label="Travel Professor — Home"
          >
            <img
              src={tpLogo}
              alt="Travel Professor"
              className={styles.logoImg}
            />
          </div>

          {/* ── Desktop Nav ── */}
          <nav className={styles.navDesktop} aria-label="Main navigation">
            <ul
              className={styles.navLinks}
              role="menubar"
              ref={navContainerRef}
              onMouseLeave={handleDesktopLeave}
            >
              {/* Floating Pill Background */}
              <div
                className={styles.navPill}
                style={{
                  opacity: pillStyle.opacity,
                  transform: `translateX(${pillStyle.left}px)`,
                  width: `${pillStyle.width}px`,
                }}
                aria-hidden="true"
              />

              {/* Good Friday badge */}
              <li className={styles.navItem} role="none">
                <button
                  className={styles.highlightBadge}
                  onClick={() => goToSection("trips-grid")}
                  role="menuitem"
                  aria-label="Good Friday — Live deals"
                >
                  Good Friday
                  <span className={styles.liveBadge} aria-label="Live now">
                    LIVE NOW
                  </span>
                </button>
              </li>

              {/* Menu items with mega dropdowns */}
              {desktopMenus.map((menu) => (
                <li
                  key={menu.key}
                  className={styles.navItem}
                  role="none"
                  onMouseEnter={(e) => handleDesktopHover(e, menu.key)}
                >
                  <button
                    className={styles.navLink}
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={activeHover === menu.key}
                    onClick={() =>
                      setActiveHover((prev) =>
                        prev === menu.key ? "" : menu.key,
                      )
                    }
                    onKeyDown={(e) => handleNavKeyDown(e, menu.key)}
                  >
                    {menu.label}
                    <span className={styles.caret} aria-hidden="true" />
                  </button>

                  {/* Mega dropdown */}
                  {activeHover === menu.key && (
                    <div
                      className={styles.dropdown}
                      role="menu"
                      aria-label={menu.label}
                    >
                      {menu.header && (
                        <div
                          className={styles.dropdownHeader}
                          aria-hidden="true"
                        >
                          {menu.header}
                        </div>
                      )}

                      {menu.submenu.map((item, i) => (
                        <button
                          key={`${menu.key}-${item.label}`}
                          className={styles.dropdownItem}
                          style={{ "--stagger-delay": `${i * 30}ms` }}
                          onClick={item.action}
                          role="menuitem"
                        >
                          <span className={styles.dropdownIcon}>
                            {item.icon}
                          </span>
                          <span className={styles.dropdownItemText}>
                            <span className={styles.dropdownItemLabel}>
                              {item.label}
                            </span>
                            {item.desc && (
                              <span className={styles.dropdownItemDesc}>
                                {item.desc}
                              </span>
                            )}
                          </span>
                        </button>
                      ))}

                      {menu.footer && (
                        <>
                          <div className={styles.dropdownDivider} />
                          <button
                            className={styles.dropdownFooter}
                            onClick={menu.footer.action}
                            role="menuitem"
                          >
                            {menu.footer.label}
                            <ArrowRight size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* ── Right Actions ── */}
            <div className={styles.rightActions}>
              {/* Phone CTA */}
              <a
                href="tel:+919797972175"
                className={styles.phoneCta}
                ref={magneticPhone}
                aria-label="Call us at +91 97 97 97 21 75"
              >
                <span className={styles.phoneIconWrap} aria-hidden="true">
                  <Phone size={14} strokeWidth={2} />
                </span>
                <span className={styles.phoneTextWrap}>
                  <span className={styles.phoneLabel}>Call Us</span>
                  <span className={styles.phoneNumber}>+91 97 97 97 21 75</span>
                </span>
              </a>

              {/* Search — ⌘K */}
              <button
                className={styles.searchBtn}
                ref={magneticSearch}
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search (Ctrl+K)"
                title="Search (Ctrl+K)"
              >
                <Search size={18} strokeWidth={2.5} />
              </button>

              {/* Auth button */}
              {authData ? (
                <div
                  className={styles.navItem}
                  ref={userDropdownRef}
                  style={{ position: "relative" }}
                >
                  <button
                    className={styles.userBtn}
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    aria-haspopup="true"
                    aria-expanded={isUserDropdownOpen}
                    aria-label="Account menu"
                  >
                    <span className={styles.userAvatar} aria-hidden="true">
                      {authData.username.charAt(0).toUpperCase()}
                    </span>
                    <span className={styles.userName}>{authData.username}</span>
                    <span className={styles.userCaret} aria-hidden="true" />
                  </button>

                  {isUserDropdownOpen && (
                    <div
                      className={styles.userDropdown}
                      role="menu"
                      aria-label="User menu"
                    >
                      <button
                        className={styles.userDropdownItem}
                        onClick={() => go("/my-enquiries")}
                        role="menuitem"
                      >
                        <User size={16} />
                        My Journeys
                      </button>
                      <button
                        className={styles.userDropdownItem}
                        onClick={() => go("/my-bookings")}
                        role="menuitem"
                      >
                        <BookOpen size={16} />
                        My Bookings
                      </button>
                      <div className={styles.userDivider} role="separator" />
                      <button
                        className={`${styles.userDropdownItem} ${styles.logoutItem}`}
                        onClick={handleLogout}
                        role="menuitem"
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
                  ref={magneticLogin}
                  onClick={() => go("/login")}
                >
                  Login
                </button>
              )}
            </div>
          </nav>

          {/* ── Mobile Controls ── */}
          <div className={styles.mobileControls}>
            <button
              className={styles.mobileSearchBar}
              onClick={() => {
                setIsMenuOpen(false);
                setIsSearchOpen(true);
              }}
              aria-label="Search destinations"
              title="Search"
            >
              <Search size={16} strokeWidth={2.2} />
              <span className={styles.mobileSearchText}>Search trips</span>
            </button>

            <button
              className={`${styles.mobileMenuToggle} ${isMenuOpen ? styles.active : ""}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              <span className={styles.toggleText}>MENU</span>
              <div className={styles.toggleLines} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ═══ ⌘K SEARCH OVERLAY ═══ */}
      <div
        className={`${styles.searchOverlay} ${isSearchOpen ? styles.active : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsSearchOpen(false);
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Search destinations"
      >
        <div className={styles.searchModal}>
          <div className={styles.searchInputWrap}>
            <Search size={20} strokeWidth={2} aria-hidden="true" />
            <input
              ref={searchInputRef}
              className={styles.searchInput}
              type="text"
              placeholder="Search destinations, trips, activities…"
              aria-label="Search"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsSearchOpen(false);
                  goToSection("trips-grid");
                }
              }}
            />
            <button
              className={styles.searchClose}
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search"
            >
              ESC
            </button>
          </div>
          <div className={styles.searchHintsLabel}>Trending</div>
          <div className={styles.searchHints} role="list">
            {searchHints.map((hint) => (
              <button
                key={hint}
                className={styles.searchHint}
                role="listitem"
                onClick={() => {
                  setIsSearchOpen(false);
                  goToSection("trips-grid");
                }}
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ MOBILE DRAWER ═══ */}
      <div
        id="mobile-nav-drawer"
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <button
          className={styles.mobileCloseBtn}
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
          title="Close"
        >
          <X size={18} strokeWidth={2.4} />
        </button>

        <div className={styles.mobileMenuContainer} ref={menuRef}>
          {/* User greeting */}
          <div className={styles.mobileHeader}>
            <div className={styles.mobileUser}>
              {authData ? (
                <>
                  <div className={styles.mobileAvatar} aria-hidden="true">
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

          {/* Mobile nav */}
          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            <div className={styles.mobileNavSection}>
              <button className={styles.mobileNavTitle} onClick={() => go("/")}>
                🏠 Home
              </button>
              <button
                className={styles.mobileNavTitle}
                onClick={() => goToSection("trips-grid")}
              >
                🎒 Backpacking Trips
              </button>
              <button
                className={styles.mobileNavTitle}
                onClick={() =>
                  setActiveMobileGroup((p) =>
                    p === "destinations" ? "" : "destinations",
                  )
                }
                aria-expanded={activeMobileGroup === "destinations"}
              >
                ⭐ Best Sellers
              </button>

              {activeMobileGroup === "destinations" &&
                destinations.map((dest) => (
                  <button
                    key={dest.id}
                    className={styles.mobileNavItem}
                    onClick={() => go(`/trips/${dest.id}`)}
                  >
                    {dest.name}
                  </button>
                ))}
            </div>

            <div className={styles.mobileNavSection}>
              <button
                className={styles.mobileNavTitle}
                onClick={() => goToSection("trips-grid")}
              >
                🚴 Biking Trips
              </button>
              <button
                className={styles.mobileNavTitle}
                onClick={() => go("/contact")}
              >
                📞 Contact Us
              </button>
              <button
                className={styles.mobileNavTitle}
                onClick={() => go("/my-bookings")}
              >
                📋 My Bookings
              </button>

              {authData?.role?.toUpperCase() === "USER" && (
                <button
                  className={styles.mobileNavTitle}
                  onClick={() => go("/my-enquiries")}
                >
                  🗺️ My Journeys
                </button>
              )}
            </div>
          </nav>

          {/* Mobile actions */}
          <div className={styles.mobileActions}>
            {!authData && (
              <button
                className={styles.mobileCtaBtn}
                onClick={() => go("/login")}
              >
                Sign In / Register
              </button>
            )}

            <button
              className={`${styles.mobileCtaBtn} ${authData ? styles.mobileLogoutBtn : styles.mobileSecondaryBtn}`}
              onClick={
                authData ? handleLogout : () => goToSection("trips-grid")
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
                📞 +91 97 97 97 21 75
              </a>
              <a
                href="mailto:concierge@travelprofessor.com"
                className={styles.contactEmail}
              >
                ✉️ concierge@travelprofessor.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`${styles.menuOverlay} ${isMenuOpen ? styles.active : ""}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />
    </>
  );
};

export default Navbar;
