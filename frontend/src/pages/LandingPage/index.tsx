import FeaturesSection from "./landingPage-components/FeaturesSection";
import Footer from "./landingPage-components/Footer";
import HeroSection from "./landingPage-components/HeroSection";
import LandingNavbar from "./landingPage-components/Navbar";
import Testimonials from "./landingPage-components/Testimonial";
import WorkingSection from "./landingPage-components/WorkingSection";

const ProdXLandingPage = () => {

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Navbar */}
            <LandingNavbar />
            {/* Hero Section */}
            <HeroSection />
            {/*  Features Section */}
            <FeaturesSection />
            {/* How It Works Section */}
            <WorkingSection />
            {/* Testimonials Section */}
            <Testimonials />
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ProdXLandingPage;