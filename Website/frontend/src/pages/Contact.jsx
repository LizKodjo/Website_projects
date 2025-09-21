import styles from "./Contact.module.scss";
import portrait from "../assets/catOnCar.jpg";

export default function Contact() {
  return (
    <>
      <section className={styles.contact}>
        <div className={styles.top}>
          <div className={styles.text}>
            <h1 className={`gold-gradient ${styles.heading}`}>Contact</h1>
            <h2 className={`gold-gradient ${styles.subheading}`}>
              Hi I'm Elizabeth Kodjo
            </h2>
            <p className={styles.message}>
              Let's get in touch to discuss potential collaborations or
              inquiries you may have.
            </p>
          </div>
          <div className={styles.imageContainer}>
            <img
              src={portrait}
              alt="Elizabeth Kodjo"
              className={styles.image}
            />
          </div>
        </div>

        <div className={styles.intro}>
          <p className={styles.label}>Intro</p>
          <h2 className={`gold-gradient ${styles.name}`}>Elizabeth Kodjo</h2>
          <p className={styles.message}>
            Let's get in touch to discuss potential collaboations or inquiries
            you may have.
          </p>
        </div>
        <div className={styles.featured}>
          <div className={styles.featureText}>
            <h2 className={`gold-gradient ${styles.heading}`}>Featured Work</h2>
            <p className={styles.label}>Get In Touch</p>
            <h2 className={`gold-gradient ${styles.name}`}>Elizabeth Kodjo</h2>
            <p className={styles.message}>
              Let's get in touch to discuss potential collaboration or inquiries
              you may have.
            </p>
          </div>
          <div className={styles.contactBox}>
            <p>
              <strong>Email:</strong>contact@test.com
            </p>
            <p>
              <strong>Phone:</strong>+44 1234 567890
            </p>
            <p>
              <strong>Location:</strong>London, United Kingdom
            </p>
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.label}>Skills Snapshot</p>
        </div>
      </section>
      {/* <section className={styles.contact}>
        <div className={styles.content}>
          <h1 className={styles.heading}>Let's Connect</h1>
          <p className={styles.intro}>
            Whether you're looking to collaborate, hire or just say hello - drop
            me a message and I'll get back to you
          </p>

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Your Name"
              className={styles.input}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className={styles.input}
              required
            />
            <textarea
              placeholder="Your Message"
              className={styles.textarea}
              rows="5"
              required
            ></textarea>
            <button type="submit" className={styles.button}>
              Send Message
            </button>
          </form>
        </div>
      </section> */}
    </>
  );
}
