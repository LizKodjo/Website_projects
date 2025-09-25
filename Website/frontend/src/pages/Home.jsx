import Hero from "../components/Hero/Hero";
import AboutPreview from "../components/AboutPreview/AboutPreview";
import PortfolioPreview from "../components/PortfolioPreview/PortfolioPreview";

import ContactCTA from "../components/ContactCTA/ContactCTA";
import HeroSection from "../components/Hero/HeroSection";

export default function Home() {
  return (
    <>
      <HeroSection heading="Full Stack Python Developer" />
      <div id="next-section"></div>
      <AboutPreview />
      <PortfolioPreview />
      <ContactCTA />
    </>
  );
}
