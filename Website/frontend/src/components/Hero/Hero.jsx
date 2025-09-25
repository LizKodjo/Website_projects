import { useNavigate } from "react-router-dom";
import styles from "./Hero.module.scss";
import heroImage from "../../assets/catOnCar.jpg";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.wrapper}>
          <div className={styles.text}>
            <h1 className={`gold-gradient ${styles.title}`}>
              Full Stack Python Developer
            </h1>
            <p className={styles.tagline}>
              I build web applications to solve user's problems as a Python
              Developer.
            </p>
            <button
              className={styles.cta}
              onClick={() => navigate("/portfolio")}
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              View Portfolio
            </button>
          </div>
          <div className={styles.imageContainer}>
            <img
              src={heroImage}
              alt="Elizabeth Kodjo"
              className={styles.image}
            />{" "}
          </div>
        </div>
      </section>
    </>
  );
}
