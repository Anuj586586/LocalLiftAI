import Link from 'next/link';
import { User } from 'lucide-react';

export function PublicHeader() {
  return (
    <header className="h-20 border-b border-gray-100 bg-white flex items-center justify-between px-8 lg:px-24">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#3C2EE5] rounded-md grid place-items-center">
          <div className="w-4 h-4 bg-white rounded-sm" />
        </div>
        <span className="font-bold text-xl text-gray-900 tracking-tight">LocalLift<span className="text-[#3C2EE5]">AI</span></span>
      </Link>
      
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-gray-600 font-medium text-sm hover:text-gray-900 transition-colors hidden sm:block">
          Log in
        </Link>
        <Link href="/login" className="px-5 py-2.5 bg-[#3C2EE5] text-white rounded-full font-medium text-sm hover:bg-[#3226c2] transition-colors shadow-sm shadow-indigo-200">
          Start Free
        </Link>
      </div>
    </header>
  );
}
