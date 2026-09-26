"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Wind, Droplets, Sun, AlertTriangle, Cloud, Navigation2, Loader2, Send, X, Lock } from "lucide-react";
import { useAppContext } from "@/store/AppContext";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  
  // Use global chat state
  const { messages, chatHistory, isTyping, addMessage, setChatHistory, setIsTyping, aiMode, isLoggedIn, temperatureUnit, setWeatherCode, setIsDay } = useAppContext();
  
  // Real weather state
  const [weatherData, setWeatherData] = useState<any>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [displayLocationName, setDisplayLocationName] = useState("");
  
  // Autocomplete state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Auto-detect user location on load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setSearchLocation(`${latitude},${longitude}`);

          // Reverse geocode with OpenStreetMap for hyper-local naming
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            if (data && data.address) {
              const localName = data.address.suburb || data.address.neighbourhood || data.address.city_district || data.address.city || data.address.town || data.name;
              setDisplayLocationName(`${localName}, ${data.address.state || data.address.country}`);
            }
          } catch (e) {
            console.error("Reverse geocoding failed", e);
          }
        },
        (error) => {
          console.warn("Geolocation blocked or failed. Using fallback.", error);
          setSearchLocation("New York"); // Fallback
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setSearchLocation("New York");
    }
  }, []);

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

  useEffect(() => {
    if (!searchLocation) return;
    
    fetch(`/api/weather?location=${searchLocation}`)
      .then(res => res.json())
      .then(data => {
        setWeatherData(data);
        
        // Update global background video
        if (data && data.current && data.current.condition) {
          setWeatherCode(data.current.condition.code);
          setIsDay(data.current.is_day);
        }

        // Only override the display name if we are not doing a coordinate search 
        // (because coordinate searches have their display name set by the precise OSM reverse-geocoder above)
        if (!searchLocation.includes(",")) {
          setDisplayLocationName(`${data.location.name}, ${data.location.region}`);
        }
      })
      .catch(err => console.error("Error fetching weather:", err));
  }, [searchLocation]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || isTyping) return;

    const userMessage = prompt;
    setPrompt("");
    addMessage({ role: "user", text: userMessage });
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: chatHistory, aiMode })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Unknown server error");
      }
      
      if (data.text) {
        addMessage({ role: "assistant", text: data.text });
        if (data.history) setChatHistory(data.history);
      } else {
        throw new Error("No response text");
      }
    } catch (error: any) {
      addMessage({ role: "assistant", text: `Error: ${error.message}` });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-1000 slide-in-from-bottom-4 mb-20">
      <header className="relative z-50 flex justify-between items-center glass-panel rounded-3xl p-4 px-6 md:px-8">
        <div className="flex items-center gap-3 text-gray-200">
          <MapPin className="w-5 h-5 text-blue-400 animate-pulse" />
          <span className="font-medium text-lg tracking-wide">{weatherData ? displayLocationName : 'Loading...'}</span>
        </div>
        <div className="relative w-72 hidden md:block z-50">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location..." 
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                setSearchLocation(searchQuery);
                setDisplayLocationName(searchQuery);
                setShowDropdown(false);
              }
            }}
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
                    setSearchLocation(loc.query);
                    setDisplayLocationName(`${loc.name}, ${loc.region}`);
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
      </header>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-8 lg:p-10 flex flex-col justify-between min-h-[450px] relative overflow-hidden group">
          <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute -bottom-32 -left-32 w-[20rem] h-[20rem] bg-indigo-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-gray-300 text-lg font-medium mb-2 uppercase tracking-widest text-xs">Current Weather</h2>
            {weatherData && weatherData.current ? (
              <div className="flex items-end gap-6">
                <h1 className="text-8xl lg:text-9xl font-bold tracking-tighter text-white drop-shadow-xl">{temperatureUnit === 'fahrenheit' ? Math.round(weatherData.current.temp_f) : Math.round(weatherData.current.temp_c)}°</h1>
                <div className="flex flex-col mb-3">
                  <span className="text-2xl lg:text-3xl font-light text-gray-200">{weatherData.current.condition.text}</span>
                  <span className="text-sm text-gray-400">Feels like {temperatureUnit === 'fahrenheit' ? Math.round(weatherData.current.feelslike_f) : Math.round(weatherData.current.feelslike_c)}°</span>
                </div>
              </div>
            ) : (
              <div className="h-32 flex items-center"><Loader2 className="w-8 h-8 animate-spin text-white/50" /></div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 relative z-10">
            <WeatherMetric icon={<Wind />} label="Wind" value={weatherData?.current ? `${weatherData.current.wind_kph} km/h` : '-'} />
            <WeatherMetric icon={<Droplets />} label="Humidity" value={weatherData?.current ? `${weatherData.current.humidity}%` : '-'} />
            <WeatherMetric icon={<Sun />} label="UV Index" value={weatherData?.current ? weatherData.current.uv : '-'} />
            <WeatherMetric icon={<Navigation2 />} label="Pressure" value={weatherData?.current ? `${weatherData.current.pressure_mb} hPa` : '-'} />
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 lg:p-8 flex flex-col h-full max-h-[600px] relative overflow-hidden">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10 shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Ask SkyAI</h3>
              <p className="text-xs text-gray-400 font-medium">Conversational Assistant</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 pb-2 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg, idx) => {
              const formatText = (text: string) => {
                const html = text
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/\n/g, '<br/>');
                return { __html: html };
              };

              return (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'user' ? (
                    <div className="p-3.5 rounded-2xl max-w-[85%] text-sm leading-relaxed border bg-blue-600/50 text-white rounded-br-sm border-blue-500/30">
                      {msg.text}
                    </div>
                  ) : (
                    <div 
                      className="p-4 rounded-2xl max-w-[90%] text-sm leading-relaxed border bg-white/10 backdrop-blur-md text-gray-200 rounded-tl-sm border-white/5 space-y-2 shadow-lg"
                      dangerouslySetInnerHTML={formatText(msg.text)}
                    />
                  )}
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl rounded-tl-sm border border-white/5 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
          </div>

          {isLoggedIn ? (
            <form onSubmit={handleSendMessage} className="relative mt-auto shrink-0">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything..." 
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all shadow-inner"
              />
              <button 
                type="submit"
                disabled={isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                {isTyping ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
              </button>
            </form>
          ) : (
            <div className="mt-auto shrink-0 relative bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
               <Lock className="w-5 h-5 text-gray-400 mb-2" />
               <p className="text-sm text-gray-300 font-medium mb-3">Sign in to unlock SkyAI Chat</p>
               <a href="/profile" className="text-xs bg-blue-500 hover:bg-blue-600 transition-colors text-white px-4 py-2 rounded-lg font-medium">Sign In / Create Account</a>
            </div>
          )}
        </div>
      </div>

      {/* Forecast Section */}
      {weatherData && weatherData.forecast && (
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mt-6">
          
          {/* Hourly Forecast */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 md:p-8 overflow-hidden">
            <h3 className="text-lg font-semibold mb-6 text-white tracking-wide">Today's Forecast</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {weatherData.forecast.forecastday[0].hour.filter((_: any, i: number) => i % 2 === 0).map((hour: any, i: number) => (
                <div key={i} className="flex flex-col items-center min-w-[90px] p-4 rounded-2xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <img src={"https:" + hour.condition.icon} alt="icon" className="w-12 h-12 my-3 drop-shadow-md" />
                  <span className="text-white font-bold text-lg">{temperatureUnit === 'fahrenheit' ? Math.round(hour.temp_f) : Math.round(hour.temp_c)}°</span>
                  <span className="text-xs text-blue-300 mt-1 flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> {hour.chance_of_rain}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Forecast */}
          <div className="glass-panel rounded-3xl p-6 md:p-8">
            <h3 className="text-lg font-semibold mb-6 text-white tracking-wide">{weatherData.forecast.forecastday.length}-Day Forecast</h3>
            <div className="space-y-5">
              {weatherData.forecast.forecastday.map((day: any, i: number) => {
                const dateObj = new Date(day.date + "T12:00:00");
                const formattedDate = i === 0 
                  ? "Today" 
                  : dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                
                return (
                  <div key={i} className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <span className="text-gray-300 font-medium w-32">
                      {formattedDate}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-300 text-xs font-medium w-8 text-right">{day.day.daily_chance_of_rain}%</span>
                      <img src={"https:" + day.day.condition.icon} alt="icon" className="w-10 h-10 drop-shadow-sm" />
                    </div>
                    <div className="text-sm font-bold w-20 text-right flex flex-col gap-1">
                      <span className="text-white">H: {temperatureUnit === 'fahrenheit' ? Math.round(day.day.maxtemp_f) : Math.round(day.day.maxtemp_c)}°</span>
                      <span className="text-gray-500">L: {temperatureUnit === 'fahrenheit' ? Math.round(day.day.mintemp_f) : Math.round(day.day.mintemp_c)}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Environment & Details Row */}
      {weatherData && (
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mt-6">
          
          {/* Air Quality Card */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
            <h3 className="text-lg font-semibold mb-2 text-white tracking-wide">Air Quality</h3>
            {weatherData.current.air_quality ? (
              <>
                <div className="flex-1 flex flex-col justify-center my-4">
                  <div className="text-6xl font-black tracking-tighter text-white mb-2">
                    {weatherData.current.air_quality["us-epa-index"]}
                  </div>
                  <span className="text-xl font-medium text-green-400">
                    {["", "Good", "Moderate", "Unhealthy for Sensitive Groups", "Unhealthy", "Very Unhealthy", "Hazardous"][weatherData.current.air_quality["us-epa-index"]] || "Unknown"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 mt-auto">
                   <div className="flex flex-col"><span className="text-xs text-gray-500">PM2.5</span><span className="text-sm text-gray-200 font-medium">{Math.round(weatherData.current.air_quality.pm2_5)}</span></div>
                   <div className="flex flex-col"><span className="text-xs text-gray-500">PM10</span><span className="text-sm text-gray-200 font-medium">{Math.round(weatherData.current.air_quality.pm10)}</span></div>
                   <div className="flex flex-col"><span className="text-xs text-gray-500">O3</span><span className="text-sm text-gray-200 font-medium">{Math.round(weatherData.current.air_quality.o3)}</span></div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400 mt-4">Air quality data unavailable for this region.</p>
            )}
          </div>

          {/* Sunrise & Sunset */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
            <h3 className="text-lg font-semibold mb-6 text-white tracking-wide">Sun & Moon</h3>
            {weatherData.forecast?.forecastday[0]?.astro && (
              <div className="flex-1 flex flex-col justify-center space-y-6">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <Sun className="w-8 h-8 text-yellow-400" />
                  <div>
                    <div className="text-sm text-gray-400">Sunrise</div>
                    <div className="text-lg text-white font-semibold">{weatherData.forecast.forecastday[0].astro.sunrise}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                  <div>
                    <div className="text-sm text-gray-400">Sunset</div>
                    <div className="text-lg text-white font-semibold">{weatherData.forecast.forecastday[0].astro.sunset}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Severe Weather Alerts */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
            <h3 className="text-lg font-semibold mb-4 text-white tracking-wide flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" /> Alerts
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 space-y-3">
              {weatherData.alerts?.alert?.length > 0 ? (
                weatherData.alerts.alert.map((alert: any, idx: number) => (
                  <div key={idx} className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                    <h4 className="text-red-300 font-semibold text-sm mb-1">{alert.headline || alert.event}</h4>
                    <p className="text-xs text-red-200/70 line-clamp-3">{alert.desc}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-70 mt-8">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <span className="text-sm text-gray-300 font-medium">No severe weather alerts</span>
                  <span className="text-xs text-gray-500">Conditions are currently safe</span>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

function WeatherMetric({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-white/5 hover:bg-white/5 transition-colors">
      <div className="text-blue-300">{icon}</div>
      <div className="text-center">
        <div className="text-xs text-gray-400 font-medium mb-0.5">{label}</div>
        <div className="text-white font-semibold">{value}</div>
      </div>
    </div>
  );
}
