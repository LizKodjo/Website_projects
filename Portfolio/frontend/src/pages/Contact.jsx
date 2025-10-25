import { useState } from "react";
import { contactAPI } from "../services/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      await contactAPI.send(formData);
      setStatus({
        type: "success",
        message: "Thank you for your message! I'll get bact to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          "Sorry, there was an error sending your message.  Please try again or email me directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="section">
        <div className="container">
          <h1>Get In Touch</h1>
          <p className="subtitle" style={{ marginBottom: "3rem" }}>
            Have a question or want to work together? I'd love to hear from you.
          </p>

          <div className="contact-content">
            <div className="contact-info">
              <h3 style={{ color: "#d4af37", marginBottom: "1rem" }}>
                Let's Connect
              </h3>
              <p style={{ marginBottom: "2rem", color: "#b3b3b3" }}>
                I'm always interested in new opportunties, collaborations and
                connecting with fellow developers. Feel free to reach out!
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <strong>Email:</strong>
                  <span>test@test.com</span>
                </div>
                <div className="contact-method">
                  <strong>Response Time:</strong>
                  <span>Within 24 hours</span>
                </div>
              </div>
            </div>
            <div className="contact-form-container">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    name="message"
                    id="message"
                    rows="6"
                    value={formData.message}
                    required
                    disabled={loading}
                    placeholder="Tell me about your project or just say hello.."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
                {status.message && (
                  <div className={`form-status ${status.type}`}>
                    {status.message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
