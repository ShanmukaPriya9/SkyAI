"use client";

import { useState, useEffect } from "react";
import { Layers, Wind, CloudRain, ThermometerSun, AlertCircle, X, Lock } from "lucide-react";
import { useAppContext } from "@/store/AppContext";

export default function MapPage() {
  const { isLoggedIn } = useAppContext();
  const [layer, setLayer] = useState("wind"); // Options: wind, rain, temp, clouds
  
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20">
          <Lock className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Premium Map Locked</h2>
        <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
          The Interactive Global WebGL Radar and live atmospheric tracking systems require an active SkyAI account. Sign in to unlock this feature.
        </p>
        <a href="/profile" className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20">
          Sign In Now
        </a>
      </div>
    );
  }

  // Coordinates for the map center (Defaults to India)
  const [lat, setLat] = useState("20.5937");
  const [lon, setLon] = useState("78.9629");

  // Autocomplete state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounced search autocomplete
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const timeoutId = setTimeout(() => {
      fetch(`/api/search?q=${searchQuery}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data);
          setShowDropdown(true);
        });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-1000 slide-in-from-bottom-4 mb-10 h-[85vh] flex flex-col gap-6">
      <header className="relative z-50 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center glass-panel rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Global Radar</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80 z-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location to recenter map..." 
            className="w-full bg-black/20 border border-white/10 rounded-full py-2.5 pl-12 pr-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-black/40 transition-all backdrop-blur-md"
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(""); setShowDropdown(false); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-50 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
              {searchResults.map((loc: any) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setLat(loc.lat);
                    setLon(loc.lon);
                    setSearchQuery("");
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-colors flex flex-col"
                >
                  <span className="font-medium text-white">{loc.name}</span>
                  <span className="text-xs text-gray-400">{loc.region}, {loc.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Layers */}
        <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 overflow-x-auto w-full md:w-auto">
          <LayerButton active={layer === "wind"} onClick={() => setLayer("wind")} icon={<Wind className="w-4 h-4" />} label="Wind" />
          <LayerButton active={layer === "rain"} onClick={() => setLayer("rain")} icon={<CloudRain className="w-4 h-4" />} label="Rain" />
          <LayerButton active={layer === "temp"} onClick={() => setLayer("temp")} icon={<ThermometerSun className="w-4 h-4" />} label="Temp" />
          <LayerButton active={layer === "clouds"} onClick={() => setLayer("clouds")} icon={<Layers className="w-4 h-4" />} label="Clouds" />
        </div>
      </header>

      <div className="flex-1 glass-panel rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl group">
        <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 bg-[#0f172a]">
           <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
           <p className="text-gray-400 font-medium">Loading high-resolution radar...</p>
        </div>

        <iframe 
          key={`${layer}-${lat}-${lon}`}
          width="100%" 
          height="100%" 
          src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=km/h&zoom=7&overlay=${layer}&product=ecmwf&level=surface&lat=${lat}&lon=${lon}`}
          style={{ border: "none" }}
          title="Interactive Weather Map"
          className="relative z-10 w-full h-full bg-transparent"
        />

        {/* Floating Legend / Info */}
        <div className="absolute bottom-6 left-6 z-20 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-start gap-3 max-w-sm pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 hidden md:flex">
          <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">Live WebGL Rendering</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              This map uses the ECMWF global forecasting model. You can click and drag to pan, use scroll to zoom, and click anywhere to inspect precise coordinate data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayerButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0 ${
        active 
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30" 
          : "text-gray-400 hover:text-white hover:bg-white/10 border border-transparent"
      }`}
    >
      {icon} {label}
    </button>
  );
}
