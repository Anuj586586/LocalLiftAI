'use client';

import Link from 'next/link';
import { Mail, KeyRound, ArrowRight, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      // If user doesn't exist, try creating one for demo purposes, 
      // or just show error. Let's just create one if not found.
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
         try {
           await createUserWithEmailAndPassword(auth, email, password);
           router.push('/onboarding');
         } catch (createErr: any) {
           setError('Invalid credentials');
         }
      } else {
        setError(err.message || 'Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-[#3C2EE5] rounded-xl flex items-center justify-center shadow-sm">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2 tracking-tight">Welcome back</h1>
        <p className="text-gray-500 text-center mb-8">Log in to your account to continue</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors mb-6 font-medium text-gray-700 shadow-sm disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Continue with Google
        </button>

        <div className="relative py-4 mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs font-bold text-gray-400 tracking-widest uppercase">
            <span className="bg-white px-4">Or Email</span>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleEmailSignIn}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3C2EE5]/20 focus:border-[#3C2EE5] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <Link href="#" className="text-sm font-semibold text-[#3C2EE5] hover:text-[#3226c2] transition-colors">Forgot?</Link>
            </div>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#3C2EE5]/20 focus:border-[#3C2EE5] outline-none transition-all font-mono"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#3C2EE5] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#3226c2] shadow-md shadow-indigo-100 transition-all mt-6 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log in securely'} 
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8 font-medium">
          Don&apos;t have an account? <span onClick={handleGoogleSignIn} className="text-[#3C2EE5] hover:text-[#3226c2] font-semibold transition-colors cursor-pointer">Create an account</span>
        </p>
      </div>

      <div className="fixed bottom-6 right-6 px-4 py-2 bg-white rounded-full border shadow-sm flex items-center gap-2 text-sm font-medium text-gray-600">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        System Status: All Operational
      </div>
    </div>
  );
}
