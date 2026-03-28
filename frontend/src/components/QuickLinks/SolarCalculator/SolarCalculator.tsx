"use client";
import { useState } from "react";
import {
  Banknote, Sun, ArrowRight, Calculator,
  MapPin, Minus, Plus, Grid3X3, Bolt, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SolarCalculator() {
  const [formData, setFormData] = useState({
    pincode: '',
    powerPhase: 'single',
    tariffRate: 7,
    monthlyBill: '' as string | number,
    roofArea: '' as string | number,
    roofUnit: 'sqft' as 'sqft' | 'sqm',
    sanctionLoad: '' as string | number,
  });

  const [results, setResults] = useState<{
    recommendedCapacityKwp: number;
    requiredAreaSqft: number;
    requiredAreaSqm: number;
    billSavingsPct: number;
    annualSavings: number;
    subsidyAmount: number;
    netCost: number;
    paybackYears: number;
  } | null>(null);

  const [showResultsModal, setShowResultsModal] = useState(false);

  const householdSubsidy = [
    { range: "Up to 2 kW",            amount: "Rs. 30,000", perKw: true },
    { range: "Additional up to 3 kW", amount: "Rs. 18,000", perKw: true },
    { range: "Larger than 3 kW",      amount: "Rs. 78,000", perKw: false, suffix: "Total capped subsidy" },
  ];

  const computeResults = () => {
    const bill        = Number(formData.monthlyBill) || 0;
    const tariff      = Number(formData.tariffRate)  || 7;
    const roofRaw     = Number(formData.roofArea)    || 0;
    const sanction    = Number(formData.sanctionLoad) || 0;
    const roofSqft    = formData.roofUnit === 'sqm' ? roofRaw * 10.764 : roofRaw;

    const monthlyUnits      = tariff > 0 ? bill / tariff : 0;
    const capacityByBill    = monthlyUnits / 120;
    const capacityByRoof    = roofSqft   > 0 ? roofSqft / 120 : Infinity;
    const capacityBySanction = sanction  > 0 ? sanction        : Infinity;
    const kWp = Math.round(Math.min(capacityByBill, capacityByRoof, capacityBySanction) * 100) / 100;

    const annualSavings  = Math.round(kWp * 120 * 12 * tariff);
    const billSavingsPct = bill > 0 ? Math.min(100, Math.round((annualSavings / (bill * 12)) * 100)) : 0;

    let subsidy = 0;
    if (kWp <= 2)      subsidy = kWp * 30000;
    else if (kWp <= 3) subsidy = 60000 + (kWp - 2) * 18000;
    else               subsidy = 78000;
    subsidy = Math.round(subsidy);

    const totalCost  = Math.round(kWp * 60000);
    const netCost    = totalCost - subsidy;
    const payback    = annualSavings > 0 ? Math.round((netCost / annualSavings) * 10) / 10 : 0;

    setResults({
      recommendedCapacityKwp: kWp,
      requiredAreaSqft: Math.round(kWp * 120),
      requiredAreaSqm:  Math.round(kWp * 11.15),
      billSavingsPct,
      annualSavings,
      subsidyAmount: subsidy,
      netCost,
      paybackYears: payback,
    });
    setShowResultsModal(true);
  };

  const set = (field: string, value: string | number) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const inc = (field: string) =>
    setFormData(prev => ({ ...prev, [field]: Math.min(30, (prev[field as keyof typeof prev] as number) + 1) }));

  const dec = (field: string) =>
    setFormData(prev => ({ ...prev, [field]: Math.max(4,  (prev[field as keyof typeof prev] as number) - 1) }));

  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden">

      {/* Full-bleed background */}
      <div className="absolute inset-0">
        <img
          src="/assets/image/banner/solar-panel-is-set-against-blue-sky-with-sun-shining-through-it.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a]/85 via-[#0a0a0a]/70 to-[#0a0a0a]/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* LEFT — Info */}
          <div className="text-white space-y-6">
            <div className="space-y-3">
              <p className="text-amber-400/70 font-semibold text-xs uppercase tracking-[0.15em]">Solar Calculator</p>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Calculate Your{' '}
                <span className="text-amber-400">Solar Savings</span>
              </h1>
              <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-lg">
                Discover how much you can save with solar power and get personalized recommendations with government subsidies.
              </p>
            </div>

            {/* PM Surya Ghar card */}
            <div className="flex gap-3 bg-white/4 border border-white/8 rounded-xl p-4">
              <div className="shrink-0 w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Sun className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="font-semibold text-sm text-white">PM Surya Ghar Muft Bijli Yojana</p>
                <p className="text-xs text-white/40 mt-0.5 leading-relaxed">
                  Transform your rooftop into a power source. Eliminate electricity bills with comprehensive government subsidies.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-medium">Up to ₹78,000 Subsidy</span>
                  <span className="px-2.5 py-0.5 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-400 text-xs font-medium">6.75% Interest Rate</span>
                </div>
              </div>
            </div>

            {/* Subsidy structure */}
            <div className="bg-white/4 border border-white/8 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Banknote className="h-4 w-4 text-amber-400" />
                Government Subsidy Structure
              </h3>
              <div className="space-y-2">
                {householdSubsidy.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/3 border border-white/6 hover:border-amber-500/20 transition-colors duration-200">
                    <span className="text-xs font-medium text-white">{item.range}</span>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-400">{item.amount}</span>
                      <p className="text-[10px] text-white/40">{item.perKw ? 'per kW' : item.suffix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — White form card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl w-full">
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="h-5 w-5 text-amber-500" />
              <h4
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Solar Calculator
              </h4>
            </div>
            <p className="text-sm text-gray-400 mb-5">Get personalized solar recommendations for your property.</p>

            <div className="space-y-4">

              {/* Pincode */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  <MapPin className="inline h-3 w-3 mr-1" />PINCODE
                </label>
                <Input value={formData.pincode} onChange={e => set('pincode', e.target.value)} placeholder="Enter Your Pincode" />
              </div>

              {/* Phase */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">POWER SUPPLY PHASE</label>
                <div className="flex gap-3">
                  {['single', 'three'].map(p => (
                    <button key={p} type="button" onClick={() => set('powerPhase', p)}
                      className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                        formData.powerPhase === p
                          ? 'bg-amber-50 border-amber-300 text-amber-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}>
                      {p === 'single' ? 'Single Phase' : 'Three Phase'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tariff */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">TARIFF RATES: {formData.tariffRate} INR</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs">4</span>
                  <input type="range" min="4" max="30" value={formData.tariffRate}
                    onChange={e => set('tariffRate', parseInt(e.target.value))}
                    aria-label="Tariff rate slider"
                    aria-valuemin={4}
                    aria-valuemax={30}
                    aria-valuenow={formData.tariffRate}
                    aria-valuetext={`${formData.tariffRate} INR per unit`}
                    className="flex-1 h-2 rounded-lg appearance-none cursor-pointer tariff-slider"
                    style={{ background: `linear-gradient(to right, #f59e0b ${((formData.tariffRate - 4) / 26) * 100}%, #e5e7eb ${((formData.tariffRate - 4) / 26) * 100}%)` }}
                  />
                  <span className="text-gray-400 text-xs">30</span>
                  <div className="flex items-center gap-1 ml-1">
                    <button type="button" onClick={() => dec('tariffRate')} className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-gray-900 font-bold text-sm">{formData.tariffRate}</span>
                    <button type="button" onClick={() => inc('tariffRate')} className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Monthly Bill */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">MONTHLY ELECTRICITY BILL</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <Input type="number" value={formData.monthlyBill} onChange={e => set('monthlyBill', e.target.value)}
                    className="pl-7 pr-12" placeholder="Enter bill amount" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">INR</span>
                </div>
              </div>

              {/* Roof Area */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  <Grid3X3 className="inline h-3 w-3 mr-1" />AVAILABLE ROOF TOP AREA
                </label>
                <div className="flex gap-4 mb-2">
                  {(['sqft', 'sqm'] as const).map(u => (
                    <label key={u} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="roofUnit" value={u} checked={formData.roofUnit === u}
                        onChange={() => set('roofUnit', u)} className="w-4 h-4 accent-amber-500" />
                      <span className="text-sm text-gray-700">{u === 'sqft' ? 'Sq.ft' : 'Sq.m'}</span>
                    </label>
                  ))}
                </div>
                <div className="relative">
                  <Input type="number" value={formData.roofArea} onChange={e => set('roofArea', e.target.value)}
                    placeholder={formData.roofUnit === 'sqft' ? 'Enter area in Sq.ft' : 'Enter area in Sq.m'} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    {formData.roofUnit === 'sqft' ? 'Sq.ft' : 'Sq.m'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">*Note: 1kW system requires ~120 sq.ft area</p>
              </div>

              {/* Sanction Load */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  <Bolt className="inline h-3 w-3 mr-1" />SANCTION LOAD
                </label>
                <div className="relative">
                  <Input type="number" value={formData.sanctionLoad} onChange={e => set('sanctionLoad', e.target.value)}
                    placeholder="Enter sanction load" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">kW</span>
                </div>
              </div>

              {/* Submit */}
              <Button onClick={computeResults}
                className="w-full bg-amber-500 hover:bg-amber-600 text-[#000c15] font-bold py-5 text-sm sm:text-base transition-colors duration-200 mt-2">
                <span className="flex items-center justify-center gap-2">
                  GENERATE RESULT <ArrowRight className="h-4 w-4" />
                </span>
              </Button>

              <p className="text-xs text-gray-400 text-center">Your information is private and will never be shared.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Results Modal */}
      {showResultsModal && results && (
        <div className="fixed inset-0 bg-[#0a0a0a]/60 flex items-center justify-center z-50 p-4" onClick={() => setShowResultsModal(false)}>
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Solar Calculator Results
              </h2>
              <button onClick={() => setShowResultsModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                aria-label="Close results">
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            {/* Badge */}
            <div className="px-6 pt-4">
              <span className="inline-block px-4 py-1.5 rounded-lg bg-amber-500 text-[#000c15] text-sm font-bold">On-Grid</span>
            </div>

            {/* Recommendation */}
            <div className="p-6 space-y-5">
              <h3 className="text-lg font-bold text-gray-900">Our Recommendation</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* System details */}
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <Sun className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="text-sm font-bold text-gray-900">Recommended System</h4>
                      {[
                        { label: 'System Size',    value: `${results.recommendedCapacityKwp} kWp` },
                        { label: 'Annual Savings', value: `₹${results.annualSavings.toLocaleString()}`, green: true },
                        { label: 'Subsidy',        value: `₹${results.subsidyAmount.toLocaleString()}`, green: true },
                        { label: 'Payback Period', value: `${results.paybackYears} years` },
                      ].map(({ label, value, green }) => (
                        <div key={label} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                          <span className="text-gray-700 text-xs">{label}: <span className={`font-bold ${green ? 'text-emerald-600' : 'text-gray-900'}`}>{value}</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Area + savings */}
                <div className="space-y-3">
                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Required Area</p>
                      <p className="text-xl font-bold text-gray-900">{results.requiredAreaSqft} sq.ft</p>
                      <p className="text-sm text-gray-400">{results.requiredAreaSqm} sq.m</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                      <Grid3X3 className="h-5 w-5 text-sky-600" />
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">Bill Savings</p>
                      <p className="text-2xl font-bold text-gray-900">{results.billSavingsPct}%</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Banknote className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <p className="text-xs text-amber-700 font-medium">*Above plant size is only indicative and derived based on your inputs.</p>
                <p className="text-xs text-amber-700 font-medium">The actual plant size capacity will be based on available rooftop area.</p>
                <p className="text-xs text-amber-700 font-medium">If the area available is more than the recommended area required, higher capacities can be installed and vice-versa.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
