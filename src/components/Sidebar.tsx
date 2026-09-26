"use client";

import { Cloud, Home, MessageSquare, Map as MapIcon, BarChart2, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
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
        <NavItem href="/profile" icon={<User className="w-5 h-5" />} label="Guest Profile" active={pathname === "/profile"} />
      </div>
    </div>
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
