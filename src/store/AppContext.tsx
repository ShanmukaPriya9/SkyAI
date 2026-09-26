"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AppContextType {
  messages: { role: string; text: string }[];
  chatHistory: any[];
  isTyping: boolean;
  addMessage: (msg: { role: string; text: string }) => void;
  setChatHistory: (history: any[]) => void;
  setIsTyping: (typing: boolean) => void;
  aiMode: string;
  setAiMode: (val: string) => void;
  isLoggedIn: boolean;
  userEmail: string;
  userName: string;
  login: (email: string, name?: string) => void;
  logout: () => void;
  temperatureUnit: string;
  setTemperatureUnit: (val: string) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (val: boolean) => void;
  weatherCode: number;
  setWeatherCode: (val: number) => void;
  isDay: number;
  setIsDay: (val: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I'm your climate assistant. How can I help you plan your day around the weather?" }
  ]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [aiMode, setAiMode] = useState("manual");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("Guest User");
  const [temperatureUnit, setTemperatureUnit] = useState("celsius");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [weatherCode, setWeatherCode] = useState(1000); // Default to clear
  const [isDay, setIsDay] = useState(1); // Default to day

  useEffect(() => {
    const token = localStorage.getItem("skyai_auth");
    const storedName = localStorage.getItem("skyai_username");
    if (token) {
      setIsLoggedIn(true);
      setUserEmail(token);
      if (storedName) setUserName(storedName);
    }
  }, []);

  const login = (email: string, name?: string) => {
    localStorage.setItem("skyai_auth", email);
    if (name) {
      localStorage.setItem("skyai_username", name);
      setUserName(name);
    }
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("skyai_auth");
    localStorage.removeItem("skyai_username");
    setIsLoggedIn(false);
    setUserEmail("");
    setUserName("Guest User");
  };

  const addMessage = (msg: { role: string; text: string }) => setMessages(prev => [...prev, msg]);

  return (
    <AppContext.Provider value={{ messages, chatHistory, isTyping, addMessage, setChatHistory, setIsTyping, aiMode, setAiMode, isLoggedIn, userEmail, userName, login, logout, temperatureUnit, setTemperatureUnit, notificationsEnabled, setNotificationsEnabled, weatherCode, setWeatherCode, isDay, setIsDay }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}
