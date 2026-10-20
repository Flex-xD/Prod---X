import { MotionConfig } from 'framer-motion';
import CtaSection from './landingPage-components/CTA-Section';
import FeaturesSection from './landingPage-components/FeaturesSection';
import Footer from './landingPage-components/Footer';
import GroupSection from './landingPage-components/Group-Section';
import HeroSection from './landingPage-components/HeroSection';
import LandingNavbar from './landingPage-components/Navbar';
import RecordSection from './landingPage-components/Record-Section';
import StorySection from './landingPage-components/Story-section';
import WorkingSection from './landingPage-components/WorkingSection';

const ProdXLandingPage = () => {
    return (
        <MotionConfig reducedMotion="user">
            <div className="bg-paper text-ink">
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:border-2 focus:border-ink focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:font-bold"
                >
                    Skip to content
                </a>
                <LandingNavbar />
                <main id="main">
                    <HeroSection />
                    <StorySection />
                    <WorkingSection />
                    <RecordSection />
                    <FeaturesSection />
                    <GroupSection />
                    <CtaSection />
                </main>
                <Footer />
            </div>
        </MotionConfig>
    );
};

export default ProdXLandingPage;