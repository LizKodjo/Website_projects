export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="social-links">
            <a
              href="https://github.com/lizkodjo"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a href="mailto:ellizakodjo@outlook.com">Email</a>
          </div>
          <p className="copyright">
            © {currentYear} EK. Built with React & FastAPI.
          </p>
        </div>
      </footer>
    </>
  );
}
