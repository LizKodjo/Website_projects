import Hero from "../components/Hero/Hero";
import HeroSection from "../components/Hero/HeroSection";
import ProjectTiles from "../components/ProjectTiles/ProjectTiles";
import styles from "./Portfolio.module.scss";

export default function Portfolio() {
  return (
    <>
      <HeroSection heading="Projects" />
      <main>
        <section className={styles.portfolio} id="next-section">
          <h1 className={`${styles.heading} gold-gradient`}>Portfolio</h1>
          <p>
            A showcase of solutions in web development, e-commerce and data
            analyst
          </p>
        </section>
        <ProjectTiles />
      </main>
    </>
  );
}
