import { useEffect } from "react";
import styles from "./LegalPage.module.css";

const RefundPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.legalPage}>
            <div className={styles.backgroundOverlay}></div>
            <div className={`${styles.decorOrb} ${styles.orb1}`}></div>
            <div className={`${styles.decorOrb} ${styles.orb2}`}></div>

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Refund Policy</h1>
                    <p className={styles.lastUpdated}>Last Updated: January 2021</p>
                </div>

                <div className={styles.contentCard}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Return Policy</h2>
                        <p className={styles.text}>
                            Return Policy shall be as per the individual contract.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Changes and Cancellation</h2>
                        <p className={styles.text}>
                            No changes in order or cancellation is allowed as per Company policy.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Refund</h2>
                        <p className={styles.text}>
                            Refund may only be allowed, in case of unfulfilled orders due to technical and/or server breakdown or due to unforeseen circumstances due to which the order remains unfulfilled within the time frame, as per individual contracts.
                        </p>
                        <p className={styles.text}>
                            The refund shall be processed within 15 working days.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Questions</h2>
                        <p className={styles.text}>
                            If you have any questions about our Refund Policy, please e-mail your questions to us at <a href="mailto:info@travelprofessor.co.in" className={styles.emailLink}>info@travelprofessor.co.in</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
