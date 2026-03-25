import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SessionProvider from "@/components/providers/SessionProvider";
import MetadataProvider from "@/components/providers/MetadataProvider";

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
      <body className="antialiased bg-white text-gray-900">
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
