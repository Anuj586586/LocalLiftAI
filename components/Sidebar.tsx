'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  PenTool, 
  Paintbrush, 
  Calendar, 
  Megaphone, 
  Mic2, 
  LayoutTemplate, 
  BarChart3, 
  Settings,
  Search,
  Share2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Content Studio', href: '/dashboard/content', icon: PenTool },
  { name: 'SEO Maker', href: '/dashboard/seo', icon: Search },
  { name: 'Review Responder', href: '/dashboard/reviews', icon: Mic2 },
  { name: 'Ad Copywriter', href: '/dashboard/ads', icon: Megaphone },
  { name: 'Billing', href: '/dashboard/billing', icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { stats } = useAuth();

  const totalCredits = 20;
  const creditsRemaining = Math.max(0, totalCredits - (stats?.creditsUsed || 0));
  const creditsPercent = Math.min(100, Math.round((creditsRemaining / totalCredits) * 100));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <div className={cn(
        "w-64 border-r bg-white h-screen flex flex-col fixed left-0 top-0 z-50 transform transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b md:border-none">
          <Link href="/" className="flex items-center gap-2" onClick={() => onClose && onClose()}>
            <div className="w-8 h-8 bg-[#3C2EE5] rounded-md grid place-items-center">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">LocalLift<span className="text-[#3C2EE5]">AI</span></span>
          </Link>
          <button 
            className="md:hidden p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onClose && onClose()}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[#3C2EE5] text-white" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t mt-auto">
          <div className="flex justify-between text-xs font-medium text-gray-600 mb-2">
            <span>{creditsRemaining} / {totalCredits} credits</span>
            <span>{creditsPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full">
            <div className="h-full bg-[#3C2EE5] rounded-full transition-all duration-500" style={{ width: `${creditsPercent}%` }} />
          </div>
        </div>
      </div>
    </>
  );
}
