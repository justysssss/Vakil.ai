import Header from "@/components/landing-page/Header";
import HeroSection from "@/components/landing-page/HeroSection";
import FeaturesSection from "@/components/landing-page/FeaturesSection";
import HowItWorksSection from "@/components/landing-page/HowItWorksSection";
import PricingSection from "@/components/landing-page/PricingSection";
import CTASection from "@/components/landing-page/CTASection";
import Footer from "@/components/landing-page/Footer";

export default function Home() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="how-it-works">
          <HowItWorksSection />
        </section>
        <section id="pricing">
          <PricingSection />
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
