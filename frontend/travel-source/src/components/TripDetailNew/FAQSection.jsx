import { useState } from "react";
import styles from "./TripDetailNew.module.css";

const FAQSection = ({ faqs = [] }) => {
  const [openIdx, setOpenIdx] = useState(-1);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>FAQs</h2>
      <div className={styles.faqList}>
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          const question = faq.q || faq.question || "";
          const answer = faq.a || faq.answer || "";

          return (
            <div key={i} className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}>
              <button className={styles.faqQuestion} onClick={() => setOpenIdx(isOpen ? -1 : i)}>
                <span>{question}</span>
                <span className={styles.faqChevron}>{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className={styles.faqAnswer}>
                  {answer.split("\n").map((p, j) =>
                    p.trim() ? <p key={j}>{p}</p> : null
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
