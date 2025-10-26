import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Layout/Footer";
import Projects from "./pages/Projects";
import Navbar from "./components/Layout/Navbar";
import Contact from "./pages/Contact";
import ScrollToTop from "./components/Layout/ScrollToTop";
function App() {
  return (
    <>
      <Router>
        <div className="App">
          <ScrollToTop />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
