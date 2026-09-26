"use client";

import { Cloud, Home, Map as MapIcon, BarChart2, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAppContext } from "@/store/AppContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { userName } = useAppContext();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 h-screen p-6 glass-panel border-r-white/10 z-10 sticky top-0 shrink-0">
        <div className="flex items-center gap-3 mb-12 px-2">
          <Cloud className="w-8 h-8 text-blue-400 drop-shadow-md" />
          <span className="text-2xl font-bold tracking-tight text-white">SkyAI</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem href="/" icon={<Home className="w-5 h-5" />} label="Dashboard" active={pathname === "/"} />
          <NavItem href="/map" icon={<MapIcon className="w-5 h-5" />} label="Weather Map" active={pathname === "/map"} />
          <NavItem href="/climate" icon={<BarChart2 className="w-5 h-5" />} label="Climate Data" active={pathname === "/climate"} />
        </nav>

        <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
          <NavItem href="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" active={pathname === "/settings"} />
          <NavItem href="/profile" icon={<User className="w-5 h-5" />} label={userName === "Guest User" ? "Guest Profile" : userName} active={pathname === "/profile"} />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 flex justify-around items-center p-3 pb-safe">
        <MobileNavItem href="/" icon={<Home className="w-6 h-6" />} active={pathname === "/"} />
        <MobileNavItem href="/map" icon={<MapIcon className="w-6 h-6" />} active={pathname === "/map"} />
        <MobileNavItem href="/climate" icon={<BarChart2 className="w-6 h-6" />} active={pathname === "/climate"} />
        <MobileNavItem href="/settings" icon={<Settings className="w-6 h-6" />} active={pathname === "/settings"} />
        <MobileNavItem href="/profile" icon={<User className="w-6 h-6" />} active={pathname === "/profile"} />
      </div>
    </>
  );
}

function MobileNavItem({ href, icon, active = false }: { href: string, icon: React.ReactNode, active?: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${active ? 'text-blue-400 bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      {icon}
    </Link>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${active ? 'bg-white/20 text-white shadow-lg border border-white/10' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}>
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}
