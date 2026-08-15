'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Store, Globe, Instagram, MapPin, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleFinishOnboarding = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        businessName,
        businessType,
        businessLocation: location,
        website,
        createdAt: serverTimestamp(),
      });
      router.push('/dashboard');
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#3C2EE5]" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="h-16 bg-white border-b flex items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#3C2EE5] rounded-md grid place-items-center">
            <div className="w-4 h-4 bg-white rounded-sm" />
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">LocalLift<span className="text-[#3C2EE5]">AI</span></span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
          Step {step} of 3
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border overflow-hidden">
          {/* Progress bar */}
          <div className="flex h-2 bg-gray-100">
            <div className={`h-full bg-[#3C2EE5] transition-all duration-500 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
          </div>

          <div className="p-10">
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-50 text-[#3C2EE5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Store className="w-8 h-8" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell us about your business</h1>
                  <p className="text-gray-500">This helps our AI understand your brand and target audience.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Name</label>
                    <input 
                      type="text" 
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Pink Bean Café" 
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#3C2EE5]/20 focus:border-[#3C2EE5] outline-none transition-all" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Type</label>
                    <select 
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#3C2EE5]/20 focus:border-[#3C2EE5] outline-none transition-all appearance-none bg-white"
                    >
                      <option value="">Select industry...</option>
                      <option value="cafe">Café & Bakery</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="salon">Salon & Spa</option>
                      <option value="retail">Local Retail</option>
                      <option value="fitness">Gym & Fitness</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                    <div className="relative">
                      <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Bandra West, Mumbai" 
                        className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-[#3C2EE5]/20 focus:border-[#3C2EE5] outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)} 
                  disabled={!businessName || !businessType || !location}
                  className="w-full py-4 bg-[#3C2EE5] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#3226c2] shadow-md shadow-indigo-100 mt-8 transition-all disabled:opacity-50"
                >
                  Next Step <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect Your Presence</h1>
                  <p className="text-gray-500">We&apos;ll use your existing content to match your brand voice perfectly.</p>
                </div>

                <div className="space-y-4">
                  <button className="w-full p-4 border rounded-xl flex items-center justify-between hover:border-gray-300 bg-gray-50 hover:bg-gray-100 transition-all text-left">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                        <Instagram className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Connect Instagram</div>
                        <div className="text-sm text-gray-500">Auto-import aesthetics & past posts</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <div className="relative py-4 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
                    <span className="relative bg-white px-4 text-xs font-semibold text-gray-400 tracking-widest uppercase">OR MANUAL ENTRY</span>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Website URL</label>
                    <input 
                      type="url" 
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://..." 
                      className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#3C2EE5]/20 focus:border-[#3C2EE5] outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep(1)} className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                    Back
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 py-4 bg-[#3C2EE5] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#3226c2] shadow-md shadow-indigo-100 transition-all">
                    Continue <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">You&apos;re all set!</h1>
                  <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                    Our AI has analyzed your inputs and created a custom marketing profile for your business. We&apos;re ready to start generating campaigns.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 border space-y-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> Brand Identity Configured
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> Local Audience Targeted
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> Initial Templates Loaded
                  </div>
                </div>

                <button 
                  onClick={handleFinishOnboarding}
                  disabled={isSaving}
                  className="w-full py-4 bg-[#3C2EE5] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#3226c2] shadow-lg shadow-indigo-200 transition-all mt-8 disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Go to Dashboard'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
