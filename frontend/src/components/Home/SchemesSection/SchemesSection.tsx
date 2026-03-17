"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Zap,
  Plug,
  Building,
  Smartphone,
  Target,
  DollarSign,
  Gift,
  TrendingUp,
  Leaf,
  Battery,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SchemesSection() {
  const centralScheme = {
    icon: Home,
    title: "PM Surya Ghar Muft Bijli Yojana",
    type: "Central Government Scheme",
    description: "Government of India's flagship program for rooftop solar installation with comprehensive benefits.",
    features: [
      { icon: DollarSign, text: "Government provides financial assistance for rooftop solar installation" },
      { icon: Zap, text: "Install solar panels on your house or workplace roof" },
      { icon: Plug, text: "Excess electricity can be sent to the grid and credited to your bill" },
      { icon: Home, text: "Special benefits for individual households" },
      { icon: Building, text: "Businesses can install systems with policy support" },
      { icon: Smartphone, text: "Easy registration through official government portal" },
    ],
    color: "green",
  };

  const benefits = [
    { icon: TrendingDown, title: "Reduce Electricity Bills", desc: "Save up to 50–90% on monthly EB charges" },
    { icon: Gift, title: "Free Electricity (Partial)", desc: "Up to 300 units free power/month based on usage & system size" },
    { icon: TrendingUp, title: "Long-Term Savings", desc: "Solar panels last 20–25 years → huge return on investment" },
    { icon: Leaf, title: "Eco-Friendly Energy", desc: "Reduce carbon footprint and support clean energy" },
    { icon: Battery, title: "Energy Independence", desc: "Less dependency on power cuts and rising tariffs" },
    { icon: Home, title: "Increase Property Value", desc: "Solar-enabled buildings have higher resale value" },
  ];

  const tamilNaduScheme = {
    icon: Target,
    title: "Chief Minister Solar Rooftop Capital Incentive Scheme",
    type: "Tamil Nadu State Government",
    description: "Additional state-level benefits for Tamil Nadu residents, managed by TEDA.",
    features: [
      "₹20,000 per kW subsidy (extra over central)",
      "Managed by TEDA",
      "For homes & small businesses",
      "Much lower total cost",
      "Faster installation approval",
      "Ideal for Madurai houses & shops",
    ],
    color: "amber",
  };

  return (
    <section id="schemes" className="section-padding bg-linear-to-br from-emerald-600 to-teal-800">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <Badge className="bg-green-100 text-green-600 hover:bg-green-200 border-green-200 px-4 py-2 font-semibold mb-6">
            Government Solar Schemes (India)
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white mb-6">
            GOVERNMENT <span className="text-gradient-solar">SOLAR</span> <br />
            SCHEMES
          </h2>
          <p className="text-lg text-green-50 font-medium max-w-3xl mx-auto">
            Take advantage of government subsidies and incentives to make solar energy more affordable for your home or business.
          </p>
        </div>

        {/* Central Government Scheme - Split Layout */}
        <div className="mb-12">
          <Card className="card-professional group overflow-hidden border-2 border-green-200 hover:border-green-300">
            <CardHeader className="p-8 pb-6 bg-linear-to-r from-green-50 to-emerald-50">
              <div className="flex items-start justify-between mb-6">
                <div className="bg-green-500 p-4 rounded-2xl shadow-lg">
                  <centralScheme.icon className="h-8 w-8 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200 font-semibold">
                  {centralScheme.type}
                </Badge>
              </div>
              <CardTitle className="text-3xl font-black text-gray-900 mb-4">
                {centralScheme.title}
              </CardTitle>
              <p className="text-gray-600 text-lg leading-relaxed">
                {centralScheme.description}
              </p>
            </CardHeader>

            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Left Side - Key Features */}
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    ⚙️ Key Features
                  </h4>
                  <div className="space-y-4">
                    {centralScheme.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <feature.icon className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700 font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side - Customer Benefits */}
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    🎯 Customer Benefits
                  </h4>
                  <div className="space-y-4">
                    {benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <benefit.icon className="h-5 w-5 text-orange-500 mt-1 shrink-0" />
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{benefit.title}</div>
                          <div className="text-gray-600 text-sm">{benefit.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tamil Nadu State Scheme */}
        <div>
          <Card className="card-professional group overflow-hidden border-2 border-amber-200 hover:border-amber-300">
            <CardHeader className="p-8 pb-6 bg-linear-to-r from-amber-50 to-orange-50">
              <div className="flex items-start justify-between mb-6">
                <div className="bg-amber-500 p-4 rounded-2xl shadow-lg">
                  <tamilNaduScheme.icon className="h-8 w-8 text-white" />
                </div>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-semibold">
                  {tamilNaduScheme.type}
                </Badge>
              </div>
              <CardTitle className="text-3xl font-black text-gray-900 mb-4">
                {tamilNaduScheme.title}
              </CardTitle>
              <p className="text-gray-600 text-lg leading-relaxed">
                {tamilNaduScheme.description}
              </p>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Customer Benefits:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {tamilNaduScheme.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
