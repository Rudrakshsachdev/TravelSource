import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../services/api";
import styles from "./Signup.module.css";

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
        [e.target.name]: null
      });
    }
  };

  const handleCheckboxChange = (e) => {
    setAcceptedTerms(e.target.checked);
    // Clear terms error when user checks the box
    if (errors.terms) {
      setErrors({
        ...errors,
        terms: null
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
        terms: "You must accept the Terms of Service and Privacy Policy to continue."
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
      
      if (backendErrors && typeof backendErrors === 'object') {
        const formattedErrors = {};
        
        Object.keys(backendErrors).forEach(key => {
          if (Array.isArray(backendErrors[key])) {
            formattedErrors[key] = backendErrors[key].join(" ");
          } else if (typeof backendErrors[key] === 'string') {
            formattedErrors[key] = backendErrors[key];
          }
        });
        
        setErrors(formattedErrors);
      } else if (err.message) {
        setErrors({ general: err.message });
      } else {
        setErrors({ general: "An unexpected error occurred. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.backgroundOverlay}></div>
      
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1 className={styles.heading}>Start Your Journey</h1>
          <p className={styles.subtitle}>Create an account and begin exploring the world with Travel Professor</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Display general errors */}
          {errors.general && (
            <div className={styles.errorContainer}>
              <svg className={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <p className={styles.error}>{errors.general}</p>
            </div>
          )}

          {/* Display non-field specific errors */}
          {typeof errors === 'string' && (
            <div className={styles.errorContainer}>
              <svg className={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <p className={styles.error}>{errors}</p>
            </div>
          )}

          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
            </div>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
            {errors.username && (
              <div className={styles.fieldError}>
                <svg className={styles.fieldErrorIcon} viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7 4a1 1 0 112 0v4a1 1 0 11-2 0V4zm1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                </svg>
                <span>{errors.username}</span>
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            {errors.email && (
              <div className={styles.fieldError}>
                <svg className={styles.fieldErrorIcon} viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7 4a1 1 0 112 0v4a1 1 0 11-2 0V4zm1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                </svg>
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
            {errors.password && (
              <div className={styles.fieldError}>
                <svg className={styles.fieldErrorIcon} viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7 4a1 1 0 112 0v4a1 1 0 11-2 0V4zm1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
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
              className={`${styles.termsCheckbox} ${errors.terms ? styles.checkboxError : ''}`}
              checked={acceptedTerms}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="terms" className={styles.termsLabel}>
              I agree to the <a href="/terms" className={styles.termsLink}>Terms of Service</a> and <a href="/privacy" className={styles.termsLink}>Privacy Policy</a>
            </label>
          </div>
          
          {/* Display terms error if exists */}
          {errors.terms && (
            <div className={styles.fieldError}>
              <svg className={styles.fieldErrorIcon} viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7 4a1 1 0 112 0v4a1 1 0 11-2 0V4zm1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
              </svg>
              <span>{errors.terms}</span>
            </div>
          )}

          <button
            className={`${styles.button} ${loading ? styles.buttonLoading : ''} ${!acceptedTerms ? styles.buttonDisabled : ''}`}
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
                <svg className={styles.buttonIcon} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.16699 10H15.8337" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.833 5L15.833 10L10.833 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
          >
            Sign In Instead
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Join thousands of travelers exploring the world with Travel Professor
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;