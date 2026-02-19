import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";
import styles from "./Login.module.css";
import logoIcon from "../../assets/logo-icon.svg";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({
    username: false,
    password: false,
  });

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

  const handleFocus = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div className={styles.ultraLuxuryLogin}>
      {/* Luxury Background Elements */}
      <div className={styles.luxuryBackground}>
        <div className={styles.backgroundGlow}></div>
        <div className={styles.backgroundGrid}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
      </div>

      {/* Luxury Login Container */}
      <div className={styles.luxuryContainer}>
        {/* Luxury Side Panel */}
        <div className={styles.luxurySidePanel}>
          <div className={styles.sidePanelContent}>
            {/* Premium Logo */}
            <div className={styles.premiumLogo} onClick={() => navigate("/")}>
              <div className={styles.logoMark}>
                <img
                  src={logoIcon}
                  alt="Travel Professor"
                  className={styles.logoMarkImage}
                />
                <div className={styles.logoGlow}></div>
              </div>
              <div className={styles.logoText}>
                <span className={styles.logoPrimary}>TRAVEL</span>
                <span className={styles.logoDivider}></span>
                <span className={styles.logoSecondary}>PROFESSOR</span>
                <div className={styles.logoSubtitle}>
                  PREMIUM TRAVEL CONCIERGE
                </div>
              </div>
            </div>

            {/* Luxury Welcome */}
            <div className={styles.welcomeContent}>
              <div className={styles.welcomeBadge}>
                <span className={styles.badgeIcon}>✦</span>
                <span className={styles.badgeText}>EXCLUSIVE ACCESS</span>
                <div className={styles.badgeGlow}></div>
              </div>

              <h1 className={styles.welcomeTitle}>
                Welcome Back
                <span className={styles.titleLine}></span>
              </h1>

              <p className={styles.welcomeSubtitle}>
                Access your curated travel portfolio and continue planning
                extraordinary journeys with our global concierge team.
              </p>

              {/* Luxury Stats */}
              <div className={styles.luxuryStats}>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>500+</div>
                  <div className={styles.statLabel}>Active Journeys</div>
                </div>
                <div className={styles.statDivider}></div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>24/7</div>
                  <div className={styles.statLabel}>Concierge Support</div>
                </div>
                <div className={styles.statDivider}></div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>100%</div>
                  <div className={styles.statLabel}>Secure</div>
                </div>
              </div>
            </div>

            {/* Luxury Features */}
            <div className={styles.luxuryFeatures}>
              <h3 className={styles.featuresTitle}>Premium Benefits</h3>
              <div className={styles.featuresList}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✨</span>
                  <span className={styles.featureText}>
                    Personalized Itineraries
                  </span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>👑</span>
                  <span className={styles.featureText}>
                    VIP Access & Upgrades
                  </span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🔒</span>
                  <span className={styles.featureText}>
                    Secure Digital Wallet
                  </span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🌍</span>
                  <span className={styles.featureText}>
                    Global Destination Network
                  </span>
                </div>
              </div>
            </div>

            {/* 24/7 Support */}
            <div className={styles.supportSection}>
              <div className={styles.supportBadge}>
                <span className={styles.supportIcon}>📞</span>
                <span className={styles.supportText}>
                  24/7 GLOBAL CONCIERGE
                </span>
              </div>
              <a href="tel:+18005551234" className={styles.supportNumber}>
                +1 (800) 555-1234
              </a>
            </div>
          </div>
        </div>

        {/* Luxury Login Form */}
        <div className={styles.luxuryFormPanel}>
          <div className={styles.formContainer}>
            {/* Form Header */}
            <div className={styles.formHeader}>
              <div className={styles.headerTop}>
                <span className={styles.headerNumber}>01</span>
                <h2 className={styles.headerTitle}>Secure Authentication</h2>
              </div>
              <p className={styles.headerSubtitle}>
                Enter your credentials to access your exclusive travel portfolio
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className={styles.errorDisplay}>
                <div className={styles.errorIcon}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 8V12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 16H12.01"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className={styles.errorContent}>
                  <div className={styles.errorTitle}>
                    Authentication Required
                  </div>
                  <p className={styles.errorMessage}>{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form className={styles.luxuryForm} onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className={styles.formGroup}>
                <div className={styles.inputLabelContainer}>
                  <label className={styles.inputLabel}>
                    <span className={styles.labelNumber}>01</span>
                    Username or Email
                  </label>
                  <span className={styles.labelRequired}>*</span>
                </div>
                <div
                  className={`${styles.inputContainer} ${isFocused.username ? styles.inputFocused : ""}`}
                >
                  <div className={styles.inputIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="8"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username or email"
                    className={styles.luxuryInput}
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => handleFocus("username")}
                    onBlur={() => handleBlur("username")}
                    required
                    disabled={loading}
                  />
                  <div className={styles.inputBorder}></div>
                  <div className={styles.inputGlow}></div>
                </div>
              </div>

              {/* Password Field */}
              <div className={styles.formGroup}>
                <div className={styles.inputLabelContainer}>
                  <label className={styles.inputLabel}>
                    <span className={styles.labelNumber}>02</span>
                    Password
                  </label>
                  <span className={styles.labelRequired}>*</span>
                </div>
                <div
                  className={`${styles.inputContainer} ${isFocused.password ? styles.inputFocused : ""}`}
                >
                  <div className={styles.inputIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle cx="12" cy="16" r="2" fill="currentColor" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className={styles.luxuryInput}
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus("password")}
                    onBlur={() => handleBlur("password")}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M4 4L20 20"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </button>
                  <div className={styles.inputBorder}></div>
                  <div className={styles.inputGlow}></div>
                </div>

                {/* Forgot Password */}
                <div className={styles.forgotPassword}>
                  <button
                    type="button"
                    className={styles.forgotPasswordLink}
                    onClick={() => navigate("/forgot-password")}
                    disabled={loading}
                  >
                    <span className={styles.linkIcon}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M12 8V12L15 14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className={styles.linkText}>
                      Need help accessing your account?
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className={`${styles.luxuryButton} ${loading ? styles.buttonLoading : ""}`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className={styles.buttonSpinner}></div>
                    <span className={styles.buttonText}>Authenticating...</span>
                    <span className={styles.buttonSubtext}>
                      Accessing secure portfolio
                    </span>
                  </>
                ) : (
                  <>
                    <span className={styles.buttonText}>
                      Continue Your Journey
                    </span>
                    <span className={styles.buttonArrow}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <div className={styles.buttonGlow}></div>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className={styles.formDivider}>
                <div className={styles.dividerLine}></div>
                <span className={styles.dividerText}>
                  New to Travel Professor?
                </span>
                <div className={styles.dividerLine}></div>
              </div>

              {/* Create Account */}
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => navigate("/signup")}
                disabled={loading}
              >
                <span className={styles.secondaryButtonIcon}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className={styles.secondaryButtonText}>
                  Create Premium Account
                </span>
              </button>
            </form>

            {/* Form Footer */}
            <div className={styles.formFooter}>
              <p className={styles.footerText}>
                By continuing, you agree to our
                <a href="/terms" className={styles.footerLink}>
                  {" "}
                  Terms of Service
                </a>{" "}
                and
                <a href="/privacy" className={styles.footerLink}>
                  {" "}
                  Privacy Policy
                </a>
              </p>

              <div className={styles.securityBadge}>
                <span className={styles.securityIcon}>🔒</span>
                <span className={styles.securityText}>
                  256-bit SSL Encryption
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back Button */}
      <button
        className={styles.floatingBackButton}
        onClick={() => navigate("/")}
        aria-label="Return to homepage"
      >
        <span className={styles.backIcon}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className={styles.backText}>Back to Home</span>
      </button>
    </div>
  );
};

export default Login;
