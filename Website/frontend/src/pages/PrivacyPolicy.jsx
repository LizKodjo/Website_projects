import Hero from "../components/Hero/Hero";
import HeroSection from "../components/Hero/HeroSection";
import styles from "./PrivacyPolicy.module.scss";

export default function PrivacyPolicy() {
  return (
    <>
      <HeroSection heading="Privacy Policy" />
      <section className={styles.privacy}>
        <div className={styles.content}>
          {/* <h1 className={`${styles.heading} gold-gradient`}>Privacy Policy</h1>
          <h2 className={`${styles.subheading} gold=gradient`}>
            Elizabeth Kodjo
          </h2> */}
          <p className={styles.intro}>
            This Privacy Policy outlines how we handle the information you
            provide while using our website.
          </p>

          <div className={styles.section}>
            <h3 className="gold-gradient">Data Collection</h3>
            <p>
              We collect personal information only when necessary to provide
              services, respond to inquiries or improve user experience.
            </p>
          </div>
          <div className={styles.section}>
            <h3 className="gold-gradient">Analytics</h3>
            <p>
              We use analytics tools to understand how visitors interact with
              our site. This helps us improve performance and usability
            </p>
          </div>
          <div className={styles.section}>
            <h3 className="gold-gradient">Your Rights</h3>
            <p>
              You have the right to access, correct or delete your personal
              data. Contact us via the form on our Contact page to make a
              request.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
