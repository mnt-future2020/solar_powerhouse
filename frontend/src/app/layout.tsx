import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SessionProvider from "@/components/providers/SessionProvider";
import MetadataProvider from "@/components/providers/MetadataProvider";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Solar Power House - Leading Solar energy solutions",
  description: "Advanced sustainable solar energy solutions for modern homes and smart businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans antialiased bg-white text-gray-900`}>
        <SessionProvider>
          <MetadataProvider />
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
