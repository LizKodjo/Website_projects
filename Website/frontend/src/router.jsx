import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import AdminLogin from "./components/AdminLogin/AdminLogin";

export default function Router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/login" element={<AdminLogin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
