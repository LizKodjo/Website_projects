import { useNavigate } from "react-router-dom";
import styles from "./AboutPreview.module.scss";

export default function AboutPreview() {
  const navigate = useNavigate();
  return (
    <>
      <section className={styles.about}>
        <div className={styles.content}>
          <h2 className={styles.heading} data-aos="fade-up">
            About Elizabeth Kodjo
          </h2>
          <p
            className={styles.description}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            I am a Full-Stack Developer and Software Test Engineer specialising
            in Python backend, React/Vite frontend and automated testing. I lead
            with technical rigor, design sensibility and a commitment to
            compliance and accessibility
          </p>
          <button
            className={styles.cta}
            onClick={() => navigate("about")}
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            Learn more
          </button>
        </div>
      </section>
    </>
  );
}
