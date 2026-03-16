import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import HeroSection from '@/components/Home/HeroSection/HeroSection';
import FeaturesSection from '@/components/Home/FeaturesSection/FeaturesSection';
import ServicesSection from '@/components/Home/ServicesSection/ServicesSection';
import SchemesSection from '@/components/Home/SchemesSection/SchemesSection';
import ConsultationSection from '@/components/Home/ConsultationSection/ConsultationSection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <SchemesSection />
        <FeaturesSection />
        <ConsultationSection />
      </main>
      <Footer />
    </div>
  );
}
