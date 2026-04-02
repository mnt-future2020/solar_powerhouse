import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import MetadataProvider from "@/components/providers/MetadataProvider";
import FloatingContactProvider from "@/components/providers/FloatingContactProvider";

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
    <html lang="en" className="h-full">
      <body className="antialiased bg-white text-gray-900 h-full">
        <AuthProvider>
          <MetadataProvider />
          {children}
          <FloatingContactProvider />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
