// import { Outlet, useNavigate } from "react-router-dom";
// import { logout } from "../utils/auth";
// import styles from "./AdminLayout.module.css";

// const AdminLayout = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div className={styles.wrapper}>
//       {/* SIDEBAR */}
//       <aside className={styles.sidebar}>
//         <div className={styles.brand}>
//           Travel Professor
//           <span>Admin</span>
//         </div>

//         <nav className={styles.menu}>
//           <button type="button" onClick={() => navigate("/admin")}>
//             Dashboard
//           </button>

//           <button type="button" onClick={() => navigate("/admin/enquiries")}>
//             Enquiries
//           </button>

//           <button type="button" onClick={() => navigate("/admin/trips")}>
//             Trips
//           </button>
//         </nav>

//         <button
//           type="button"
//           className={styles.logout}
//           onClick={handleLogout}
//         >
//           Logout
//         </button>
//       </aside>

//       {/* MAIN */}
//       <div className={styles.main}>
//         <header className={styles.header}>
//           <h2>Admin Dashboard</h2>
//         </header>

//         <main className={styles.content}>
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;




import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/auth";
import styles from "./AdminLayout.module.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const getPageTitle = () => {
    if (location.pathname === "/admin") return "Dashboard";
    if (location.pathname === "/admin/enquiries") return "Enquiries";
    if (location.pathname === "/admin/trips") return "Trips";
    if (location.pathname === "/admin/settings") return "Settings";
    if (location.pathname === "/admin/users") return "Users";
    if (location.pathname === "/admin/analytics") return "Analytics";
    return "Dashboard";
  };

  return (
    <div className={styles.wrapper}>
      {/* Background Overlay */}
      <div className={styles.backgroundOverlay}></div>

      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className={styles.brandContent}>
              <span className={styles.brandTitle}>Travel Professor</span>
              <span className={styles.brandSubtitle}>Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className={styles.menu}>
          <button
            type="button"
            className={`${styles.menuButton} ${isActive("/admin") && !isActive("/admin/enquiries") && !isActive("/admin/trips") ? styles.active : ""}`}
            onClick={() => navigate("/admin")}
          >
            <span className={styles.menuIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </span>
            <span className={styles.menuText}>Dashboard</span>
            <svg className={styles.menuArrow} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            type="button"
            className={`${styles.menuButton} ${isActive("/admin/enquiries") ? styles.active : ""}`}
            onClick={() => navigate("/admin/enquiries")}
          >
            <span className={styles.menuIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
              </svg>
            </span>
            <span className={styles.menuText}>Enquiries</span>
            <span className={styles.menuBadge}>24</span>
          </button>

          <button
            type="button"
            className={`${styles.menuButton} ${isActive("/admin/trips") ? styles.active : ""}`}
            onClick={() => navigate("/admin/trips")}
          >
            <span className={styles.menuIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </span>
            <span className={styles.menuText}>Trips</span>
          </button>

          <div className={styles.menuDivider}></div>

          <button
            type="button"
            className={`${styles.menuButton} ${isActive("/admin/settings") ? styles.active : ""}`}
            onClick={() => navigate("/admin/settings")}
          >
            <span className={styles.menuIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </span>
            <span className={styles.menuText}>Settings</span>
          </button>

          <button
            type="button"
            className={`${styles.menuButton} ${isActive("/admin/users") ? styles.active : ""}`}
            onClick={() => navigate("/admin/users")}
          >
            <span className={styles.menuIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </span>
            <span className={styles.menuText}>Users</span>
            <span className={styles.menuBadge}>3</span>
          </button>

          <button
            type="button"
            className={`${styles.menuButton} ${isActive("/admin/analytics") ? styles.active : ""}`}
            onClick={() => navigate("/admin/contact-messages")}
          >
            <span className={styles.menuIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </span>
            <span className={styles.menuText}>Contact Messages</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>Admin User</span>
              <span className={styles.userRole}>Super Admin</span>
            </div>
            <button className={styles.userMenu}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            <svg className={styles.logoutIcon} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            <span className={styles.logoutText}>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.pageTitle}>{getPageTitle()}</h2>
            <p className={styles.pageSubtitle}>
              Welcome back, Admin User. Here's what's happening today.
            </p>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.notificationButton}>
              <svg className={styles.notificationIcon} viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span className={styles.notificationBadge}>3</span>
            </button>
            <button className={styles.helpButton}>
              <svg className={styles.helpIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Help
            </button>
            <div className={styles.currentTime}>
              <svg className={styles.timeIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <span className={styles.footerText}>© 2026 Travel Professor Admin. All rights reserved.</span>
            <div className={styles.footerLinks}>
              <button className={styles.footerLink}>Privacy Policy</button>
              <button className={styles.footerLink}>Terms of Service</button>
              <button className={styles.footerLink}>Support</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;