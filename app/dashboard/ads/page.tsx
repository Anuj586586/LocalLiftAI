'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Megaphone, CheckCircle2, Copy } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PricingModal } from '@/components/PricingModal';

export default function AdCopyPage() {
  const [productDetails, setProductDetails] = useState('');
  const [platform, setPlatform] = useState<'facebook' | 'google' | 'instagram'>('facebook');
  const [targetAudience, setTargetAudience] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{headline: string, primaryText: string, description?: string, callToAction: string}[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  
  const { user, stats } = useAuth();

  const generateCopy = async () => {
    if (!productDetails.trim() || !user) return;
    
    if ((stats?.creditsUsed || 0) >= 20) {
      setShowPricing(true);
      return;
    }
    
    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productDetails,
          platform,
          targetAudience
        })
      });

      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || 'Failed to generate ad copy');

      setResult(data.variations);

      await addDoc(collection(db, 'tools_history'), {
        userId: user.uid,
        tool: 'ad_copy',
        inputs: { productDetails, platform, targetAudience },
        outputs: data,
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

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <p className="text-sm font-semibold text-orange-600 tracking-wider uppercase mb-1">Ad Copy Generator</p>
        <h1 className="text-3xl font-bold text-gray-900">High-Converting Ad Text</h1>
        <p className="text-gray-500 mt-2">Instantly write compelling copy for Facebook, Instagram, or Google Ads.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Input */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">AD PLATFORM</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'facebook', label: 'Facebook' },
                { id: 'instagram', label: 'Instagram' },
                { id: 'google', label: 'Google Ads' }
              ].map((p) => (
                <label key={p.id} className="cursor-pointer">
                  <input 
                    type="radio" 
                    name="platform" 
                    className="peer sr-only" 
                    checked={platform === p.id} 
                    onChange={() => setPlatform(p.id as any)} 
                  />
                  <div className="p-3 border rounded-xl text-center text-sm font-medium text-gray-600 peer-checked:bg-orange-50 peer-checked:border-orange-500 peer-checked:text-orange-700 hover:bg-gray-50 transition-all">
                    {p.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">WHAT ARE YOU PROMOTING?</label>
            <textarea 
              value={productDetails}
              onChange={(e) => setProductDetails(e.target.value)}
              placeholder="Describe your product, service, or offer... e.g. '20% off weekend special on organic dog food'"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all h-32 resize-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">TARGET AUDIENCE (OPTIONAL)</label>
            <input 
              type="text" 
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Local homeowners, dog owners, fitness enthusiasts"
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" 
            />
          </div>

          <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium text-gray-500">Cost: 3 Credits</p>
            <button 
              onClick={generateCopy}
              disabled={isGenerating || !productDetails.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-70"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Megaphone className="w-5 h-5" />} 
              {isGenerating ? 'Writing Copy...' : 'Generate Variations'}
            </button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" /> Ad Variations
          </h2>

          {!result && !isGenerating ? (
            <div className="h-64 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-gray-300">
                <Megaphone className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium mb-1">Waiting for details</p>
              <p className="text-gray-400 text-sm max-w-[250px]">Provide your product details to get optimized ad copy.</p>
            </div>
          ) : isGenerating ? (
            <div className="h-64 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-orange-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Crafting compelling ad copy...</p>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {result.map((variation, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative group">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => {
                        const textToCopy = `Headline: ${variation.headline}\nText: ${variation.primaryText}${variation.description ? `\nDescription: ${variation.description}` : ''}\nCTA: ${variation.callToAction}`;
                        copyToClipboard(textToCopy, index);
                      }}
                      className="p-2 bg-white border rounded-md shadow-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {copiedIndex === index ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <div className="pr-12">
                    <div className="mb-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Headline</span>
                      <p className="font-bold text-gray-900 text-lg">{variation.headline}</p>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Primary Text</span>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{variation.primaryText}</p>
                    </div>
                    
                    {variation.description && (
                      <div className="mb-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description (Optional)</span>
                        <p className="text-gray-600 text-sm">{variation.description}</p>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Call To Action</span>
                      <p className="inline-block px-3 py-1 bg-gray-200 text-gray-800 text-xs font-bold rounded mt-1">{variation.callToAction}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
