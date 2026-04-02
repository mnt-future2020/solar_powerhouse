import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Policy from "@/components/Policy/Policy";

export const metadata = {
  title: "Privacy Policy | Solar Power House",
  description: "Learn how Solar Power House collects, uses, and protects your personal data in connection with solar panel installation and consultation services.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000c15]">
      <Header />
      <main className="flex-1 pt-24">
        <Policy />
      </main>
      <Footer />
    </div>
  );
}
