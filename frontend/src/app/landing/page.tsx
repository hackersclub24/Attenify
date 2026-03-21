import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { DashboardPreview } from '@/components/landing/DashboardPreview';
import { Benefits } from '@/components/landing/Benefits';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <Benefits />
      <CTA />
      <Footer />
    </div>
  );
}
