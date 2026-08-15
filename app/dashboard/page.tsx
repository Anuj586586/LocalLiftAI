'use client';

import { FileText, Megaphone, Clock, Sparkles, Instagram, Video, MessageCircle, PartyPopper, Package, Mic2, Loader2, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { PricingModal } from '@/components/PricingModal';

type CampaignOutput = {
  title: string;
  summary: string;
  channels: string[];
  samplePost: string;
};

export default function DashboardPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<CampaignOutput | null>(null);
  const [recentCampaigns, setRecentCampaigns] = useState<any[]>([]);
  const [showPricing, setShowPricing] = useState(false);
  const { user, businessProfile, stats } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'campaigns'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecentCampaigns(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const generateCampaign = async () => {
    if (!prompt.trim() || !user) return;
    
    if ((stats?.creditsUsed || 0) >= 20) {
      setShowPricing(true);
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, businessName: businessProfile?.businessName || '' })
      });
      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate campaign');
      }

      setOutput(data);
      
      await addDoc(collection(db, 'campaigns'), {
        userId: user.uid,
        title: data.title || '',
        summary: data.summary || '',
        channels: data.channels || [],
        samplePost: data.samplePost || '',
        creditsCost: 3,
        createdAt: serverTimestamp()
      });
      
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <p className="text-sm font-semibold text-[#3C2EE5] tracking-wider uppercase mb-1">{businessProfile?.businessName || 'MY BUSINESS'}</p>
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
          Good morning, {user?.email?.split('@')[0] || 'User'} <span className="text-4xl">👋</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-gray-600 tracking-wider">CONTENT CREATED</span>
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-5xl font-bold text-gray-900 mb-2">{stats?.contentCount || 0}</div>
          <p className="text-sm text-green-700 font-medium flex items-center gap-1">
            Total templates generated
          </p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-gray-600 tracking-wider">CAMPAIGNS</span>
            <Megaphone className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-5xl font-bold text-gray-900 mb-2">{stats?.campaignsCount || 0}</div>
          <p className="text-sm text-blue-700 font-medium flex items-center gap-1">
            Planned marketing drives
          </p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-semibold text-gray-600 tracking-wider">CREDITS REMAINING</span>
              <Sparkles className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-5xl font-bold text-gray-900 mb-4">{Math.max(0, 20 - (stats?.creditsUsed || 0))}</div>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full">
            <div className="h-full bg-[#3C2EE5] rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.round((Math.max(0, 20 - (stats?.creditsUsed || 0)) / 20) * 100))}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 border shadow-sm relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 blur-3xl" />
          
          <h2 className="text-3xl font-bold text-gray-900 mb-3 relative z-10">What do you want to create today?</h2>
          <p className="text-gray-500 text-lg mb-8 max-w-lg relative z-10">Let our AI assist you in crafting the perfect message for your audience.</p>
          
          <div className="bg-gray-50 rounded-xl p-4 border relative z-10 mb-6">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-transparent border-none resize-none focus:ring-0 text-gray-700 placeholder-gray-400 h-24 outline-none"
              placeholder="Describe what you want to promote... e.g. 'Announce our new Monsoon Special Filter Coffee with 20% off for the weekend'"
            />
            <div className="flex justify-end items-center gap-3 mt-2">
              <button 
                onClick={generateCampaign}
                disabled={isGenerating || !prompt.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#3C2EE5] text-white rounded-lg font-medium hover:bg-[#3226c2] transition-colors disabled:opacity-70"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGenerating ? 'Drafting...' : 'Generate Plan'}
              </button>
            </div>
          </div>

          {/* Generated Output */}
          {output && !isGenerating && (
            <div className="mt-2 relative z-10 bg-indigo-50/50 rounded-xl p-6 border border-indigo-100/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{output.title}</h3>
              <p className="text-gray-600 mb-6">{output.summary}</p>
              
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">Recommended Channels</h4>
                <div className="flex gap-2 flex-wrap">
                  {output.channels.map(channel => (
                    <span key={channel} className="px-3 py-1 bg-white border rounded-full text-sm font-medium text-gray-600">
                      {channel}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">Sample Post Copy</h4>
                <div className="bg-white p-4 rounded-lg border text-gray-700 whitespace-pre-wrap">
                  {output.samplePost}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Link href="/dashboard/content" className="flex items-center gap-2 text-[#3C2EE5] font-semibold hover:text-[#3226c2] transition-colors">
                  Open in Content Studio <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { title: 'Instagram Post', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50', param: 'Instagram Post', route: '/dashboard/content' },
              { title: 'Ad Copywriter', icon: Megaphone, color: 'text-orange-600', bg: 'bg-orange-50', param: '', route: '/dashboard/ads' },
              { title: 'Review Responder', icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50', param: '', route: '/dashboard/reviews' },
              { title: 'SEO Maker', icon: Search, color: 'text-indigo-600', bg: 'bg-indigo-50', param: '', route: '/dashboard/seo' },
            ].map((action) => (
              <button key={action.title} onClick={() => router.push(`${action.route}${action.param ? `?goal=${encodeURIComponent(action.param)}` : ''}`)} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all text-left">
                <div className={`p-3 rounded-lg ${action.bg}`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <span className="font-semibold text-gray-800">{action.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {recentCampaigns.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" /> Recent Campaigns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCampaigns.map((campaign) => (
              <div 
                key={campaign.id} 
                onClick={() => {
                  setOutput(campaign);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col cursor-pointer hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{campaign.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{campaign.summary}</p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {(campaign.channels || []).slice(0, 3).map((channel: string) => (
                    <span key={channel} className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {channel}
                    </span>
                  ))}
                  {(campaign.channels?.length || 0) > 3 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      +{(campaign.channels?.length || 0) - 3}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  {campaign.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
