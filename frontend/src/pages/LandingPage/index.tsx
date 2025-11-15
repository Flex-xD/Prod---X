import LandingNavbar from './LandingPageComponents/Navbar';
import HeroSection from './LandingPageComponents/HeroSection';
import FeaturesSection from './LandingPageComponents/FeaturesSection';
import WorkingSection from './LandingPageComponents/WorkingSection';
import Testimonials from './LandingPageComponents/Testimonial';
import Footer from './LandingPageComponents/Footer';

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