import styles from "./Navbar.module.css";
import {useNavigate} from "react-router-dom";
import {getAuthData, logout} from "../../utils/auth";

const Navbar = () => {
    const navigate = useNavigate();
    const authData = getAuthData();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handlePrimaryAction = () => {
      authData ? handleLogout() : navigate("/login");
    };

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.logo} onClick={() => navigate("/")}>
            <span className={styles.logoPrimary}>Travel</span>
            <span className={styles.logoAccent}>Professor</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {authData && (
            <span className={styles.userGreeting}>
              Hi, <span className={styles.username}>{authData.username}</span>
            </span>
          )}
          <button className={styles.loginBtn} onClick={handlePrimaryAction}>
            <span className={styles.btnText}>{authData ? "Logout" : "Get Started"}</span>
            <span className={styles.btnIcon}>
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.16699 10H15.8337" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.833 5L15.833 10L10.833 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;