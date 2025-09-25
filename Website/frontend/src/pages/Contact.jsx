import styles from "./Contact.module.scss";
import HeroSection from "../components/Hero/HeroSection";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await fetch("http://localhost:5001/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("Message sent successfully!");
      } else {
        setStatus(data.error || "Something went wrong.");
      }
    } catch (err) {
      setStatus("Network error. Please try again.");
    }
  };

  return (
    <>
      <HeroSection heading="Contact" />

      <section className={styles.contactSection} id="next-section">
        <div className={styles.intro}>
          <p className={styles.label}>Intro</p>
          <h2 className={`gold-gradient ${styles.name}`}>Elizabeth Kodjo</h2>
          <p className={styles.message}>
            Let's get in touch to discuss potential collaborations or inquiries
            you may have.
          </p>
        </div>

        <div className={styles.featured}>
          <div className={styles.contactBox}>
            <p>
              <strong>Email:</strong> contact@test.com
            </p>
            <p>
              <strong>Phone:</strong> +44 1234 567890
            </p>
            <p>
              <strong>Location:</strong> London, United Kingdom
            </p>
          </div>
        </div>

        <div className={styles.formWrapper}>
          <h2 className={`gold-gradient ${styles.heading}`}>Let's Connect</h2>
          <p className={styles.subtext}>
            Whether you're looking to collaborate, hire, or just say hello—drop
            me a message and I'll get back to you.
          </p>
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit">Send Message</button>
            {status && <p className={styles.status}>{status}</p>}
          </form>
        </div>
      </section>
    </>
  );
}
