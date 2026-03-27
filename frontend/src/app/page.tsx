import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import HeroSection from "@/components/Home/HeroSection/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection/FeaturesSection";
import ServicesSection from "@/components/Home/ServicesSection/ServicesSection";
import SchemesSection from "@/components/Home/SchemesSection/SchemesSection";
import ConsultationSection from "@/components/Home/ConsultationSection/ConsultationSection";
import QuickLinks from "@/components/Home/QuickLinks/QuickLinks";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main >
        <HeroSection />
        <QuickLinks />
        <ServicesSection />
        <SchemesSection />
        <ConsultationSection />
      </main>
      <Footer />
    </div>
  );
}
