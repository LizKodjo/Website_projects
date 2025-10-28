import { Link } from "react-router-dom";
import ResumeDownload from "../components/ResumeDownload";

export default function Home() {
  const HeroParticles = () => (
    <div className="hero-particles">
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
    </div>
  );

  const skills = {
    frontend: ["React ", "JavaScript ", "HTML/CSS ", "SCSS ", "Vite"],
    backend: ["Python", "FastAPI", "SQL", "REST APIs", "SQLModel"],
    tools: ["Git", "Docker", "Testing", "VS Code", "Linux"],
  };

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
              learning. Currently building my portfolio with modern full-stack
              projects.
            </p>
            <div className="cta-buttons">
              <Link to="/projects" className="btn btn-primary">
                View My Work
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Get In Touch
              </Link>
              <ResumeDownload variant="secondary" />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>About Me</h2>
          <div style={{ maxWidth: "800px" }}>
            <p
              style={{
                marginBottom: "1.5rem",
                fontSize: "1.1rem",
                lineHeight: "1.7",
              }}
            >
              I'm a passionate software developer with expertise in modern web
              technologies. I love building applications that make a difference
              and solving challenging problems. My journey in programming
              started with Python and I've since expanded to full-stack
              development with React and FastAPI.
            </p>
            <p
              style={{
                marginBottom: "2rem",
                fontSize: "1.1rem",
                lineHeight: "1.7",
              }}
            >
              When I'm not coding, I enjoy learning new technologies,
              contributing to open-source projects and staying up-to-date with
              the latest web development trends. I believe in writing clean,
              maintainable code and creating intuitive user experiences.
            </p>
          </div>

          {/* Resume Download Section */}
          <div className="resume-section">
            <h3 style={{ color: "#d4af37", marginBottom: "1rem" }}>Resume</h3>
            <p style={{ marginBottom: "1.5rem", color: "#b3b3b3" }}>
              Looking for a more detailed overview of my experiene and skills?
              Download my full resume to learn more about my background and
              qualifications.
            </p>
            <div className="resume-actions">
              <ResumeDownload variant="primary" />
              <Link to="/contact" className="btn btn-primary">
                Request More Info
              </Link>
            </div>
          </div>

          {/* Skills Section */}
          <div className="skills-section">
            <h3 style={{ marginBottom: "2rem", color: "#d4af37" }}>
              Technical Skills
            </h3>

            <div className="skills-grid">
              {Object.entries(skills).map(([category, skillList]) => (
                <div key={category} className="skill-category">
                  <h4 className="skill-category-title">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h4>
                  <div className="skill-tags">
                    {skillList.map((skill) => (
                      <span key={skill} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
