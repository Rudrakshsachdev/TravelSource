import { useEffect } from "react";
import styles from "./LegalPage.module.css";

const PrivacyPolicy = () => {
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
                    <h1 className={styles.title}>Privacy Policy</h1>
                    <p className={styles.lastUpdated}>Last Updated: January 2021</p>
                </div>

                <div className={styles.contentCard}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Collection of Information</h2>
                        <p className={styles.text}>
                            If you browse through this site without providing us with any personal information, we will gather and store some information about your visit, such as IP address, type of browser and operating system used, date and time you access our site, pages you visit, and if you linked to our website from another website, the address of that website.
                        </p>
                        <p className={styles.text}>
                            This information will not identify you personally and will not be linked back to you. There will be times, such as when you submit an auto lead request to a dealer or fill out our contact form, when we will need to obtain personally identifiable information from you or about you.
                        </p>
                        <p className={styles.text}>
                            Such personally identifiable information may include your name, address, e-mail address, telephone number and identification number.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Use and Sharing of Information</h2>
                        <p className={styles.text}>
                            At no time will we sell your personally-identifiable data without your permission unless set forth in this Privacy Policy, unless required by Regulatory Authorities.
                        </p>
                        <p className={styles.text}>
                            The information we receive about you or from you may be used by us or shared by us with our corporate affiliates, dealers, agents, vendors and other third parties to help process your request; to comply with any law, regulation, audit or court order; to help improve our website or the products or services we offer; for research; to better understand our customers’ needs; to develop new offerings; and to alert you to new products and services (of us or our business associates) in which you may be interested.
                        </p>
                        <p className={styles.text}>
                            We may also combine information you provide us with information about you that is available to us internally or from other sources in order to better serve you. We do not share, sell, trade or rent your personal information to third parties for unknown reasons.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Security</h2>
                        <p className={styles.text}>
                            We safeguard your privacy using known security standards and procedures and comply with applicable privacy laws. Our websites combine industry-approved physical, electronic and procedural safeguards to ensure that your information is well protected though it’s life cycle in our infrastructure.
                        </p>
                        <p className={styles.text}>
                            Sensitive data is hashed or encrypted when it is stored in our infrastructure. Sensitive data is decrypted, processed and immediately re-encrypted or discarded when no longer necessary.
                        </p>
                        <p className={styles.text}>
                            We host web services in audited data centers, with restricted access to the data processing servers. Controlled access, recorded and live-monitored video feeds, 24/7 staffed security and biometrics provided in such data centers ensure that we provide secure hosting.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Opt-Out Policy</h2>
                        <p className={styles.text}>
                            Please email <a href="mailto:info@travelprofessor.co.in" className={styles.emailLink}>info@travelprofessor.co.in</a> if you no longer wish to receive any information from us.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Changes to this Privacy Policy</h2>
                        <p className={styles.text}>
                            Our privacy policy was last updated in January 2021. We may change our Privacy Policy from time to time. If we do, we will update this Privacy Policy on our website.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Questions</h2>
                        <p className={styles.text}>
                            If you have any questions about our Privacy Policy, please e-mail your questions to us at <a href="mailto:info@travelprofessor.co.in" className={styles.emailLink}>info@travelprofessor.co.in</a>.
                        </p>
                        <p className={styles.text}>
                            Please reviews our Privacy Policy, which also governs your visit to <a href="https://www.travelprofessor.co.in" className={styles.emailLink}>www.travelprofessor.co.in</a>, to fully understand our practices.
                        </p> section,
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
