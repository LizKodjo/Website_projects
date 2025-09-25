import styles from "./HeroSection.module.scss";
import portrait from "../../assets/catOnCar.jpg";

export default function HeroSection({ heading }) {
  const handleScroll = () => {
    const target = document.getElementById("next-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <h1 className={`gold-gradient ${styles.pageHeading}`}>
                {heading}
              </h1>
              <h2 className={`gold-gradient ${styles.subheading}`}>
                Hi I'm Elizabeth Kodjo
              </h2>
              <p className={styles.message}>
                Let's get in touch to discuss potential collaboations or
                inquiries you may have.
              </p>
            </div>
            <div className={styles.heroImage}>
              <img
                src={portrait}
                alt="Elizabeth Kodjo"
                className={styles.image}
              />
            </div>
          </div>
          {/* <div className={styles.content}>
          <div className={styles.text}></div>
          <div className={styles.imageContainer}></div>
        </div> */}

          <div className={styles.scrollCue} onClick={handleScroll}>
            <span className={styles.arrow}></span>
          </div>
          {/* </div> */}
        </div>
      </section>
    </>
  );
}
