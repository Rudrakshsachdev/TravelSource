import styles from "./Navbar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuthData, logout } from "../../utils/auth";
import { useState, useEffect, useRef, useCallback } from "react";
import { fetchNavbarContent } from "../../services/api";
import {
  Search,
  X,
  CloudSun,
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
  Calendar,
} from "lucide-react";
import tpLogo from "../../assets/logog.png";
import { useMagnetic } from "../../hooks/useMagnetic";

const CATEGORY_ICONS = [Sparkles, MapPin, Bike, Globe, Mountain, Heart];
const SECTION_ICONS = {
  international: Globe,
  india: MapPin,
  honeymoon: Heart,
  himalayan: Mountain,
  backpacking: Compass,
  summer: Sparkles,
  monsoon: CloudSun,
  community: Users,
  festival: Star,
  long_weekend: Calendar,
};
const SECTION_LABELS = {
  international: "International Trips",
  india: "India Trips",
  honeymoon: "Honeymoon Getaways",
  himalayan: "Himalayan Treks",
  backpacking: "Backpacking Trips",
  summer: "Summer Treks",
  monsoon: "Monsoon Treks",
  community: "Community Trips",
  festival: "Festival Trips",
  long_weekend: "Long Weekend Trips",
};
const NAV_SECTION_ORDER = [
  "international",
  "india",
  "honeymoon",
  "himalayan",
  "backpacking",
  "summer",
  "monsoon",
  "community",
  "festival",
  "long_weekend",
];
const DESKTOP_PRIMARY_MENU_LIMIT = 4;

const formatMenuHeader = (label) => label.toUpperCase();

const getMenuIcon = (index) => {
  const Icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
  return <Icon size={16} />;
};

