import { NavLink } from "react-router";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={`${styles.brand} gold-gradient`}>
          &copy; {new Date().getFullYear()} Elizabeth Kodjo IT Ltd
        </div>
        <ul className={styles.links}>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/portfolio">Portfolio</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          <li>
            <NavLink to="/privacy-policy">Privacy Policy</NavLink>
          </li>
        </ul>
      </footer>
    </>
  );
}
