import styles from "./Portfolio.module.scss";

const projects = [
  {
    title: "Watermark Desktop App",
    description:
      "A Tkinter-based image watermarking tool with Pillow integration, custom UI and export features",
    tech: ["Python", "Tkinter", "Pillow"],
  },
  {
    title: "Business Website",
    description:
      "A React/Vite site with modular SCSS, branding, accessibility and GDPR compliance",
    tech: ["React", "Vite", "SCSS", "Accessibility"],
  },
  {
    title: "API Automation Suite",
    description:
      "Reuseable Pytest framework for validating ML models and backend APIs with CI/CD integration",
    tech: ["Pytest", "Selenium", "CI/CD"],
  },
];

export default function Portfolio() {
  return (
    <>
      <section className={styles.portfolio}>
        <div className={styles.content}>
          <h1 className={`${styles.heading} gold-gradient`}>My Work</h1>
          <p className={styles.intro}>
            Here's a selection of projects that reflect my technical depth,
            design sensibility and commitment to quallity.
          </p>

          <div className={styles.grid}>
            {projects.map((project, index) => (
              <div
                className={styles.card}
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <h2 className={styles.title}>{project.title}</h2>
                <p className={styles.description}>{project.description}</p>
                <ul className={styles.tech}>
                  {project.tech.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
