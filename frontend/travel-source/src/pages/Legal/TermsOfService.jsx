import { useEffect } from "react";
import styles from "./LegalPage.module.css";

const TermsOfService = () => {
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
                    <h1 className={styles.title}>Terms & Conditions</h1>
                    <p className={styles.lastUpdated}>Last Updated: January 2021</p>
                </div>

                <div className={styles.contentCard}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>General Terms</h2>
                        <p className={styles.text}>
                            Terms and conditions are binding for all purchases. All orders are deemed offers for you to purchase our products and/or services. We may accept your offer by issuing a confirmatory e-mail and/or mobile confirmation of the products specified in your order.
                        </p>
                        <p className={styles.text}>
                            Our acceptance of each such offer is expressly subject to and conditioned on your assent to these terms and conditions of sale. No other terms and conditions will apply.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Electronic Communication</h2>
                        <p className={styles.text}>
                            When you visit <a href="https://www.travelprofessor.co.in" className={styles.emailLink}>www.travelprofessor.co.in</a> or send e-mails to us, you are communicating with us electronically. By communicating with us, you consent to receive communication from us electronically.
                        </p>
                        <p className={styles.text}>
                            We will communicate with you by e-mail or by posting notices on our website. You agree that all agreements, notices, disclosures, and other communications that we provide to you electronically satisfy any legal requirement that such communication be in writing.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Prices & Payment</h2>
                        <p className={styles.text}>
                            All prices shall be as per the Agreement/mail confirmation and shall be charged as per the Terms and conditions as mentioned in the Agreement/mail.
                        </p>
                        <p className={styles.text}>
                            All payments must be received by us as per the Agreement/confirmation. We accept payment by Cheque, net-banking, credit card, debit card.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Shipping & Handling</h2>
                        <p className={styles.text}>
                            Shipping and Handling charges shall be as per the individual Contract.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>License & Website Access</h2>
                        <p className={styles.text}>
                            Travel Professor grants you a limited license to access this website and not to download (other than page caching) or modify it, or any portion of it, except with express written consent.
                        </p>
                        <p className={styles.text}>
                            <strong>No license for commercial sale:</strong> This license does not include any resale or commercial use of this website or its content; any collection and use of any product listing, description, or pricing; copying of account information for the benefit of another merchant; or any use of data mining, or similar data gathering and extraction tools.
                        </p>
                        <p className={styles.text}>
                            <strong>No framing:</strong> You may not frame or utilize framing technologies to enclose any trademark, logo, or other proprietary information (including images, text, page layout, or form) of Travel Professor and its affiliates without the express written consent.
                        </p>
                        <p className={styles.text}>
                            <strong>Metatags:</strong> You may not use any metatags or any other ‘hidden text’ utilizing Travel Professor’s name or trademarks without the express written consent. Any unauthorized use terminates the permission or license granted.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Your Account</h2>
                        <p className={styles.text}>
                            As discussed further in the website’s privacy policy, by using this website, you agree that you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and agree to accept responsibility for all activities that occur under your account or password.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Governing Law & Jurisdiction</h2>
                        <p className={styles.text}>
                            These terms and conditions will be construed only in accordance with the laws of India. In respect of all matters/disputes arising out of, in connection with or in relation to these terms and conditions or any other conditions on this website, All Disputes are subject to the exclusive jurisdiction of competent courts and forums in Delhi only.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
