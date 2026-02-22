import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset, verifyResetOTP, resetPassword } from "../../services/api";
import styles from "./ForgotPassword.module.css";

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
        setLoading(true);
        try {
            await requestPasswordReset(email);
            setStep(2);
            setSuccess("Reset code sent to your email!");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await verifyResetOTP(email, otp);
            setStep(3);
            setSuccess("Code verified! Set your new password.");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordResetSubmit = async (e) => {
        e.preventDefault();
        setError("");
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
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.backgroundOverlay}></div>
            <div className={styles.vignetteOverlay} />
            <div className={styles.worldMapOverlay} />
            <div className={styles.routeLinesOverlay} />
            <div className={styles.noiseOverlay} />
            <div className={styles.particlesLayer}>
                {[1, 2, 3].map((n) => (
                    <span key={n} className={`${styles.particle} ${styles[`particle${n}`]}`} />
                ))}
            </div>

            <div className={styles.container}>
                <div className={styles.headerSection}>
                    <div className={styles.logoIcon}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className={styles.heading}>
                        {step === 1 && "Forgot Password"}
                        {step === 2 && "Verification Code"}
                        {step === 3 && "Reset Password"}
                    </h1>
                    <p className={styles.subtitle}>
                        {step === 1 && "Enter your registered email to receive a recovery code"}
                        {step === 2 && "We've sent a 6-digit code to your email adress"}
                        {step === 3 && "Create a secure new password for your account"}
                    </p>
                </div>

                {error && (
                    <div className={styles.errorContainer}>
                        <p className={styles.error}>{error}</p>
                    </div>
                )}

                {success && !error && (
                    <div className={styles.successContainer}>
                        <p className={styles.success}>{success}</p>
                    </div>
                )}

                {step === 1 && (
                    <form className={styles.form} onSubmit={handleEmailSubmit}>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputIcon}>
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button className={`${styles.button} ${loading ? styles.buttonLoading : ""}`} type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Code"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form className={styles.form} onSubmit={handleOtpSubmit}>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputIcon}>
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="6-Digit Code"
                                className={styles.input}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button className={`${styles.button} ${loading ? styles.buttonLoading : ""}`} type="submit" disabled={loading}>
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>
                        <button type="button" className={styles.linkButton} onClick={() => setStep(1)} disabled={loading}>
                            Back to Email
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form className={styles.form} onSubmit={handlePasswordResetSubmit}>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputIcon}>
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                placeholder="New Password"
                                className={styles.input}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputIcon}>
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                className={styles.input}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button className={`${styles.button} ${loading ? styles.buttonLoading : ""}`} type="submit" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <div className={styles.footer}>
                    <button className={styles.footerLink} onClick={() => navigate("/login")}>
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
