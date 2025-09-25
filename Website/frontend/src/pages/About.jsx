import Hero from "../components/Hero/Hero";
import HeroSection from "../components/Hero/HeroSection";
import styles from "./About.module.scss";

export default function About() {
  return (
    <>
      <HeroSection heading="About Me" />
      <section className={styles.about} id="next-section">
        <div className={styles.content}>
          <h1 className={styles.heading}>Meet Elizabeth Kodjo</h1>
          <p className={styles.bio}>
            I'm a Full-Stack Developer and Software Test Engineer specialising
            in Python backend, React/Vite frontend and automated testing. I lead
            with technical rigor, design sensibility and a commitment to
            compliance and accessibility.
          </p>
          <div className={styles.coreSkills}>
            <h2>Core Skills</h2>
            <ul className={styles.skillList}>
              <li className={styles.skillItem}>
                Advanced Python & API development
              </li>
              <li className={styles.skillItem}>
                React.js, Vite, modular SCSS architecture
              </li>
              <li className={styles.skillItem}>
                Manual and Automated testing with Pytest, Selenium, Playwright,
                Cypress
              </li>
              <li className={styles.skillItem}>
                GDPR compliance, accessibility and performance
              </li>
              <li className={styles.skillItem}>Responsive Layouts</li>
              <li className={styles.skillItem}>Strategic Documentation</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.whatDrivesMe}>
        <h2>What Drives Me</h2>
        <p>
          I blend strategic thinking with creative execution. I care deeply
          about elegant design, inclusive experience and building systems that
          scale. Whether mentoring peers or refining a CI/CD pipeline, I bring
          warmth, precision and purpose.
        </p>
      </section>
    </>
  );
}
