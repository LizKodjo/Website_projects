import { useNavigate } from "react-router-dom";
import styles from "./PortfolioPreview.module.scss";

export default function PortfolioPreview() {
  const navigate = useNavigate();
  return (
    <>
      <section className={styles.portfolio}>
        <div className={styles.content}>
          <h2 className={styles.heading} data-aos="fade-up">
            Featured Projects
          </h2>
          <p
            className={styles.description}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Explore a selection of my recent work-from scalable backend APIs to
            elegant React interfaces and automated testing pipelines.
          </p>
          <button
            className={styles.cta}
            onClick={() => navigate("/portfolio")}
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            View Full Portfolio
          </button>
        </div>
      </section>
    </>
  );
}
