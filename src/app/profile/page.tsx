"use client";

import { useState, useEffect } from "react";
import { User, MapPin, ShieldCheck, Mail, LogOut, Key } from "lucide-react";
import { useAppContext } from "@/store/AppContext";

export default function ProfilePage() {
  const { isLoggedIn, login, logout, userEmail, userName } = useAppContext();
  const [location, setLocation] = useState("Detecting...");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            if (data && data.address) {
              const city = data.address.city || data.address.town || data.address.village || data.address.county || "";
              const state = data.address.state || data.address.country || "";
              const formattedLocation = `${city}${city && state ? ', ' : ''}${state}`;
              setLocation(formattedLocation || "New York");
            } else {
              setLocation("New York");
            }
          } catch (err) {
            setLocation("New York");
          }
        },
        () => setLocation("New York")
      );
    } else {
      setLocation("New York");
    }
  }, []);

  // Auth Form State
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [error, setError] = useState("");

  // Clear fields when logging out
  useEffect(() => {
    if (!isLoggedIn) {
      setEmail("");
      setPassword("");
      setSignUpName("");
      setError("");
    }
  }, [isLoggedIn]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (authMode === "signup" && !signUpName)) {
      setError("Please fill out all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (authMode === "signup") {
      const existingAccount = localStorage.getItem(`db_${email}`);
      if (existingAccount) {
        setError("An account already exists with this email. Please log in.");
        return;
      }
      localStorage.setItem(`db_${email}`, JSON.stringify({ password, name: signUpName }));
      login(email, signUpName);
    } else {
      const accountData = localStorage.getItem(`db_${email}`);
      if (accountData) {
        try {
          const parsed = JSON.parse(accountData);
          if (parsed.password === password) {
            login(email, parsed.name);
            return;
          }
        } catch(e) {
          // Fallback for old un-stringified passwords
          if (accountData === password) {
            login(email, email.split("@")[0]);
            return;
          }
        }
      }
      setError("Invalid email or password.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-8 px-4 animate-in fade-in zoom-in duration-700">
        <div className="glass-panel p-6 md:p-10 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <Key className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            {authMode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            Sign in to unlock premium SkyAI features.
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            {/* Reserve height so layout doesn't shift drastically */}
            <div className={`transition-all duration-300 overflow-hidden ${error ? 'max-h-20 opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'}`}>
               <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-xs md:text-sm text-center">
                 {error}
               </div>
            </div>

            {authMode === "signup" && (
              <div>
                <label htmlFor="name" className="text-xs text-gray-400 font-medium ml-1">Full Name</label>
                <input 
                  id="name"
                  name="name"
                  type="text" 
                  value={signUpName}
                  autoComplete="name"
                  onChange={(e) => setSignUpName(e.target.value)}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all"
                  placeholder="John Doe"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="text-xs text-gray-400 font-medium ml-1">Email Address</label>
              <input 
                id="email"
                name="email"
                type="email" 
                value={email}
                autoComplete="username"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="text-xs text-gray-400 font-medium ml-1">Password</label>
              <input 
                id="password"
                name="password"
                type="password" 
                value={password}
                autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 mt-4">
              {authMode === "login" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
             <button 
               type="button"
               onClick={() => {
                 setAuthMode(authMode === "login" ? "signup" : "login");
                 setError("");
               }}
               className="text-sm text-gray-400 hover:text-white transition-colors"
             >
               {authMode === "login" ? "Don't have an account? Sign up" : "Already have an account? Log in"}
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-1000 slide-in-from-bottom-4 mb-20">
      <header className="glass-panel rounded-3xl p-8 relative overflow-hidden flex flex-col items-center text-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        <div className="w-32 h-32 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] border-4 border-white/20">
           <User className="w-16 h-16 text-white" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide mb-1">
            <input 
              type="text" 
              value={userName}
              readOnly
              className="bg-transparent border-b border-transparent focus:outline-none text-center transition-colors cursor-default" 
            />
          </h1>
          <p className="text-blue-400 font-medium flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Authenticated Pro Member
          </p>
        </div>
      </header>

      <div className="glass-panel rounded-3xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Account Details</h2>
        
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-400" />
               </div>
               <div>
                 <h4 className="text-white font-medium">Default Home Location</h4>
                 <p className="text-xs text-gray-400">Used for your primary dashboard forecast</p>
               </div>
            </div>
            <input 
              type="text" 
              value={location}
              readOnly
              className="bg-transparent border border-white/5 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none cursor-default" 
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-400" />
               </div>
               <div>
                 <h4 className="text-white font-medium">Email Address</h4>
                 <p className="text-xs text-gray-400">Securely linked to your session</p>
               </div>
            </div>
            <span className="text-sm text-gray-400 px-4">{userEmail}</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex justify-end items-center">
           <button onClick={logout} className="bg-black/20 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 text-sm font-medium flex items-center gap-2 transition-colors px-6 py-2.5 rounded-xl">
             <LogOut className="w-4 h-4" /> Sign Out
           </button>
        </div>
      </div>
    </div>
  );
}
