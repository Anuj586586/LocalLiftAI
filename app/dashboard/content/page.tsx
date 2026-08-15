'use client';

import { Settings2, ThumbsUp, ThumbsDown, ChevronDown, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PricingModal } from '@/components/PricingModal';

type ContentOutput = {
  platform: string;
  content: string;
};

import { Suspense } from 'react';

function ContentStudioForm() {
  const searchParams = useSearchParams();
  const initialGoal = searchParams.get('goal');
  
  const [activeTab, setActiveTab] = useState<string>('Instagram');
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>(['Instagram', 'WhatsApp', 'Google Business']);
  const [newPlatform, setNewPlatform] = useState('');
  
  useEffect(() => {
    if (initialGoal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTargetPlatforms(prev => {
        if (!prev.includes(initialGoal)) {
          return [...prev, initialGoal];
        }
        return prev;
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(initialGoal);
    }
  }, [initialGoal]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [outputs, setOutputs] = useState<ContentOutput[] | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const { user, businessProfile, stats } = useAuth();

  // Form State
  const [location, setLocation] = useState(businessProfile?.businessLocation || 'Pink Bean Café (Bandra West)');
  const [goal, setGoal] = useState('Weekend Footfall / Offer Promotion');
  const [tone, setTone] = useState('Casual & Fun');
  const [language, setLanguage] = useState('Hinglish');
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const generateContent = async () => {
    if (!user) return;
    
    if ((stats?.creditsUsed || 0) >= 20) {
      setShowPricing(true);
      return;
    }
    
    setIsGenerating(true);
    setFeedback(null);
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: location || businessProfile?.businessLocation || 'Bandra West',
          goal,
          platforms: targetPlatforms,
          tone,
          language
        })
      });
      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setOutputs(data);
      if (data.length > 0) setActiveTab(data[0].platform);
      
      await addDoc(collection(db, 'content'), {
        userId: user.uid,
        location,
        goal,
        tone,
        language,
        platforms: data,
        creditsCost: data.length * 3,
        createdAt: serverTimestamp()
      });
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentContent = outputs?.find(o => o.platform === activeTab)?.content || `Weekend scenes at Pink Bean Café just got an upgrade! ☕✨

Bandra peeps, tired of the same old weekend vibes? Drop everything and head over because our signature cold brews and newly launched truffle fries are calling your name. 🍟🧊

Toh wait kis baat ka? Grab your squad and vibe with us. Free WiFi, epic playlists, aur best coffee in town.

Special Weekend Offer: Dikhao yeh post aur pao 15% off on your total bill! Valid only this Sat-Sun. 🔥

📍 Pink Bean Café, Linking Road, Bandra West.
⏰ 10 AM to 11 PM`;

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Content Studio</h1>
        <p className="text-gray-500 text-lg">Craft hyper-localized, brand-aligned messaging for any platform in seconds.</p>
      </div>

      <div className="flex gap-8 flex-1 min-h-0">
        {/* Left Panel: Parameters */}
        <div className="w-[400px] flex-shrink-0 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Settings2 className="w-6 h-6 text-[#3C2EE5]" />
            <h2 className="text-xl font-bold text-gray-900">Campaign Parameters</h2>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">BUSINESS LOCATION</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pink Bean Café (Bandra West)"
                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 outline-none focus:ring-2 focus:ring-[#3C2EE5]/20 focus:border-[#3C2EE5] transition-all" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CAMPAIGN GOAL</label>
              <input 
                type="text" 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 outline-none focus:ring-2 focus:ring-[#3C2EE5]/20 focus:border-[#3C2EE5] transition-all" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">TARGET PLATFORMS</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {targetPlatforms.map(platform => (
                  <span key={platform} className="px-3 py-1.5 rounded-full bg-[#3C2EE5] text-white text-sm font-medium flex items-center gap-2">
                    {platform}
                    <button 
                      onClick={() => {
                        const newTargets = targetPlatforms.filter(p => p !== platform);
                        setTargetPlatforms(newTargets);
                        if (activeTab === platform && newTargets.length > 0) setActiveTab(newTargets[0]);
                      }}
                      className="hover:text-indigo-200 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newPlatform.trim()) {
                      if (!targetPlatforms.includes(newPlatform.trim())) {
                        setTargetPlatforms([...targetPlatforms, newPlatform.trim()]);
                      }
                      setNewPlatform('');
                    }
                  }}
                  placeholder="Add platform (e.g. TikTok) and press Enter"
                  className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#3C2EE5] transition-colors"
                />
                <button 
                  onClick={() => {
                    if (newPlatform.trim() && !targetPlatforms.includes(newPlatform.trim())) {
                      setTargetPlatforms([...targetPlatforms, newPlatform.trim()]);
                      setNewPlatform('');
                    }
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">TONE OF VOICE</label>
              <div className="grid grid-cols-2 gap-2">
                {['Professional', 'Casual & Fun', 'Urgent', 'Warm & Welcoming'].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setTone(t)}
                    className={`py-2.5 rounded-lg font-medium text-sm transition-colors ${tone === t ? 'bg-[#3C2EE5] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">LANGUAGE</label>
              <div className="flex gap-2">
                {['English', 'Hindi', 'Hinglish'].map((l) => (
                  <button 
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors ${language === l ? 'bg-[#3C2EE5] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t">
            <button 
              onClick={generateContent}
              disabled={isGenerating}
              className="w-full py-3.5 bg-[#3C2EE5] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#3226c2] shadow-md shadow-indigo-100 disabled:opacity-70 transition-all"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="w-5 h-5">✨</span>} 
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </button>
            <p className="text-center text-sm text-gray-500 mt-3 font-medium">Cost: {targetPlatforms.length * 3} Credits</p>
          </div>
        </div>

        {/* Right Panel: Output */}
        <div className="flex-1 bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden relative">
          {/* Tabs */}
          <div className="flex items-center border-b px-2 overflow-x-auto">
            {(outputs ? outputs.map(o => o.platform) : targetPlatforms).map((tabId, index) => (
              <button 
                key={`${tabId}-${index}`}
                onClick={() => setActiveTab(tabId)}
                className={`px-6 py-4 text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === tabId ? 'font-bold text-[#3C2EE5] border-b-2 border-[#3C2EE5]' : 'font-semibold text-gray-500 hover:text-gray-700'}`}
              >
                {tabId}
              </button>
            ))}
          </div>

          <div className="p-8 flex-1 overflow-y-auto bg-gray-50/50">
            <div className="flex items-center justify-between mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold tracking-wide">
                <CheckCircle2 className="w-3.5 h-3.5" />
                92% Brand Match
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setFeedback(feedback === 'up' ? null : 'up')} 
                  className={`p-2 rounded-full border shadow-sm transition-colors ${feedback === 'up' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setFeedback(feedback === 'down' ? null : 'down')} 
                  className={`p-2 rounded-full border shadow-sm transition-colors ${feedback === 'down' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(currentContent);
                    alert('Copied to clipboard!');
                  }}
                  className="p-2 rounded-full bg-white border shadow-sm text-[#3C2EE5] hover:bg-indigo-50 font-medium text-sm px-4"
                >
                  Copy Text
                </button>
              </div>
            </div>

            <div className="prose prose-lg prose-gray max-w-none">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                   <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#3C2EE5]" />
                   <p className="font-medium">Crafting the perfect message...</p>
                </div>
              ) : (
                <p className="text-gray-800 text-xl leading-relaxed whitespace-pre-wrap">
                  {currentContent}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}

export default function ContentStudioPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Studio...</div>}>
      <ContentStudioForm />
    </Suspense>
  );
}
