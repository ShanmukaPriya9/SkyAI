"use client";

import { Settings2, Bell, Palette, Sparkles, Tractor, Plane, Zap, User, Lock } from "lucide-react";
import { useAppContext } from "@/store/AppContext";

export default function SettingsPage() {
  const { aiMode, setAiMode, isLoggedIn, temperatureUnit, setTemperatureUnit, notificationsEnabled, setNotificationsEnabled } = useAppContext();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-1000 slide-in-from-bottom-4 mb-20">
      <header className="glass-panel rounded-3xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        <Settings2 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white tracking-wide">Preferences</h1>
        <p className="text-gray-400 mt-2">Customize your SkyAI experience</p>
      </header>

      <div className="grid gap-8">
        
        {/* SkyAI Operating Modes */}
        <section className="glass-panel rounded-3xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-400" /> SkyAI Operating Mode
          </h2>
          <p className="text-gray-400 text-sm mb-6">Select the primary persona and analytical focus for your AI assistant. This fundamentally changes how it processes weather data.</p>
          
          <div className="relative">
            {!isLoggedIn && (
              <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl border border-white/10">
                 <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Lock className="w-5 h-5 text-gray-400" /> Premium Feature</h3>
                 <p className="text-sm text-gray-300 mb-4 max-w-sm text-center">Sign in to unlock Professional, Agriculture, and Travel AI Modes.</p>
                 <a href="/profile" className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2 rounded-xl transition-all shadow-lg shadow-blue-500/20">Sign In Now</a>
              </div>
            )}
            
            <div className={`grid md:grid-cols-2 gap-4 ${!isLoggedIn ? 'opacity-30 pointer-events-none select-none' : ''}`}>
              <div onClick={() => setAiMode("manual")} className={`cursor-pointer p-6 rounded-2xl border transition-all ${aiMode === "manual" ? "bg-blue-500/20 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]" : "bg-black/20 border-white/5 hover:border-white/20"}`}>
                <div className="flex items-center gap-3 mb-2">
                  <User className={`w-5 h-5 ${aiMode === "manual" ? "text-blue-400" : "text-gray-500"}`} />
                  <h4 className="text-white font-medium">Manual Mode (Default)</h4>
                </div>
                <p className="text-sm text-gray-400">Casual, helpful, and friendly. Perfect for everyday planning and quick forecasts.</p>
              </div>
              
              <div onClick={() => setAiMode("expert")} className={`cursor-pointer p-6 rounded-2xl border transition-all ${aiMode === "expert" ? "bg-red-500/20 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]" : "bg-black/20 border-white/5 hover:border-white/20"}`}>
                <div className="flex items-center gap-3 mb-2">
                  <Zap className={`w-5 h-5 ${aiMode === "expert" ? "text-red-400" : "text-gray-500"}`} />
                  <h4 className="text-white font-medium">Professional Meteorologist</h4>
                </div>
                <p className="text-sm text-gray-400">Strictly data-driven and highly technical. Focuses on barometric pressure and wind vectors.</p>
              </div>
              
              <div onClick={() => setAiMode("agriculture")} className={`cursor-pointer p-6 rounded-2xl border transition-all ${aiMode === "agriculture" ? "bg-green-500/20 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.15)]" : "bg-black/20 border-white/5 hover:border-white/20"}`}>
                <div className="flex items-center gap-3 mb-2">
                  <Tractor className={`w-5 h-5 ${aiMode === "agriculture" ? "text-green-400" : "text-gray-500"}`} />
                  <h4 className="text-white font-medium">Agriculture Mode</h4>
                </div>
                <p className="text-sm text-gray-400">Tailored for farming and crop management. Analyzes soil moisture and frost risks.</p>
              </div>
              
              <div onClick={() => setAiMode("travel")} className={`cursor-pointer p-6 rounded-2xl border transition-all ${aiMode === "travel" ? "bg-purple-500/20 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]" : "bg-black/20 border-white/5 hover:border-white/20"}`}>
                <div className="flex items-center gap-3 mb-2">
                  <Plane className={`w-5 h-5 ${aiMode === "travel" ? "text-purple-400" : "text-gray-500"}`} />
                  <h4 className="text-white font-medium">Travel Mode</h4>
                </div>
                <p className="text-sm text-gray-400">Optimized for journeys. Prioritizes flight delays, road visibility, and turbulence reports.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Appearance & Units */}
          <section className="glass-panel rounded-3xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <Palette className="w-5 h-5 text-blue-400" /> Interface & Units
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Temperature Unit</h4>
                  <p className="text-sm text-gray-400">Choose your preferred scale</p>
                </div>
                <div className="flex bg-black/40 rounded-xl p-1 border border-white/10">
                  <button onClick={() => setTemperatureUnit("celsius")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${temperatureUnit === "celsius" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"}`}>°C Celsius</button>
                  <button onClick={() => setTemperatureUnit("fahrenheit")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${temperatureUnit === "fahrenheit" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"}`}>°F Fahrenheit</button>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="glass-panel rounded-3xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <Bell className="w-5 h-5 text-red-400" /> Alerts & Notifications
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Severe Weather Alerts</h4>
                <p className="text-sm text-gray-400">Get push notifications for dangerous conditions</p>
              </div>
              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)} 
                className={`w-14 h-7 rounded-full transition-colors relative ${notificationsEnabled ? "bg-blue-500" : "bg-gray-700"}`}
              >
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${notificationsEnabled ? "left-8" : "left-1"}`} />
              </button>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
