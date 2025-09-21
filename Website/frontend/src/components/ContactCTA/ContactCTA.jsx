import { useNavigate } from "react-router-dom";
import styles from "./ContactCTA.module.scss";

export default function ContactCTA() {
  const navigate = useNavigate();
  return (
    <>
      <section className={styles.contact} data-aos="fade-up">
        <div className={styles.content}>
          <h2 className={styles.heading}>Let's Build Something Together</h2>
          <p className={styles.description}>
            Whether you need a scalable backend, a sleek frontend or a fully
            tested solution - I'm here to help. Let's turn your ideas into
            reality.
          </p>
          <button
            className={styles.cta}
            onClick={() => navigate("/contact")}
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            Get in touch
          </button>
        </div>
      </section>
    </>
  );
}
