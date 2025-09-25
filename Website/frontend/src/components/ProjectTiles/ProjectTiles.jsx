import styles from "./ProjectTiles.module.scss";
import { projects } from "../data/projects";
import { FaGithub } from "react-icons/fa";

export default function ProjectTiles() {
  return (
    <>
      <section className={styles.tiles}>
        <h2 className={`gold-gradient ${styles.heading}`}>Featured Work</h2>
        <div className={styles.grid}>
          {projects.map((project, index) => (
            <div key={index} className={styles.tile}>
              <img
                src={project.image}
                alt={project.title}
                className={styles.image}
              />
              <h3 className={`gold-gradient ${styles.title}`}>
                {project.title}
              </h3>
              <p className={styles.description}>{project.description}</p>
              <div className={styles.tech}>
                {project.tech.map((tech, i) => (
                  <span key={i}>{tech}</span>
                ))}
              </div>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.githubIcon}
                >
                  <FaGithub />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
