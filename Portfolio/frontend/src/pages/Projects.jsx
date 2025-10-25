import { useEffect, useState } from "react";
import { projectsAPI, testConnection } from "../services/api";
import ProjectCard from "../components/Project/ProjectCard";

// Add this fallback data at the top of Projects.jsx

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [connectionStatus, setConnectionStatus] = useState("checking");

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      setConnectionStatus("checking");

      // Test backend connection first
      await testConnection();
      setConnectionStatus("connected");

      // Then load projects
      await fetchProjects();
    } catch (err) {
      setConnectionStatus("disconnected");
      setError(
        "Cannot connect to the server. Please make sure the backend is running on port 8000."
      );
      console.error("Initialization error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Then in the fetchProjects function, add fallback:
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsAPI.getAll();
      console.log("Fetched projects from database: ", data);
      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      console.error("API failed, using fallback data:", err);
      setError(
        "Connected to server but using fallback data. Some features may be limited."
      );
      // setProjects(fallbackProjects);
      // setFilteredProjects(fallbackProjects);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = (category) => {
    setActiveFilter(category);
    if (category === "all") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (project) => project.category === category
      );
      setFilteredProjects(filtered);
    }
  };

  const getCategories = () => {
    const categories = [
      ...new Set(projects.map((project) => project.category)),
    ];
    return ["all", ...categories];
  };

  // Connection status display
  const renderConnectionStatus = () => {
    if (connectionStatus === "checking") {
      return (
        <div
          style={{
            padding: "1rem",
            background: "#2a2a2a",
            borderRadius: "5px",
            marginBottom: "1rem",
          }}
        >
          🔄 Checking server connection...
        </div>
      );
    }
    if (connectionStatus === "connected") {
      return (
        <div
          style={{
            padding: "1rem",
            background: "rgba(212, 175, 55, 0.1)",
            border: "1px solid #d4af37",
            borderRadius: "5px",
            marginBottom: "1rem",
          }}
        >
          ✅ Connected to server
        </div>
      );
    }
    if (connectionStatus === "disconnected") {
      return (
        <div
          style={{
            padding: "1rem",
            background: "rgba(179, 0, 0, 0.1)",
            border: "1px solid #b30000",
            borderRadius: "5px",
            marginBottom: "1rem",
          }}
        >
          ❌ Server connection failed
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          {renderConnectionStatus()}
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: "1rem", color: "#b3b3b3" }}>
              Loading projects...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error && projects.length === 0) {
    return (
      <section className="section">
        <div className="container">
          {renderConnectionStatus()}
          <div className="error-message">
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <button onClick={initializeData} className="btn btn-primary">
                Try Again
              </button>
              <button
                onClick={() => setError(null)}
                className="btn btn-secondary"
              >
                Continue Offline
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section">
        <div className="container">
          {renderConnectionStatus()}
          <h1>My Projects</h1>
          <p className="subtitle" style={{ marginBottom: "2rem" }}>
            A collection of my work showcasing different technologies and
            solutions
          </p>

          {/* Filter Buttons - Only show if we have projects */}
          {projects.length > 0 && (
            <div className="filter-buttons" style={{ marginBottom: "3rem" }}>
              {getCategories().map((category) => (
                <button
                  key={category}
                  className={`filter-btn ${
                    activeFilter === category ? "active" : ""
                  }`}
                  onClick={() => filterProjects(category)}
                >
                  {category === "all"
                    ? "All Projects"
                    : category
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                </button>
              ))}
            </div>
          )}

          {/* Error banner that doesn't prevent viewing projects */}
          {error && projects.length > 0 && (
            <div className="error-message" style={{ marginBottom: "2rem" }}>
              <p>{error}</p>
              <button
                onClick={initializeData}
                className="btn btn-primary"
                style={{ marginTop: "0.5rem" }}
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* Projects Grid */}
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {filteredProjects.length === 0 &&
            projects.length === 0 &&
            !loading && (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "#b3b3b3",
                }}
              >
                <p>No projects found. The database might be empty.</p>
              </div>
            )}

          {filteredProjects.length === 0 && projects.length > 0 && (
            <div
              style={{ textAlign: "center", padding: "3rem", color: "#b3b3b3" }}
            >
              <p>No projects found for the selected category.</p>
              <button
                onClick={() => filterProjects("all")}
                className="btn btn-secondary"
                style={{ marginTop: "1rem" }}
              >
                Show All Projects
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
