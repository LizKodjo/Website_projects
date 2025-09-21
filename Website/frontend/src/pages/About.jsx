import styles from "./About.module.scss";

export default function About() {
  return (
    <>
      <section className={styles.about}>
        <div className={styles.content}>
          <h1 className={styles.heading}>Meet Elizabeth Kodjo</h1>
          <p className={styles.bio}>
            I'm a Full-Stack Developer and Software Test Engineer specialising
            in Python backend, React/Vite frontend and automated testing. I lead
            with technical rigor, design sensibility and a commitment to
            compliance and accessibility.
          </p>
          <div className={styles.skills}>
            <h2 className={styles.subheading}>Core Skills</h2>
            <ul>
              <li>Advanced Python & API development</li>
              <li>React.js, Vite, modular SCSS architecture</li>
              <li>
                Manual and Automated testing with Pytest, Selenium, Playwright
              </li>
              <li>GDPR compliance, accessibility and performance</li>
            </ul>
          </div>
          <div className={styles.values}>
            <h2 className={styles.subheading}>What Drives Me</h2>
            <p>
              I blend strategic thinking with creative execution. I care deeply
              about elegant design, inclusive experience and building systems
              that scale. Whether mentoring peers or refining a CI/CD pipeline,
              I bring warmth, precision and purpose.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
