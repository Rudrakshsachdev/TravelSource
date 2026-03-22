import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { requestPasswordReset, verifyResetOTP, resetPassword } from "../../services/api";
import styles from "./ForgotPassword.module.css";
import heroImg from "../../assets/login-hero.png";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            await requestPasswordReset(email);
            setStep(2);
            setSuccess("Reset code sent to your email!");
        } catch (err) {
            setError(err.message || "Failed to send reset code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            await verifyResetOTP(email, otp);
            setStep(3);
            setSuccess("Code verified! Set your new password.");
        } catch (err) {
            setError(err.message || "Invalid or expired code.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordResetSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            await resetPassword(email, newPassword);
            setSuccess("Password reset successfully! Redirecting to login...");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.message || "Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
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

                {/* ── Right Panel — Form ── */}
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
                                stroke="#2563eb"
                                strokeWidth="2"
                                strokeDasharray="6 5"
                                fill="none"
                                opacity="0.5"
                            />
                            <g transform="translate(180, 8) rotate(-35)">
                                <path
                                    d="M0 6 L4 0 L8 6 L5 5 L5 12 L3 12 L3 5 Z"
                                    fill="#2563eb"
                                    opacity="0.8"
                                />
                            </g>
                        </svg>
                    </div>

                    {/* Form Header */}
                    <div className={styles.formHeader}>
                        <h1 className={styles.welcomeTitle}>
                            {step === 1 && "Forgot Password"}
                            {step === 2 && "Verification"}
                            {step === 3 && "Reset Password"}
                        </h1>
                        <p className={styles.welcomeSubtitle}>
                            {step === 1 && "Enter registered email to recover account"}
                            {step === 2 && "Enter the 6-digit code sent to your email"}
                            {step === 3 && "Create a secure new password"}
                        </p>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className={styles.errorContainer}>
                            <svg className={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className={styles.error}>{error}</p>
                        </div>
                    )}

                    {/* Success Display */}
                    {success && !error && (
                        <div className={styles.successContainer}>
                            <svg className={styles.successIcon} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className={styles.success}>{success}</p>
                        </div>
                    )}

                    {/* Step 1: Email Form */}
                    {step === 1 && (
                        <form className={styles.form} onSubmit={handleEmailSubmit}>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Email Address</label>
                                <div className={styles.inputWrapper}>
                                    <div className={styles.inputIcon}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="4" width="20" height="16" rx="3" />
                                            <path d="M22 7L12 13L2 7" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className={styles.input}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <button className={`${styles.button} ${loading ? styles.buttonLoading : ""}`} type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className={styles.loadingSpinner}></span>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <span>Send Reset Code</span>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Form */}
                    {step === 2 && (
                        <form className={styles.form} onSubmit={handleOtpSubmit}>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Verification Code</label>
                                <div className={styles.inputWrapper}>
                                    <div className={styles.inputIcon}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" />
                                            <path d="M7 11V7a5 5 0 0110 0v4" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="6-Digit OTP"
                                        className={styles.input}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <button className={`${styles.button} ${loading ? styles.buttonLoading : ""}`} type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className={styles.loadingSpinner}></span>
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <span>Verify Code</span>
                                )}
                            </button>
                            <div className={styles.footer}>
                                <button type="button" className={styles.linkButton} onClick={() => setStep(1)} disabled={loading}>
                                    ← Edit Email
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Password Form */}
                    {step === 3 && (
                        <form className={styles.form} onSubmit={handlePasswordResetSubmit}>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>New Password</label>
                                <div className={styles.inputWrapper}>
                                    <div className={styles.inputIcon}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" />
                                            <path d="M7 11V7a5 5 0 0110 0v4" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••••••"
                                        className={styles.input}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Confirm Password</label>
                                <div className={styles.inputWrapper}>
                                    <div className={styles.inputIcon}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" />
                                            <path d="M7 11V7a5 5 0 0110 0v4" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••••••"
                                        className={styles.input}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <button className={`${styles.button} ${loading ? styles.buttonLoading : ""}`} type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className={styles.loadingSpinner}></span>
                                        <span>Resetting...</span>
                                    </>
                                ) : (
                                    <span>Reset Password</span>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Footer Back to Login Link */}
                    <div className={styles.footer}>
                        <p className={styles.footerRegister}>
                            Remember password?{" "}
                            <Link to="/login" className={styles.footerLink}>
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Bottom Decorative Elements ── */}
            <div className={styles.bottomDecor}>
                <div className={styles.bottomCircleDecor} />
                <div className={styles.bottomCircleDecorInner} />
            </div>
        </div>
    );
};

export default ForgotPassword;
