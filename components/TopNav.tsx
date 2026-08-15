'use client';

import { Search, Bell, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

interface TopNavProps {
  onOpenMenu?: () => void;
}

export function TopNav({ onOpenMenu }: TopNavProps) {
  const { user } = useAuth();
  
  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenMenu}
          className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
          <Search className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#3C2EE5] text-white flex items-center justify-center font-medium ml-1 md:ml-2 uppercase text-sm">
          {user?.email?.charAt(0) || 'U'}
        </div>
        <button onClick={handleSignOut} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ml-1 md:ml-2" title="Sign out">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
