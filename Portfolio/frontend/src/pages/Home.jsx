import { Link } from "react-router-dom";

export default function Home() {
  const HeroParticles = () => (
    <div className="hero-particles">
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
    </div>
  );

  return (
    <>
      <section className="hero">
        <HeroParticles />
        <div className="container">
          <div className="hero-content">
            <h1>Elizabeth Kodjo</h1>
            <p className="subtitle">Full-Stack Developer & Software Engineer</p>
            <p>
              I create elegant, efficient solutions to complex problems.
              Passionate about clean code, user experience and continuous
              learning
            </p>
            <div className="cta-buttons">
              <Link to="/projects" className="btn btn-primary">
                View My Work
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>About Me</h2>
          <div style={{ maxWidth: "800px" }}>
            <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
              I'm a passionate software developer with expertise in modern web
              technologies. I love building applications that make a difference
              and solving challenging problems
            </p>
            <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
              My tech stack includes Python, React, Node.js and various
              databases. I'm always eager to learn new technologies and take on
              exciting projects.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
