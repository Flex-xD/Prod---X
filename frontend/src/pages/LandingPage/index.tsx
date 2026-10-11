import FeaturesSection from "./landingPage-components/FeaturesSection";
import Footer from "./landingPage-components/Footer";
import HeroSection from "./landingPage-components/HeroSection";
import LandingNavbar from "./landingPage-components/Navbar";
import Testimonials from "./landingPage-components/Testimonial";
import WorkingSection from "./landingPage-components/WorkingSection";
import StorySection from "./landingPage-components/Story-section";
import CtaSection from "./landingPage-components/CTA-Section";

const ProdXLandingPage = () => {
    return (
        <div className="bg-white">
            <LandingNavbar />
            <HeroSection />
            <StorySection />
            <FeaturesSection />
            <WorkingSection />
            <Testimonials />
            <CtaSection />
            <Footer />
        </div>
    );
};

export default ProdXLandingPage;