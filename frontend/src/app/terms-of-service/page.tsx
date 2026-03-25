import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Terms from "@/components/Terms/Terms";

export const metadata = {
  title: "Terms of Service | Solar Power House",
  description: "Terms and conditions governing solar panel installation, consultation, warranties, and all services provided by Solar Power House.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24">
        <Terms />
      </main>
      <Footer />
    </div>
  );
}
