import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/api";
import styles from "./Login.module.css";
import heroImg from "../../assets/login-hero.png";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      // Store auth data
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);

      // Role-based redirect
      if (data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.loginPage}>
      {/* ── Background Decorative Circles ── */}
      <div className={styles.bgDecorCircle1} />
      <div className={styles.bgDecorCircle2} />
      <div className={styles.bgDecorCircle3} />
      <div className={styles.bgDecorCircle4} />

      {/* ── Split Card ── */}
      <div className={styles.splitCard}>
        {/* ── Left Panel — Image & Branding ── */}
        <div className={styles.leftPanel}>
          <img
            src={heroImg}
            alt="Traveler on mountain cliff"
            className={styles.leftPanelImage}
          />
          <div className={styles.leftPanelOverlay} />
          <div className={styles.leftPanelContent}>
            <h2 className={styles.brandName}>Travel Professor</h2>
            <p className={styles.brandTagline}>
              Travel is the only purchase that enriches you in ways beyond
              material wealth
            </p>
          </div>
        </div>

        {/* ── Right Panel — Login Form ── */}
        <div className={styles.rightPanel}>
          {/* Airplane Decorative Path */}
          <div className={styles.airplanePath}>
            <svg viewBox="0 0 200 100" fill="none">
              {/* Dashed arc path */}
              <path
                d="M10 80 Q60 10 120 30 Q160 45 185 15"
                stroke="#00b4d8"
                strokeWidth="2"
                strokeDasharray="6 5"
                fill="none"
                opacity="0.5"
              />
              {/* Airplane icon at end */}
              <g transform="translate(180, 8) rotate(-35)">
                <path
                  d="M0 6 L4 0 L8 6 L5 5 L5 12 L3 12 L3 5 Z"
                  fill="#00b4d8"
                  opacity="0.8"
                />
              </g>
            </svg>
          </div>

          {/* Form Header */}
          <div className={styles.formHeader}>
            <h1 className={styles.welcomeTitle}>Welcome</h1>
            <p className={styles.welcomeSubtitle}>Login with Email</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className={styles.errorContainer}>
              <svg
                className={styles.errorIcon}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className={styles.error}>{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Email / Username Field */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="login-email">
                Email id
              </label>
              <div className={styles.inputWrapper}>
                <div className={styles.inputIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <path d="M22 7L12 13L2 7" />
                  </svg>
                </div>
                <input
                  id="login-email"
                  type="text"
                  name="username"
                  placeholder="thisuix@mail.com"
                  className={styles.input}
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="login-password">
                Password
              </label>
              <div className={styles.inputWrapper}>
                <div className={styles.inputIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••••••"
                  className={styles.input}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className={styles.forgotRow}>
              <button
                type="button"
                className={styles.forgotLink}
                onClick={() => navigate("/forgot-password")}
                disabled={loading}
              >
                Forgot your password?
              </button>
            </div>

            {/* Login Button */}
            <button
              className={`${styles.button} ${loading ? styles.buttonLoading : ""}`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.loadingSpinner}></span>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>LOGIN</span>
              )}
            </button>

            {/* OR Divider */}
            <div className={styles.divider}>
              <span className={styles.dividerText}>OR</span>
            </div>

            {/* Social Login Buttons */}
            <div className={styles.socialRow}>
              {/* Google */}
              <button
                type="button"
                className={`${styles.socialBtn} ${styles.socialBtnGoogle}`}
                aria-label="Sign in with Google"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </button>

              {/* Facebook */}
              <button
                type="button"
                className={`${styles.socialBtn} ${styles.socialBtnFacebook}`}
                aria-label="Sign in with Facebook"
              >
                <svg viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              {/* Apple */}
              <button
                type="button"
                className={`${styles.socialBtn} ${styles.socialBtnApple}`}
                aria-label="Sign in with Apple"
              >
                <svg viewBox="0 0 24 24" fill="#000000">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </button>
            </div>

            {/* Register Footer */}
            <div className={styles.footerRegister}>
              <p>
                Don't have account?{" "}
                <Link to="/signup" className={styles.registerLink}>
                  Register Now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* ── Bottom Decorative Elements ── */}
      <div className={styles.bottomDecor}>
        {/* Landmark Silhouettes */}
        <div className={styles.landmarkSilhouettes}>
          <svg viewBox="0 0 900 120" preserveAspectRatio="xMidYMax meet">
            <defs>
              <linearGradient id="landmarkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0077b6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#005f8a" stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* Grass/ground */}
            <rect x="0" y="100" width="900" height="20" fill="url(#landmarkGrad)" />
            {/* Taj Mahal */}
            <g transform="translate(350, 0)" fill="url(#landmarkGrad)">
              <rect x="35" y="40" width="30" height="60" />
              <ellipse cx="50" cy="40" rx="20" ry="25" />
              <rect x="46" y="15" width="8" height="25" />
              <rect x="15" y="60" width="8" height="40" />
              <rect x="77" y="60" width="8" height="40" />
              <ellipse cx="19" cy="60" rx="6" ry="8" />
              <ellipse cx="81" cy="60" rx="6" ry="8" />
            </g>
            {/* Mosque / Dome */}
            <g transform="translate(520, 20)" fill="url(#landmarkGrad)">
              <rect x="10" y="40" width="60" height="40" />
              <ellipse cx="40" cy="40" rx="30" ry="22" />
              <rect x="36" y="18" width="8" height="22" />
              <rect x="-5" y="20" width="8" height="60" rx="2" />
              <rect x="77" y="20" width="8" height="60" rx="2" />
            </g>
            {/* Tower/Minaret */}
            <g transform="translate(680, 10)" fill="url(#landmarkGrad)">
              <rect x="15" y="20" width="20" height="70" />
              <polygon points="25,0 40,20 10,20" />
              <rect x="10" y="45" width="30" height="4" />
              <rect x="10" y="60" width="30" height="4" />
            </g>
            {/* Small dome */}
            <g transform="translate(250, 50)" fill="url(#landmarkGrad)">
              <rect x="5" y="20" width="40" height="30" />
              <ellipse cx="25" cy="20" rx="20" ry="15" />
              <rect x="22" y="5" width="6" height="15" />
            </g>
            {/* Leaning structure */}
            <g transform="translate(150, 40)" fill="url(#landmarkGrad)">
              <rect x="10" y="10" width="16" height="50" rx="2" />
              <rect x="8" y="10" width="20" height="6" />
              <rect x="8" y="22" width="20" height="4" />
              <rect x="8" y="32" width="20" height="4" />
              <rect x="8" y="42" width="20" height="4" />
              <ellipse cx="18" cy="10" rx="10" ry="6" />
            </g>
            {/* Small grass tufts */}
            <g fill="#0a8a5f" opacity="0.6">
              <path d="M300 100 Q305 85 310 100" />
              <path d="M305 100 Q310 80 315 100" />
              <path d="M295 100 Q300 88 305 100" />
              <path d="M440 100 Q445 82 450 100" />
              <path d="M445 100 Q450 78 455 100" />
              <path d="M435 100 Q440 86 445 100" />
            </g>
          </svg>
        </div>
        <div className={styles.bottomCircleDecor} />
        <div className={styles.bottomCircleDecorInner} />
      </div>
    </div>
  );
};

export default Login;
