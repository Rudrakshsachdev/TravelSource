import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../../services/api";
import styles from "./Signup.module.css";
// We reuse the same hero image generated during the login redesign
import heroImg from "../../assets/login-hero.png";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
  };

  const handleCheckboxChange = (e) => {
    setAcceptedTerms(e.target.checked);
    // Clear terms error when user checks the box
    if (errors.terms) {
      setErrors({
        ...errors,
        terms: null,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation for terms checkbox
    if (!acceptedTerms) {
      setErrors({
        ...errors,
        terms:
          "You must accept the Terms of Service and Privacy Policy to continue.",
      });
      return;
    }

    // Clear all previous errors
    setErrors({});
    setLoading(true);

    try {
      await signupUser(formData);
      navigate("/login");
    } catch (err) {
      // Handle Django error format from both our fetch wrapper (err.data) and potential Axios (err.response.data)
      const backendErrors = err.data || (err.response && err.response.data);

      if (backendErrors && typeof backendErrors === "object") {
        const formattedErrors = {};

        Object.keys(backendErrors).forEach((key) => {
          if (Array.isArray(backendErrors[key])) {
            formattedErrors[key] = backendErrors[key].join(" ");
          } else if (typeof backendErrors[key] === "string") {
            formattedErrors[key] = backendErrors[key];
          }
        });

        setErrors(formattedErrors);
      } else if (err.message) {
        setErrors({ general: err.message });
      } else {
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupPage}>
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

        {/* ── Right Panel — Signup Form ── */}
        <div className={styles.rightPanel}>
          {/* Logo in Header */}
          <div className={styles.logoWrapper}>
            <img src="/logog.png" alt="Travel Professor Logo" className={styles.logoImg} />
          </div>

          {/* Airplane Decorative Path */}
          <div className={styles.airplanePath}>
            <svg viewBox="0 0 200 100" fill="none">
              <path
                d="M10 80 Q60 10 120 30 Q160 45 185 15"
                stroke="var(--login-primary)"
                strokeWidth="2"
                strokeDasharray="6 5"
                fill="none"
                opacity="0.5"
              />
              <g transform="translate(180, 8) rotate(-35)">
                <path
                  d="M0 6 L4 0 L8 6 L5 5 L5 12 L3 12 L3 5 Z"
                  fill="var(--login-primary)"
                  opacity="0.8"
                />
              </g>
            </svg>
          </div>

          {/* Form Header */}
          <div className={styles.formHeader}>
            <h1 className={styles.welcomeTitle}>Start Your Journey</h1>
            <p className={styles.welcomeSubtitle}>
              Create an account and begin exploring
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* General Errors */}
            {errors.general && (
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
                <p className={styles.error}>{errors.general}</p>
              </div>
            )}
            
            {typeof errors === "string" && (
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
                <p className={styles.error}>{errors}</p>
              </div>
            )}

            {/* Username Field */}
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <div className={styles.inputIcon}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  className={`${styles.input} ${errors.username ? styles.inputError : ""}`}
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  disabled={loading}
                />
              </div>
              {errors.username && (
                <div className={styles.fieldError}>
                  <svg
                    className={styles.fieldErrorIcon}
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 15A7 7 0 108 1a7 7 0 000 14zM7 4a1 1 0 112 0v4a1 1 0 11-2 0V4zm1 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{errors.username}</span>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <div className={styles.inputIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <path d="M22 7L12 13L2 7" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <div className={styles.fieldError}>
                  <svg
                    className={styles.fieldErrorIcon}
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 15A7 7 0 108 1a7 7 0 000 14zM7 4a1 1 0 112 0v4a1 1 0 11-2 0V4zm1 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <div className={styles.inputIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  disabled={loading}
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
              {errors.password && (
                <div className={styles.fieldError}>
                  <svg
                    className={styles.fieldErrorIcon}
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 15A7 7 0 108 1a7 7 0 000 14zM7 4a1 1 0 112 0v4a1 1 0 11-2 0V4zm1 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className={styles.passwordRequirements}>
              <p className={styles.requirementsTitle}>Password should include:</p>
              <ul className={styles.requirementsList}>
                <li className={styles.requirementItem}>At least 6 characters</li>
                <li className={styles.requirementItem}>One uppercase letter</li>
                <li className={styles.requirementItem}>One number</li>
                <li className={styles.requirementItem}>One special character</li>
              </ul>
            </div>

            <div className={styles.termsAgreement}>
              <input
                type="checkbox"
                id="terms"
                className={`${styles.termsCheckbox} ${errors.terms ? styles.checkboxError : ""}`}
                checked={acceptedTerms}
                onChange={handleCheckboxChange}
                disabled={loading}
              />
              <label htmlFor="terms" className={styles.termsLabel}>
                I agree to the{" "}
                <Link to="/terms" className={styles.termsLink}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className={styles.termsLink}>
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Display terms error if exists */}
            {errors.terms && (
              <div className={styles.fieldError}>
                <svg
                  className={styles.fieldErrorIcon}
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 15A7 7 0 108 1a7 7 0 000 14zM7 4a1 1 0 112 0v4a1 1 0 11-2 0V4zm1 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{errors.terms}</span>
              </div>
            )}

            <button
              className={`${styles.button} ${loading ? styles.buttonLoading : ""} ${!acceptedTerms ? styles.buttonDisabled : ""}`}
              disabled={loading || !acceptedTerms}
              type="submit"
            >
              {loading ? (
                <>
                  <span className={styles.loadingSpinner}></span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Start Your Adventure</span>
                  <svg
                    className={styles.buttonIcon}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.16699 10H15.8337"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.833 5L15.833 10L10.833 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>

            <div className={styles.divider}>
              <span className={styles.dividerText}>Already have an account?</span>
            </div>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              Sign In Instead
            </button>
          </form>
        </div>


      </div>

      {/* ── Background Circle Decor ── */}
      <div className={styles.bottomCircleDecor} />
      <div className={styles.bottomCircleDecorInner} />
    </div>
  );
};

export default Signup;