const getSectionIcon = (sectionKey) => {
  const Icon = SECTION_ICONS[sectionKey] || Sparkles;
  return <Icon size={16} />;
};

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
  const [activeMoreTripsGroup, setActiveMoreTripsGroup] = useState("");

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

  const [desktopMenus, setDesktopMenus] = useState([]);
  const [searchHints, setSearchHints] = useState([]);
  const [navbarSearchQuery, setNavbarSearchQuery] = useState("");
  const [promoBadge, setPromoBadge] = useState({
    label: "Featured Trips",
    targetTripId: null,
  });
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
    const loadNavbarData = async () => {
      try {
        const {
          trips,
          categories,
          featuredTrips,
          international,
          india,
          honeymoon,
          himalayan,
          backpacking,
          summer,
          monsoon,
          community,
          festival,
          long_weekend,
        } = await fetchNavbarContent();

        setTripsCount(trips.length);

        const sectionPayloads = {
          international,
          india,
          honeymoon,
          himalayan,
          backpacking,
          summer,
          monsoon,
          community,
          festival,
          long_weekend,
        };

        const tripTypeMenus = NAV_SECTION_ORDER.map((sectionKey) => {
          const section = sectionPayloads[sectionKey];
          const sectionTrips = section?.trips || [];
          const sectionLabel = SECTION_LABELS[sectionKey] || "Trips";
          const sectionHeader = section?.config?.title || sectionLabel;

          return {
            key: sectionKey,
            label: sectionLabel,
            header: formatMenuHeader(sectionHeader),
            submenu: sectionTrips.slice(0, 6).map((trip) => ({
              id: trip.id,
              icon: getSectionIcon(sectionKey),
              label: trip.title,
              desc:
                trip.location ||
                trip.state ||
                trip.country ||
                trip.short_description ||
                "Explore trip",
              path: `/trips/${trip.id}`,
            })),
            footer: {
              label: `View all ${sectionLabel}`,
              sectionKey,
            },
          };
        }).filter((menu) => menu.submenu.length > 0);

        const categoryMenus = categories
          .map((category, index) => {
            const categoryTrips = trips
              .filter((trip) => trip.category?.slug === category.slug)
              .slice(0, 6);

            return {
              key: category.slug,
              label: category.name,
              header: formatMenuHeader(category.name),
              submenu: categoryTrips.map((trip) => ({
                id: trip.id,
                icon: getMenuIcon(index),
                label: trip.title,
                desc: trip.location || trip.short_description || "Explore trip",
                path: `/trips/${trip.id}`,
              })),
              footer: {
                label: `View all ${category.name}`,
                categorySlug: category.slug,
              },
            };
          })
          .filter((menu) => menu.submenu.length > 0);

        setDesktopMenus([...tripTypeMenus, ...categoryMenus]);

        const hintSet = new Set();
        [
          ...featuredTrips.map((trip) => trip.location || trip.title),
          ...NAV_SECTION_ORDER.map(
            (sectionKey) => sectionPayloads[sectionKey]?.config?.title,
          ),
          ...categories.map((category) => category.name),
          ...trips.map((trip) => trip.location),
        ].forEach((value) => {
          if (value && hintSet.size < 7) {
            hintSet.add(value);
          }
        });

        setSearchHints(Array.from(hintSet));

        setPromoBadge({
          label:
            SECTION_LABELS.festival ||
            featuredTrips[0]?.title ||
            "Featured Trips",
          targetTripId:
            festival?.trips?.[0]?.id || featuredTrips[0]?.id || null,
        });
      } catch (err) {
        console.error("Failed to load navbar content:", err);
      }
    };

    loadNavbarData();

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

  const go = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setActiveMobileGroup("");
    setActiveHover("");
    setIsUserDropdownOpen(false);
    setIsSearchOpen(false);
  };

  const handleDesktopHover = (e, key) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    if (pillTimeoutRef.current) clearTimeout(pillTimeoutRef.current);
    setActiveHover(key);
    if (
      key === "more-trips" &&
      !activeMoreTripsGroup &&
      overflowDesktopMenus[0]
    ) {
      setActiveMoreTripsGroup(overflowDesktopMenus[0].key);
    }

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

  const goToSection = (sectionId) => {
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
  };

  const submitNavbarSearch = (rawQuery) => {
    const query = rawQuery.trim();

    setIsMenuOpen(false);
    setActiveHover("");
    setActiveMobileGroup("");
    setIsSearchOpen(false);

    if (location.pathname !== "/") {
      navigate({
        pathname: "/",
        search: query ? `?search=${encodeURIComponent(query)}` : "",
      });
    } else {
      navigate({
        pathname: "/",
        search: query ? `?search=${encodeURIComponent(query)}` : "",
      });
    }

    setTimeout(
      () => {
        const el = document.getElementById("trips-grid");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      },
      location.pathname !== "/" ? 400 : 80,
    );
  };

  const primaryDesktopMenus = desktopMenus.slice(0, DESKTOP_PRIMARY_MENU_LIMIT);
  const overflowDesktopMenus = desktopMenus.slice(DESKTOP_PRIMARY_MENU_LIMIT);
  const activeMoreTripsMenu =
    overflowDesktopMenus.find((menu) => menu.key === activeMoreTripsGroup) ||
    overflowDesktopMenus[0] ||
    null;
  const desktopMenusToRender = overflowDesktopMenus.length
    ? [
        ...primaryDesktopMenus,
        {
          key: "more-trips",
          label: "More Trips",
          header: "MORE TRIP TYPES",
          sections: overflowDesktopMenus,
          footer: {
            label: "Browse all trips",
          },
        },
      ]
    : primaryDesktopMenus;

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
                  onClick={() =>
                    promoBadge.targetTripId
                      ? go(`/trips/${promoBadge.targetTripId}`)
                      : goToSection("trips-grid")
                  }
                  role="menuitem"
                  aria-label={`${promoBadge.label} — featured offers`}
                >
                  {promoBadge.label}
                  <span className={styles.liveBadge} aria-label="Live now">
                    LIVE NOW
                  </span>
                </button>
              </li>

              <li className={styles.navItem} role="none">
                <button
                  className={styles.navLink}
                  onClick={() => go("/packages")}
                  role="menuitem"
                >
                  Packages
                </button>
              </li>

              {/* Menu items with mega dropdowns */}
              {desktopMenusToRender.map((menu) => (
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
                      className={`${styles.dropdown} ${menu.key === "more-trips" ? styles.moreTripsDropdown : ""}`}
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

                      {menu.key === "more-trips" ? (
                        <div className={styles.moreTripsLayout}>
                          <div className={styles.moreTripsSectionList}>
                            {menu.sections.map((section, i) => (
                              <button
                                key={section.key}
                                className={`${styles.moreTripsSectionButton} ${activeMoreTripsMenu?.key === section.key ? styles.moreTripsSectionButtonActive : ""}`}
                                style={{ "--stagger-delay": `${i * 30}ms` }}
                                onMouseEnter={() =>
                                  setActiveMoreTripsGroup(section.key)
                                }
                                onFocus={() =>
                                  setActiveMoreTripsGroup(section.key)
                                }
                                onClick={() =>
                                  setActiveMoreTripsGroup(section.key)
                                }
                                role="menuitem"
                              >
                                <span className={styles.dropdownIcon}>
                                  {section.submenu[0]?.icon || (
                                    <Compass size={16} />
                                  )}
                                </span>
                                <span className={styles.dropdownItemText}>
                                  <span className={styles.dropdownItemLabel}>
                                    {section.label}
                                  </span>
                                  <span className={styles.dropdownItemDesc}>
                                    {section.submenu.length} curated trips
                                  </span>
                                </span>
                              </button>
                            ))}
                          </div>

                          <div className={styles.moreTripsItemsPanel}>
                            <div className={styles.moreTripsItemsHeader}>
                              <span>
                                {activeMoreTripsMenu?.label || "Trips"}
                              </span>
                              <button
                                className={styles.moreTripsViewAll}
                                onClick={() => goToSection("trips-grid")}
                                role="menuitem"
                              >
                                View all
                                <ArrowRight size={14} />
                              </button>
                            </div>

                            {activeMoreTripsMenu?.submenu.map((item, i) => (
                              <button
                                key={`${activeMoreTripsMenu.key}-${item.id ?? item.label}`}
                                className={styles.dropdownItem}
                                style={{ "--stagger-delay": `${i * 30}ms` }}
                                onClick={() => go(item.path)}
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
                          </div>
                        </div>
                      ) : (
                        menu.submenu.map((item, i) => (
                          <button
                            key={`${menu.key}-${item.id ?? item.label}`}
                            className={styles.dropdownItem}
                            style={{ "--stagger-delay": `${i * 30}ms` }}
                            onClick={() => go(item.path)}
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
                        ))
                      )}

                      {menu.footer && menu.key !== "more-trips" && (
                        <>
                          <div className={styles.dropdownDivider} />
                          <button
                            className={styles.dropdownFooter}
                            onClick={() =>
                              menu.footer.categorySlug
                                ? goToSection("trips-grid")
                                : goToSection("trips-grid")
                            }
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
                        My Enquiries
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
              value={navbarSearchQuery}
              onChange={(e) => setNavbarSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitNavbarSearch(navbarSearchQuery);
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
                  setNavbarSearchQuery(hint);
                  submitNavbarSearch(hint);
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
              <button className={styles.mobileNavTitle} onClick={() => go("/packages")}>
                ✨ Packages
              </button>
              {desktopMenus.map((menu) => (
                <div key={menu.key}>
                  <button
                    className={styles.mobileNavTitle}
                    onClick={() =>
                      setActiveMobileGroup((prev) =>
                        prev === menu.key ? "" : menu.key,
                      )
                    }
                    aria-expanded={activeMobileGroup === menu.key}
                  >
                    {menu.label}
                  </button>

                  {activeMobileGroup === menu.key &&
                    menu.submenu.map((item) => (
                      <button
                        key={`${menu.key}-${item.id}`}
                        className={styles.mobileNavItem}
                        onClick={() => go(item.path)}
                      >
                        {item.label}
                      </button>
                    ))}
                </div>
              ))}
            </div>

            <div className={styles.mobileNavSection}>
              <button
                className={styles.mobileNavTitle}
                onClick={() => goToSection("trips-grid")}
              >
                View All Trips
              </button>
              {searchHints.slice(0, 4).map((hint) => (
                <button
                  key={hint}
                  className={styles.mobileNavItem}
                  onClick={() => goToSection("trips-grid")}
                >
                  {hint}
                </button>
              ))}
            </div>

            <div className={styles.mobileNavSection}>
              <button
                className={styles.mobileNavTitle}
                onClick={() => go("/contact")}
              >
                Contact Us
              </button>

              {authData?.role?.toUpperCase() === "USER" && (
                <button
                  className={styles.mobileNavTitle}
                  onClick={() => go("/my-enquiries")}
                >
                  My Journeys
                </button>
              )}

              {authData && (
                <button
                  className={styles.mobileNavTitle}
                  onClick={() => go("/my-bookings")}
                >
                  My Bookings
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
