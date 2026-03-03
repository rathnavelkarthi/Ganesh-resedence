import HeroSection from '../components/saas/HeroSection';
import LogoStrip from '../components/saas/LogoStrip';
import ProblemSection from '../components/saas/ProblemSection';
import FeatureGrid from '../components/saas/FeatureGrid';
import DashboardPreview from '../components/saas/DashboardPreview';
import WhoItsFor from '../components/saas/WhoItsFor';
import ROISection from '../components/saas/ROISection';
import TrustSection from '../components/saas/TrustSection';
import TestimonialsSection from '../components/saas/TestimonialsSection';
import PricingSection from '../components/saas/PricingSection';
import FinalCTA from '../components/saas/FinalCTA';

export default function SaaSHome() {
    return (
        <div className="flex flex-col">
            <HeroSection />
            <LogoStrip />
            <ProblemSection />
            <FeatureGrid />
            <DashboardPreview />
            <WhoItsFor />
            <ROISection />
            <TrustSection />
            <TestimonialsSection />
            <PricingSection />
            <FinalCTA />
        </div>
    );
}

