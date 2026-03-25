"use client";
import { FileText, Wrench, AlertTriangle, CreditCard, ShieldCheck, RotateCcw, Scale, Phone } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    icon: Wrench,
    title: "Solar Installation Services",
    content: [
      "Solar Power House provides design, supply, installation, and commissioning of rooftop solar photovoltaic (PV) systems for residential, commercial, and industrial properties.",
      "All installations are carried out by MNRE-certified solar engineers and technicians in compliance with CEA (Central Electricity Authority) technical standards.",
      "The system design — including panel capacity (kWp), inverter rating, mounting structure, and wiring — is based on the site survey report and your approved sanction load from the DISCOM.",
      "Any changes to the agreed system design after work order confirmation may attract additional charges and revised timelines.",
      "Net metering applications and DISCOM approvals are facilitated by Solar Power House but are subject to the respective state electricity board's processing timelines.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Warranties & Guarantees",
    content: [
      "Solar panels carry a 25-year linear performance warranty from the manufacturer, guaranteeing at least 80% of rated output at year 25.",
      "Inverters are covered by a 5-year manufacturer warranty, extendable to 10 years with an optional AMC (Annual Maintenance Contract).",
      "Mounting structures carry a 10-year structural warranty against corrosion and mechanical failure under normal weather conditions.",
      "Solar Power House provides a 1-year workmanship warranty covering installation defects, wiring faults, and mounting issues.",
      "Warranties are void if the system is tampered with, modified, or serviced by non-authorised personnel.",
    ],
  },
  {
    icon: CreditCard,
    title: "Payment Terms",
    content: [
      "A booking advance of 30% of the total project cost is required to confirm the work order and initiate material procurement.",
      "A further 60% is due upon delivery of materials to site and commencement of installation.",
      "The remaining 10% balance is payable upon successful commissioning and handover of the system.",
      "Government subsidy amounts (under PM Surya Ghar Muft Bijli Yojana or state schemes) are credited directly to your bank account by the nodal agency and are not deducted upfront from our invoice.",
      "EMI and solar loan financing options are available through our partner financial institutions, subject to their credit assessment and approval.",
      "All prices are inclusive of GST at the applicable rate (currently 12% on solar panels and 18% on installation services).",
    ],
  },
  {
    icon: RotateCcw,
    title: "Cancellation & Refund Policy",
    content: [
      "Cancellations made within 48 hours of booking confirmation are eligible for a full refund of the advance payment.",
      "Cancellations after 48 hours but before material procurement will attract a 10% administrative charge on the advance.",
      "Once materials have been procured or installation has commenced, cancellations are not eligible for a refund of material costs.",
      "Refunds, where applicable, will be processed within 14 working days to the original payment method.",
      "Solar Power House reserves the right to cancel a work order if site conditions are found to be unsuitable for safe installation, with a full refund of any advance paid.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Limitations of Liability",
    content: [
      "Solar generation estimates provided through our solar calculator are indicative only and based on average peak sun hours for your region. Actual generation may vary due to weather, shading, soiling, and grid availability.",
      "Solar Power House is not liable for delays in DISCOM net metering approvals, subsidy disbursements, or grid connectivity, as these are governed by state electricity regulations.",
      "We are not responsible for damage to the solar system caused by acts of God (cyclones, floods, lightning strikes), vandalism, or structural failure of the building on which the system is mounted.",
      "Our total liability for any claim arising from installation services shall not exceed the total contract value paid by the customer.",
    ],
  },
  {
    icon: Scale,
    title: "Governing Law & Disputes",
    content: [
      "These terms are governed by the laws of India, including the Electricity Act 2003, Consumer Protection Act 2019, and applicable state solar policies.",
      "Any disputes arising from solar installation contracts shall first be attempted to be resolved through mutual negotiation within 30 days.",
      "Unresolved disputes shall be referred to arbitration under the Arbitration and Conciliation Act, 1996, with the seat of arbitration in Chennai, Tamil Nadu.",
      "For consumer grievances, customers may also approach the State Consumer Disputes Redressal Commission.",
    ],
  },
  {
    icon: FileText,
    title: "Intellectual Property",
    content: [
      "All content on this website — including solar system designs, calculation methodologies, images, and text — is the intellectual property of Solar Power House.",
      "You may not reproduce, distribute, or use our content for commercial purposes without prior written consent.",
      "The Solar Power House name, logo, and tagline 'Powering Future' are registered trademarks and may not be used without authorisation.",
    ],
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-[#000c15] py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/image/banner/contact.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-linear-to-r from-[#000c15] via-[#000c15]/80 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <FileText className="h-6 w-6 text-orange-400" />
            </div>
            <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">Legal</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Terms of <span className="text-amber-400">Service</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            The terms and conditions governing solar panel installation, consultation, warranties, and all services provided by Solar Power House.
          </p>
          <p className="text-white/40 text-sm mt-4">Last updated: March 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Intro */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12">
          <p className="text-gray-700 leading-relaxed">
            By engaging Solar Power House for a solar consultation, site survey, or installation project, you agree to be bound by these Terms of Service. Please read them carefully before confirming any work order. These terms apply to all residential, commercial, and industrial solar installations carried out by Solar Power House across India.
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
            <Phone className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-bold">Questions About These Terms?</h3>
          </div>
          <p className="text-white/70 mb-4">
            If you have any questions about our terms of service, installation contracts, or warranty conditions, our team is happy to help.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="mailto:legal@solarpowerhouse.com" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              legal@solarpowerhouse.com
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
          <Link href="/privacy-policy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
