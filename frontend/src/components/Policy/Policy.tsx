"use client";
import { Shield, Eye, Lock, Database, UserCheck, Bell, RefreshCw, Mail } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";

const sections = [
  {
    icon: Eye,
    title: "Information We Collect",
    content: [
      "Personal identification details (name, email address, phone number) provided when you request a solar consultation or quote.",
      "Property information including address, roof area, electricity consumption, and sanction load — used solely to generate accurate solar system recommendations.",
      "Technical data such as browser type, IP address, and pages visited, collected automatically to improve our website performance.",
      "Payment and billing information when you proceed with a solar installation order, processed securely through certified payment gateways.",
    ],
  },
  {
    icon: Database,
    title: "How We Use Your Information",
    content: [
      "To prepare customised solar system proposals based on your energy consumption, roof area, and applicable government subsidies (PM Surya Ghar Muft Bijli Yojana).",
      "To schedule site surveys, installation appointments, and post-installation maintenance visits.",
      "To process subsidy applications on your behalf with MNRE (Ministry of New and Renewable Energy) and DISCOM authorities.",
      "To send service updates, warranty reminders, and information about new solar products or government schemes relevant to your installation.",
      "To comply with legal obligations under the Electricity Act, 2003 and applicable renewable energy regulations.",
    ],
  },
  {
    icon: Lock,
    title: "Data Security",
    content: [
      "All personal and property data is encrypted in transit using TLS 1.2+ and at rest using AES-256 encryption.",
      "Access to customer data is restricted to authorised Solar Power House personnel involved in your project.",
      "We do not sell, rent, or trade your personal information to third parties for marketing purposes.",
      "Solar installation records, warranty documents, and subsidy paperwork are retained for a minimum of 10 years as required by MNRE guidelines.",
    ],
  },
  {
    icon: UserCheck,
    title: "Sharing With Third Parties",
    content: [
      "DISCOM (Distribution Companies) and state nodal agencies — required for net metering applications and grid connectivity approvals.",
      "MNRE-registered vendors and certified solar installers engaged to fulfil your installation order.",
      "Government portals such as the PM Surya Ghar national portal for subsidy disbursement processing.",
      "Financial institutions if you opt for solar loan or EMI financing, limited to information required for credit assessment.",
    ],
  },
  {
    icon: Bell,
    title: "Cookies & Tracking",
    content: [
      "We use essential cookies to maintain your session and remember your solar calculator inputs during a visit.",
      "Analytics cookies (Google Analytics) help us understand how visitors use our solar calculator and service pages so we can improve them.",
      "You may disable non-essential cookies through your browser settings without affecting core site functionality.",
    ],
  },
  {
    icon: RefreshCw,
    title: "Your Rights",
    content: [
      "You have the right to access, correct, or request deletion of your personal data held by Solar Power House.",
      "You may withdraw consent for marketing communications at any time by clicking 'Unsubscribe' in any email or contacting us directly.",
      "You may request a copy of all data we hold about you and your solar installation in a portable format.",
      "Requests will be processed within 30 days in accordance with applicable data protection laws.",
    ],
  },
];

export default function Policy() {
  const [email, setEmail] = useState("privacy@solarpowerhouse.com");
  const [companyName, setCompanyName] = useState("Solar Power House");

  useEffect(() => {
    axios.get('/settings')
      .then(response => {
        if (response.data.email) {
          setEmail(response.data.email);
        }
        if (response.data.companyName) {
          setCompanyName(response.data.companyName);
        }
      })
      .catch(() => {
        // Keep default values if fetch fails
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-[#000c15] py-14 sm:py-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/image/banner/solar-panel-is-set-against-blue-sky-with-sun-shining-through-it.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-linear-to-r from-[#000c15] via-[#000c15]/80 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Shield className="h-6 w-6 text-orange-400" />
            </div>
            <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">Legal</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Privacy <span className="text-amber-400">Policy</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            How Solar Power House collects, uses, and protects your personal information in connection with solar installation and consultation services.
          </p>
          <p className="text-white/40 text-sm mt-4">Last updated: March 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Intro */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12">
          <p className="text-gray-700 leading-relaxed">
            {companyName} ("we", "our", "us") is committed to protecting your privacy. This policy explains what information we collect when you use our website, request a solar consultation, or engage us for solar panel installation, and how we handle that information. By using our services, you agree to the practices described below.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map(({ icon: Icon, title, content }, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              </div>
              <ul className="space-y-3">
                {content.map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 bg-[#000c15] rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-bold">Contact Our Privacy Team</h3>
          </div>
          <p className="text-white/70 mb-4">
            For any privacy-related queries, data access requests, or concerns about your solar installation data, please reach out to us.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href={`mailto:${email}`} className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              {email}
            </a>
            <span className="text-white/30">|</span>
            <Link href="/contact" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              Contact Us →
            </Link>
          </div>
        </div>

        {/* Footer nav */}
        <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-orange-500 transition-colors">← Back to Home</Link>
          <span>|</span>
          <Link href="/terms-of-service" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}
