import { useNavigate } from "react-router-dom";
import { getAuthData, logout } from "../../utils/auth";
import { 
  X, Phone, User as UserIcon, LogOut,
  MapPin, Bike, Globe, Mountain, Heart, Sparkles, Star, Calendar, Users, Compass, ChevronDown, Map, Briefcase, PlusCircle, Building
} from "lucide-react";
import styles from "./MobileNavbar.module.css";
import tpLogo from "../../assets/logog.png";

const NAV_ITEMS = [
  {
    id: "good-friday",
    label: "Good Friday",
    icon: <Calendar size={18} color="#059669" />,
    path: "/good-friday",
    highlight: true,
  },
  {
    id: "new-launches",
    label: "New Launches",
    icon: <Sparkles size={18} color="#0284c7" />,
    path: "/", 
  },
  {
    id: "biking-trips",
    label: "Biking Trips",
    icon: <Bike size={18} color="#475569" />,
    path: "/biking-trips",
    hasDropdown: true,
  },
  {
    id: "backpacking",
    label: "Backpacking Trips",
    icon: <Compass size={18} color="#475569" />,
    path: "/backpacking-trips",
    hasDropdown: true,
  },
  {
    id: "best-sellers",
    label: "Best Sellers",
    icon: <Star size={18} color="#475569" fill="#475569" />,
    path: "/packages",
    hasDropdown: true,
  },
  {
    id: "international",
    label: "International Trips",
    icon: <Globe size={18} color="#475569" />,
    path: "/international-trips",
    hasDropdown: true,
  },
  {
    id: "himalayan",
    label: "Himalayan Treks",
    icon: <Mountain size={18} color="#475569" />,
    path: "/himalayan-trips",
    hasDropdown: true,
  },
  {
    id: "all-girls",
    label: "All Girls Group Tours",
    icon: <Users size={18} color="#475569" />,
    path: "/community-trips",
  },
  {
    id: "mice",
    label: "MICE & Corporate",
    icon: <Building size={18} color="#475569" />,
    path: "/contact",
  },
  {
    id: "domestic",
    label: "Domestic Tours",
    icon: <MapPin size={18} color="#475569" />,
    path: "/india-trips",
    hasDropdown: true,
  },
  {
    id: "upcoming",
    label: "Upcoming Trips",
    icon: <PlusCircle size={18} color="#475569" />,
    path: "/packages",
  },
  {
    id: "more-links",
    label: "More Links",
    icon: <Heart size={18} color="#475569" />,
    path: "/honeymoon-getaways",
    hasDropdown: true,
  },
];

const MobileNavbar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const authData = getAuthData();

  const handleAction = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  return (
    <div 
      className={`${styles.mobileDrawer} ${isOpen ? styles.drawerOpen : ""}`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.drawerContent}>
        
        {/* TOP HEADER */}
        <div className={styles.header}>
          <div className={styles.logoWrap} onClick={() => handleAction("/")}>
            <img src={tpLogo} alt="Travel Professor" className={styles.logo} />
            <div className={styles.brandText}>
              {/* Optional brand text if logo image doesn't include it */}
              <span className={styles.brandTitle}>Travel Professor</span>
              <span className={styles.brandSubtitle}>A SOCIAL TRAVEL COMMUNITY</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <a href="tel:+919797972175" className={styles.iconBtn} aria-label="Call us">
              <Phone size={16} fill="currentColor" strokeWidth={0} />
            </a>
            <button className={styles.iconBtn} onClick={onClose} aria-label="Close menu">
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* USER INFO CARD */}
        <div className={styles.userCardScroll}>
          <div className={styles.userCard}>
            <div className={styles.avatarWrap}>
              {authData ? (
                <span className={styles.avatarLetter}>
                  {authData.username.charAt(0).toUpperCase()}
                </span>
              ) : (
                <UserIcon size={24} color="#3b82f6" />
              )}
            </div>
            <div className={styles.userInfo}>
              {authData ? (
                <>
                  <span className={styles.userName}>{authData.username}</span>
                  <button className={styles.authLink} onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <span className={styles.userName}>Welcome Guest</span>
                  <button className={styles.authLink} onClick={() => handleAction("/login")}>
                    Login / Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* GRID NAV ITEMS */}
        <div className={styles.navGrid}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${item.highlight ? styles.navItemHighlight : ""}`}
              onClick={() => handleAction(item.path)}
            >
              <div className={styles.itemLeft}>
                <div className={styles.itemIcon}>{item.icon}</div>
                <span className={`${styles.itemLabel} ${item.highlight ? styles.itemLabelHighlight : ""}`}>
                  {item.label}
                </span>
              </div>
              {item.hasDropdown && (
                <ChevronDown size={14} className={styles.itemCaret} />
              )}
              {item.highlight && (
                <span className={styles.liveBadge}>LIVE NOW</span>
              )}
            </button>
          ))}
        </div>

        {/* LOCATION & CONTACT SECTION */}
        <div className={styles.footerSection}>
          <div className={styles.locationCard}>
            <p>
              Jammu & Kashmir Office:
              <br />
              Wazir Bagh, Srinagar, Jammu & Kashmir 190008, India
            </p>
          </div>

          <a href="tel:+919797972175" className={styles.contactCard}>
            <div className={styles.contactIconWrap}>
              <Phone size={20} color="#fff" fill="#fff" />
            </div>
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Call Us</span>
              <span className={styles.contactNumber}>+91 97 97 97 21 75</span>
            </div>
          </a>
        </div>
        
      </div>
    </div>
  );
};

export default MobileNavbar;
