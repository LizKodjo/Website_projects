import Hero from "../components/Hero/Hero";
import AboutPreview from "../components/AboutPreview/AboutPreview";
import PortfolioPreview from "../components/PortfolioPreview/PortfolioPreview";

import ContactCTA from "../components/ContactCTA/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <PortfolioPreview />
      <ContactCTA />
    </>
  );
}
