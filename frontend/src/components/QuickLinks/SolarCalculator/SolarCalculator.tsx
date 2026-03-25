"use client";
import { useState } from "react";
import {
  Home,
  Zap,
  Building,
  Info,
  Banknote,
  Percent,
  CheckCircle2,
  Sun,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Calculator,
  MapPin,
  Target,
  Minus,
  Plus,
  Grid3X3,
  Bolt,
  Leaf,
  BadgeCheck,
  X
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
    sanctionLoad: '' as string | number
  });

  const [results, setResults] = useState<{
    // On-Grid
    recommendedCapacityKwp: number;
    requiredAreaSqft: number;
    requiredAreaSqm: number;
    billSavingsPct: number;
    annualSavings: number;
    subsidyAmount: number;
    totalCost: number;
    netCost: number;
    paybackYears: number;
    // Off-Grid
    systemSizeKwp: number;
    invertorKva: number;
    invertorVoltage: number;
    batteryAh: number;
    powerBackupHours: number;
  } | null>(null);

  const [showResultsModal, setShowResultsModal] = useState(false);
  const [gridType, setGridType] = useState<'on-grid' | 'off-grid'>('on-grid');
  const [appliances, setAppliances] = useState([
    { name: 'Lights(CFL)', quantity: 1, watt: 30, workingHours: 1 },
    { name: 'Lights(LED)', quantity: 1, watt: 10, workingHours: 1 },
    { name: 'Fan', quantity: 1, watt: 60, workingHours: 1 },
    { name: 'Television', quantity: 1, watt: 120, workingHours: 1 },
  ]);

  // Scheme data from SchemesSection
  const householdSubsidy = [
    { range: "Up to 2 kW", amount: "Rs. 30,000", perKw: true },
    { range: "Additional up to 3 kW", amount: "Rs. 18,000", perKw: true },
    { range: "Larger than 3 kW", amount: "Rs. 78,000", perKw: false, suffix: "Total capped subsidy" },
  ];



  const computeResults = () => {
    const bill = Number(formData.monthlyBill) || 0;
    const tariff = Number(formData.tariffRate) || 7;
    const roofAreaRaw = Number(formData.roofArea) || 0;
    const sanctionLoad = Number(formData.sanctionLoad) || 0;

    // Normalise roof area to sq.ft
    const roofAreaSqft = formData.roofUnit === 'sqm' ? roofAreaRaw * 10.764 : roofAreaRaw;

    // ── ON-GRID ──────────────────────────────────────────────
    const monthlyUnits = tariff > 0 ? bill / tariff : 0;
    // 1 kWp generates ~120 units/month (avg 4 peak sun hours, 80% efficiency)
    const capacityByBill = monthlyUnits / 120;
    const capacityByRoof = roofAreaSqft > 0 ? roofAreaSqft / 120 : Infinity;
    const capacityBySanction = sanctionLoad > 0 ? sanctionLoad : Infinity;
    const rawCapacity = Math.min(capacityByBill, capacityByRoof, capacityBySanction);
    const recommendedCapacityKwp = Math.round(rawCapacity * 100) / 100;

    const requiredAreaSqft = Math.round(recommendedCapacityKwp * 120);
    const requiredAreaSqm = Math.round(recommendedCapacityKwp * 11.15);

    const annualUnitsSaved = recommendedCapacityKwp * 120 * 12;
    const annualSavings = Math.round(annualUnitsSaved * tariff);
    const billSavingsPct = bill > 0 ? Math.min(100, Math.round((annualSavings / (bill * 12)) * 100)) : 0;

    // PM Surya Ghar subsidy
    let subsidyAmount = 0;
    if (recommendedCapacityKwp <= 2) {
      subsidyAmount = recommendedCapacityKwp * 30000;
    } else if (recommendedCapacityKwp <= 3) {
      subsidyAmount = 2 * 30000 + (recommendedCapacityKwp - 2) * 18000;
    } else {
      subsidyAmount = 78000;
    }
    subsidyAmount = Math.round(subsidyAmount);

    const totalCost = Math.round(recommendedCapacityKwp * 60000);
    const netCost = totalCost - subsidyAmount;
    const paybackYears = annualSavings > 0 ? Math.round((netCost / annualSavings) * 10) / 10 : 0;

    // ── OFF-GRID ─────────────────────────────────────────────
    const dailyLoadWh = appliances.reduce(
      (sum, a) => sum + a.quantity * a.watt * a.workingHours, 0
    );
    const peakSunHours = 5;
    const systemSizeKwp = Math.round((dailyLoadWh / (peakSunHours * 1000 * 0.8)) * 100) / 100;
    const totalInstantW = appliances.reduce((sum, a) => sum + a.quantity * a.watt, 0);
    const invertorKva = Math.max(0.5, Math.ceil((totalInstantW / 0.8) / 500) * 0.5);
    const invertorVoltage = invertorKva <= 1 ? 12 : invertorKva <= 2 ? 24 : 48;
    const batteryAh = Math.max(100, Math.ceil((dailyLoadWh / invertorVoltage) / 0.5 / 100) * 100);
    const powerBackupHours = dailyLoadWh > 0
      ? Math.round(((batteryAh * invertorVoltage * 0.5) / (dailyLoadWh / 24)) * 10) / 10
      : 0;

    setResults({
      recommendedCapacityKwp,
      requiredAreaSqft,
      requiredAreaSqm,
      billSavingsPct,
      annualSavings,
      subsidyAmount,
      totalCost,
      netCost,
      paybackYears,
      systemSizeKwp,
      invertorKva,
      invertorVoltage,
      batteryAh,
      powerBackupHours,
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const incrementValue = (field: string, step: number = 1) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, (prev[field as keyof typeof prev] as number) + step)
    }));
  };

  const decrementValue = (field: string, step: number = 1) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, (prev[field as keyof typeof prev] as number) - step)
    }));
  };

  const updateAppliance = (index: number, field: string, value: number) => {
    setAppliances(prev => prev.map((app, i) => 
      i === index ? { ...app, [field]: Math.max(0, value) } : app
    ));
  };

  const addAppliance = () => {
    setAppliances(prev => [...prev, { name: 'New Appliance', quantity: 1, watt: 50, workingHours: 1 }]);
  };

  const getTotalLoad = () => {
    return appliances.reduce((total, app) => total + (app.quantity * app.watt * app.workingHours), 0);
  };

  const generateResults = () => {
    computeResults();
    setShowResultsModal(true);
  };

  return (
    <section className="flex flex-col lg:flex-row min-h-[calc(100vh-200px)]">
      
      {/* LEFT — Solar Benefits with background image */}
      <div className="lg:w-[65%] relative flex items-center justify-center px-6 py-4 lg:px-8 overflow-y-auto">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src="/assets/image/banner/solar-panel-is-set-against-blue-sky-with-sun-shining-through-it.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="relative z-10 text-white w-full max-w-4xl py-4">
          <div className="mb-6">
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-2">Solar Calculator</p>
            <h1 className="text-2xl lg:text-4xl font-bold leading-tight mb-3">
              Calculate Your <span className="text-amber-400">Solar Savings</span>
            </h1>
            <p className="text-white/80 text-base leading-relaxed max-w-2xl">
              Discover how much you can save with solar power and get personalized recommendations for your property with government subsidies.
            </p>
          </div>

          {/* PM Surya Ghar Info Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                <Sun className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">PM Surya Ghar Muft Bijli Yojana</h3>
                <p className="text-white/60 text-sm">Government Flagship Scheme</p>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-3">
              Transform your rooftop into a power source. Eliminate electricity bills and earn from your solar setup with comprehensive government subsidies.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-medium">
                Up to ₹78,000 Subsidy
              </span>
              <span className="px-3 py-1 bg-sky-500/20 border border-sky-500/30 rounded-full text-sky-400 text-xs font-medium">
                6.75% Interest Rate
              </span>
            </div>
          </div>

          {/* Subsidy Structure */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4">
            <h3 className="text-base font-bold text-white flex items-center gap-3 mb-3">
              <Banknote className="h-5 w-5 text-amber-400" />
              Government Subsidy Structure
            </h3>
            <div className="grid gap-2">
              {householdSubsidy.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-black/20 border border-white/10">
                  <span className="text-sm font-medium text-white">{item.range}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-amber-400">{item.amount}</span>
                    <p className="text-xs text-white/50">{item.perKw ? "per kW" : item.suffix}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Pure white calculator form */}
      <div className="lg:w-[35%] bg-white flex items-center justify-center px-4 py-4 lg:px-6 overflow-y-auto">
        <div className="w-full max-w-lg">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="h-6 w-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-gray-900">Solar Calculator</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">Get personalized solar recommendations for your property.</p>

          <div className="space-y-4">
            {/* Pincode */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                <MapPin className="inline h-3 w-3 mr-1" />
                PINCODE *
              </label>
              <Input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                placeholder="Enter Your Pincode"
                className="w-full"
              />
            </div>

            {/* Power Supply Phase */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">POWER SUPPLY PHASE *</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('powerPhase', 'single')}
                  className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                    formData.powerPhase === 'single'
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Single Phase
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('powerPhase', 'three')}
                  className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                    formData.powerPhase === 'three'
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Three Phase
                </button>
              </div>
            </div>

            {/* Tariff Rates */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                TARIFF RATES: {formData.tariffRate} INR
              </label>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm font-medium">4</span>
                <div className="flex-1">
                  <input
                    type="range"
                    min="4"
                    max="30"
                    value={formData.tariffRate}
                    onChange={(e) => handleInputChange('tariffRate', parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer tariff-slider"
                    style={{
                      background: `linear-gradient(to right, #f59e0b ${((formData.tariffRate - 4) / (30 - 4)) * 100}%, #e5e7eb ${((formData.tariffRate - 4) / (30 - 4)) * 100}%)`
                    }}
                  />
                </div>
                <span className="text-gray-500 text-sm font-medium">30</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => decrementValue('tariffRate')}
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-10 text-center text-gray-900 font-bold text-sm">{formData.tariffRate}</span>
                  <button
                    type="button"
                    onClick={() => incrementValue('tariffRate')}
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Monthly Electricity Bill */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">MONTHLY ELECTRICITY BILL *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  type="number"
                  value={formData.monthlyBill}
                  onChange={(e) => handleInputChange('monthlyBill', e.target.value)}
                  className="pl-8 pr-12"
                  placeholder="Enter bill amount"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">INR</span>
              </div>
            </div>

            {/* Available Roof Top Area */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                <Grid3X3 className="inline h-3 w-3 mr-1" />
                AVAILABLE ROOF TOP AREA *
              </label>
              <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="roofUnit"
                    value="sqft"
                    checked={formData.roofUnit === 'sqft'}
                    onChange={() => handleInputChange('roofUnit', 'sqft')}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-sm text-gray-700">Sq.ft</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="roofUnit"
                    value="sqm"
                    checked={formData.roofUnit === 'sqm'}
                    onChange={() => handleInputChange('roofUnit', 'sqm')}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-sm text-gray-700">Sq.m</span>
                </label>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.roofArea}
                  onChange={(e) => handleInputChange('roofArea', e.target.value)}
                  placeholder={formData.roofUnit === 'sqft' ? 'Enter area in Sq.ft' : 'Enter area in Sq.m'}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  {formData.roofUnit === 'sqft' ? 'Sq.ft' : 'Sq.m'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">*Note: 1kW system requires ~120sq ft area</p>
            </div>

            {/* Sanction Load */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                <Bolt className="inline h-3 w-3 mr-1" />
                SANCTION LOAD *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.sanctionLoad}
                  onChange={(e) => handleInputChange('sanctionLoad', e.target.value)}
                  placeholder="Enter sanction load"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">kW</span>
              </div>
            </div>

            {/* Solar Journey Steps */}
            {/* <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200">
              <h4 className="text-sm font-bold text-gray-900 mb-2 text-center">Your Solar Journey</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center mx-auto">
                    <Calculator className="h-3 w-3 text-amber-600" />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">Step 01<br />Run Calculator</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-sky-100 border-2 border-sky-300 flex items-center justify-center mx-auto">
                    <Target className="h-3 w-3 text-sky-600" />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">Step 02<br />Site Survey</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mx-auto">
                    <Sun className="h-3 w-3 text-emerald-600" />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">Step 03<br />Go Solar</p>
                </div>
              </div>
            </div> */}

            {/* Generate Result Button */}
            <Button 
              onClick={generateResults}
              className="w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 text-base transition-all duration-300 hover:shadow-lg"
            >
              <span className="flex items-center justify-center gap-2">
                GENERATE RESULT
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>

            <p className="text-xs text-gray-400 text-center">🔒 Your information is private and will never be shared.</p>

            {/* Results Modal */}
            {showResultsModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Solar Calculator Results</h2>
                    <button 
                      onClick={() => setShowResultsModal(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <span className="text-gray-600 text-xl">×</span>
                    </button>
                  </div>

                  {/* Grid Type Toggle */}
                  <div className="p-6 pb-4">
                    <div className="flex rounded-lg overflow-hidden border border-gray-300 w-fit">
                      <button
                        onClick={() => setGridType('on-grid')}
                        className={`px-6 py-3 font-semibold transition-colors ${
                          gridType === 'on-grid' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        On-Grid ⓘ
                      </button>
                      <button
                        onClick={() => setGridType('off-grid')}
                        className={`px-6 py-3 font-semibold transition-colors ${
                          gridType === 'off-grid' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Off-Grid ⓘ
                      </button>
                    </div>
                  </div>

                  {/* Appliances Section (Off-Grid Only) */}
                  {gridType === 'off-grid' && (
                    <div className="px-6 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Appliances</h3>
                        <button
                          onClick={computeResults}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                          Recalculate
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-600 text-sm">Total Load: <span className="font-bold text-gray-900">{getTotalLoad()} W</span></span>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-gray-500 text-xs border-b border-gray-200">
                                <th className="pb-2 font-semibold">Application Name</th>
                                <th className="pb-2 text-center font-semibold">Quantity</th>
                                <th className="pb-2 text-center font-semibold">Watt (W)</th>
                                <th className="pb-2 text-center font-semibold">Hours/Day</th>
                              </tr>
                            </thead>
                            <tbody>
                              {appliances.map((appliance, index) => (
                                <tr key={index} className="border-t border-gray-200">
                                  <td className="py-2 font-medium text-gray-900">{appliance.name}</td>
                                  <td className="py-2">
                                    <div className="flex items-center justify-center gap-1">
                                      <button
                                        onClick={() => updateAppliance(index, 'quantity', appliance.quantity - 1)}
                                        className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </button>
                                      <span className="w-7 text-center font-semibold">{appliance.quantity}</span>
                                      <button
                                        onClick={() => updateAppliance(index, 'quantity', appliance.quantity + 1)}
                                        className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </td>
                                  <td className="py-2">
                                    <input
                                      type="number"
                                      value={appliance.watt}
                                      onChange={(e) => updateAppliance(index, 'watt', parseInt(e.target.value) || 0)}
                                      className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center text-sm"
                                    />
                                  </td>
                                  <td className="py-2">
                                    <div className="flex items-center justify-center gap-1">
                                      <button
                                        onClick={() => updateAppliance(index, 'workingHours', appliance.workingHours - 1)}
                                        className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </button>
                                      <span className="w-7 text-center font-semibold">{appliance.workingHours}</span>
                                      <button
                                        onClick={() => updateAppliance(index, 'workingHours', appliance.workingHours + 1)}
                                        className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <button
                          onClick={addAppliance}
                          className="mt-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 text-sm"
                        >
                          <Plus className="h-4 w-4" />
                          Add New Appliances
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Our Recommendation Section */}
                  <div className="px-6 pb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Our Recommendation</h3>
                    
                    {!results ? (
                      <p className="text-gray-500 text-center py-8">No results yet. Please fill in the form and click Generate Result.</p>
                    ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column - System Details */}
                      <div className="space-y-4">
                        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                          <div className="flex items-start gap-4">
                            <div className="text-5xl">🌞</div>
                            <div className="flex-1">
                              <h4 className="text-base font-bold text-gray-900 mb-3">Recommended System</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0"></div>
                                  <span className="text-gray-700 text-sm">System Size: <span className="font-bold text-gray-900">
                                    {gridType === 'on-grid' ? results.recommendedCapacityKwp : results.systemSizeKwp} kWp
                                  </span></span>
                                </div>
                                {gridType === 'off-grid' && (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0"></div>
                                      <span className="text-gray-700 text-sm">Invertor Capacity: <span className="font-bold text-gray-900">{results.invertorKva} KVA {results.invertorVoltage} V</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0"></div>
                                      <span className="text-gray-700 text-sm">Battery: <span className="font-bold text-gray-900">{results.batteryAh} AH</span></span>
                                    </div>
                                  </>
                                )}
                                {gridType === 'on-grid' && (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0"></div>
                                      <span className="text-gray-700 text-sm">Annual Savings: <span className="font-bold text-green-600">₹{results.annualSavings.toLocaleString()}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0"></div>
                                      <span className="text-gray-700 text-sm">Subsidy: <span className="font-bold text-green-600">₹{results.subsidyAmount.toLocaleString()}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0"></div>
                                      <span className="text-gray-700 text-sm">Payback Period: <span className="font-bold text-gray-900">{results.paybackYears} years</span></span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-700 text-sm mb-1">Required area for solar installation</h5>
                            <p className="text-2xl font-bold text-gray-900">{results.requiredAreaSqft} sq.ft</p>
                            <p className="text-base text-gray-600">{results.requiredAreaSqm} sq.m</p>
                          </div>
                          <div className="text-4xl">🏠</div>
                        </div>

                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-700 text-sm mb-1">Bill Savings</h5>
                            <p className="text-3xl font-bold text-gray-900">{gridType === 'off-grid' ? 100 : results.billSavingsPct}%</p>
                          </div>
                          <div className="text-4xl">🐷</div>
                        </div>

                        {gridType === 'off-grid' && (
                          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 flex items-center justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-700 text-sm mb-1">Power Back-up Available</h5>
                              <p className="text-2xl font-bold text-gray-900">{results.powerBackupHours} Hours</p>
                            </div>
                            <div className="text-4xl">🔋</div>
                          </div>
                        )}
                      </div>
                    </div>
                    )}

                    <div className="mt-6 text-xs text-gray-400 space-y-0.5">
                      <p>*Above plant size is only indicative and derived based on your inputs.</p>
                      <p>The actual plant size capacity will be based on available rooftop area.</p>
                      <p>If the area available is more than the recommended area required, higher capacities can be installed and vice-versa.</p>
                    </div>

                    <div className="mt-4">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-base">
                        Check your ROI, Savings & EMI
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}