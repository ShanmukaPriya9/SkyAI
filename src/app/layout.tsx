import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import WeatherVideoBackground from "@/components/WeatherVideoBackground";
import { AppProvider } from "@/store/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkyAI | Premium Weather & Climate Assistant",
  description: "Conversational AI for Weather Forecasting, Alerts & Climate Information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex overflow-x-hidden antialiased selection:bg-blue-500/30`}>
        <AppProvider>
          <WeatherVideoBackground />
          <div className="relative z-10 flex w-full min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
              {children}
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
