"use client";

import { useState } from "react";
import { Leaf, Droplets, Thermometer, TrendingUp, AlertOctagon, Activity, Lock } from "lucide-react";
import { useAppContext } from "@/store/AppContext";

export default function ClimatePage() {
  const { isLoggedIn } = useAppContext();
  const [selectedYear, setSelectedYear] = useState("2025");
  
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20">
          <Lock className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Premium Analysis Locked</h2>
        <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
          The Historical Climate Analysis and CO₂ tracking engines require an active SkyAI account. Sign in to unlock these advanced data visualizers.
        </p>
        <a href="/profile" className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20">
          Sign In Now
        </a>
      </div>
    );
  }

  // Generate deterministic mock data based on the selected year
  const generateRainfallForYear = (yearStr: string) => {
    const year = parseInt(yearStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = currentDate.getMonth(); // 0-based index
    
    return months.map((month, i) => {
      // Future months in the current year have no data yet
      if (year === currentYear && i > currentMonthIndex) {
        return { month, value: 0 };
      }
      
      // Create a bell curve peaking in summer (index 6 = July)
      const baseValue = Math.max(30, 250 - Math.pow(i - 6, 2) * 15);
      // Add pseudo-random variance based on the year and month
      const variance = Math.sin(year * (i + 1)) * 40;
      
      return {
        month,
        value: Math.max(10, Math.round(baseValue + variance))
      };
    });
  };

  const yearsList = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];
  const monthlyRainfall = generateRainfallForYear(selectedYear);
  const maxRain = Math.max(300, ...monthlyRainfall.map((m: any) => m.value));

  // Generate historical CO2 data from 1980 to currentYear
  const co2Data = [];
  for (let y = 1980; y <= new Date().getFullYear(); y++) {
    // Basic curve to simulate exponential CO2 growth
    const value = 338 + Math.pow(y - 1980, 1.3);
    co2Data.push({ year: y.toString(), value: Math.round(value) });
  }
  const minCo2 = 330;
  const maxCo2 = 440;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-1000 slide-in-from-bottom-4 mb-20">
      <header className="glass-panel rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -z-10" />
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <Leaf className="w-8 h-8 text-green-400" /> Climate Intelligence
          </h1>
          <p className="text-gray-400 mt-2 max-w-lg leading-relaxed">
            Long-term meteorological trends, historical planetary data, and climate shift analysis.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/5 text-center">
             <div className="text-2xl font-black text-red-400">+1.2°C</div>
             <div className="text-xs text-gray-500 font-medium">Global Anomaly</div>
          </div>
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/5 text-center">
             <div className="text-2xl font-black text-orange-400">426 ppm</div>
             <div className="text-xs text-gray-500 font-medium">Global CO₂</div>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        
        {/* Rainfall Chart */}
        <section className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-2">
             <h2 className="text-xl font-semibold text-white flex items-center gap-3">
               <Droplets className="w-5 h-5 text-blue-400" /> Annual Precipitation Cycle
             </h2>
             <select 
               value={selectedYear} 
               onChange={(e) => setSelectedYear(e.target.value)}
               className="bg-black/30 border border-white/10 rounded-lg text-sm text-gray-300 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
             >
               {yearsList.map(y => (
                 <option key={y} value={y}>{y}</option>
               ))}
             </select>
          </div>
          
          <div className="w-full h-64 flex items-end justify-between gap-1 md:gap-2 mt-8 pb-8 border-b border-white/10 relative">
            {monthlyRainfall.map((data, i) => (
              <div key={i} className="relative flex flex-col justify-end w-full h-full group">
                 {/* Tooltip */}
                 {data.value > 0 && (
                   <div className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 bg-black text-white text-xs py-1 px-2 rounded z-20 transition-opacity pointer-events-none whitespace-nowrap">
                     {data.value} mm
                   </div>
                 )}
                 {/* Bar */}
                 <div 
                   className={`w-full transition-all duration-500 rounded-t-md ${data.value > 0 ? 'bg-blue-500/40 group-hover:bg-blue-400/60 border-t border-blue-400/50' : 'bg-transparent'}`}
                   style={{ height: `${(data.value / maxRain) * 100}%` }}
                 />
                 {/* Label */}
                 <div className="absolute -bottom-6 left-0 right-0 text-center text-[10px] md:text-xs text-gray-400">
                   {data.month}
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* CO2 Trend Chart */}
        <section className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -z-10" />
          <div className="flex items-center justify-between mb-2">
             <h2 className="text-xl font-semibold text-white flex items-center gap-3">
               <TrendingUp className="w-5 h-5 text-orange-400" /> Atmospheric CO₂ Trend
             </h2>
          </div>
          
          <div className="w-full h-64 mt-8 relative">
            {/* Absolute Grid Lines (Non-scrolling) */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none -z-10 opacity-20 pb-8">
               <div className="border-b border-dashed border-white/30 w-full" />
               <div className="border-b border-dashed border-white/30 w-full" />
               <div className="border-b border-dashed border-white/30 w-full" />
            </div>

            {/* Scrollable Chart Area */}
            <div className="w-full h-full overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 pb-8 border-b border-white/10 pt-8">
              <div className="h-full flex items-end justify-between md:justify-start gap-4 min-w-max px-2 relative">
                {co2Data.map((data, i) => {
                  const heightPercent = ((data.value - minCo2) / (maxCo2 - minCo2)) * 100;
                  return (
                    <div key={i} className="relative flex flex-col justify-end items-center h-full group flex-shrink-0 w-6">
                       <div 
                         className="w-2 md:w-4 bg-gradient-to-t from-orange-500/30 to-orange-400 rounded-full shadow-[0_0_10px_rgba(251,146,60,0.5)] transition-all hover:brightness-125 cursor-pointer relative"
                         style={{ height: `${Math.max(5, heightPercent)}%` }}
                       >
                         {/* Tooltip relative to the top of the bar */}
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black/90 text-white text-[10px] md:text-xs py-1 px-2 rounded z-30 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
                           {data.value} ppm
                         </div>
                       </div>
                       <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-center text-[10px] md:text-xs text-gray-400 ${i % 5 === 0 ? 'block' : 'hidden group-hover:block text-orange-300'}`}>
                         {data.year}
                       </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        
        {/* Climate AI Insights */}
        <section className="glass-panel rounded-3xl p-6 md:p-8 lg:col-span-2">
           <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
             <Activity className="w-5 h-5 text-purple-400" /> SkyAI Automated Climate Report
           </h2>
           <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-colors">
                 <AlertOctagon className="w-8 h-8 text-red-400 mb-4" />
                 <h4 className="text-white font-medium mb-2">Temperature Shift</h4>
                 <p className="text-sm text-gray-400 leading-relaxed">
                   Global median temperatures remain 1.2°C above pre-industrial baselines. Regional heat domes are becoming 15% more frequent.
                 </p>
              </div>
              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-colors">
                 <Thermometer className="w-8 h-8 text-blue-400 mb-4" />
                 <h4 className="text-white font-medium mb-2">Ocean Heat Content</h4>
                 <p className="text-sm text-gray-400 leading-relaxed">
                   Marine heatwaves continue across the equatorial Pacific, accelerating evaporation rates and fueling heavier coastal precipitation.
                 </p>
              </div>
              <div className="bg-black/20 border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-colors">
                 <Leaf className="w-8 h-8 text-green-400 mb-4" />
                 <h4 className="text-white font-medium mb-2">Biosphere Health</h4>
                 <p className="text-sm text-gray-400 leading-relaxed">
                   Earlier spring blooming patterns detected. Agricultural zones are shifting 10-15 miles poleward annually due to warming winters.
                 </p>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
}
