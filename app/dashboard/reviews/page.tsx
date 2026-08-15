'use client';

import { useState } from 'react';
import { Sparkles, Loader2, MessageSquare, CheckCircle2, Copy } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PricingModal } from '@/components/PricingModal';

export default function ReviewResponderPage() {
  const [reviewText, setReviewText] = useState('');
  const [tone, setTone] = useState<'professional' | 'apologetic' | 'enthusiastic'>('professional');
  const [brandName, setBrandName] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{options: string[], explanation: string} | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  
  const { user, stats } = useAuth();

  const generateResponse = async () => {
    if (!reviewText.trim() || !user) return;
    
    if ((stats?.creditsUsed || 0) >= 20) {
      setShowPricing(true);
      return;
    }
    
    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText,
          tone,
          brandName
        })
      });

      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || 'Failed to generate response');

      setResult(data);

      await addDoc(collection(db, 'tools_history'), {
        userId: user.uid,
        tool: 'review_responder',
        inputs: { reviewText, tone, brandName },
        outputs: data,
        creditsCost: 2,
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
        <p className="text-sm font-semibold text-green-600 tracking-wider uppercase mb-1">Review Responder</p>
        <h1 className="text-3xl font-bold text-gray-900">Craft the Perfect Reply</h1>
        <p className="text-gray-500 mt-2">Paste a customer review and get professional, on-brand responses instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Input */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">CUSTOMER REVIEW</label>
            <textarea 
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Paste the customer's review here..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all h-32 resize-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">RESPONSE TONE</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'professional', label: 'Professional' },
                { id: 'apologetic', label: 'Apologetic' },
                { id: 'enthusiastic', label: 'Enthusiastic' }
              ].map((t) => (
                <label key={t.id} className="cursor-pointer">
                  <input 
                    type="radio" 
                    name="tone" 
                    className="peer sr-only" 
                    checked={tone === t.id} 
                    onChange={() => setTone(t.id as any)} 
                  />
                  <div className="p-3 border rounded-xl text-center text-sm font-medium text-gray-600 peer-checked:bg-green-50 peer-checked:border-green-500 peer-checked:text-green-700 hover:bg-gray-50 transition-all">
                    {t.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">YOUR BUSINESS NAME (OPTIONAL)</label>
            <input 
              type="text" 
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Joe's Coffee Shop"
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" 
            />
          </div>

          <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium text-gray-500">Cost: 2 Credits</p>
            <button 
              onClick={generateResponse}
              disabled={isGenerating || !reviewText.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-70"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageSquare className="w-5 h-5" />} 
              {isGenerating ? 'Drafting...' : 'Generate Replies'}
            </button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-500" /> Generated Options
          </h2>

          {!result && !isGenerating ? (
            <div className="h-64 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-gray-300">
                <MessageSquare className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium mb-1">Waiting for review</p>
              <p className="text-gray-400 text-sm max-w-[250px]">Paste a review and hit generate to see AI-crafted responses.</p>
            </div>
          ) : isGenerating ? (
            <div className="h-64 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Analyzing sentiment and drafting...</p>
            </div>
          ) : result ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {result.options.map((option, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative group">
                  <div className="flex justify-between items-start mb-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Option {index + 1}</label>
                  </div>
                  <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">{option}</p>
                  <button 
                    onClick={() => copyToClipboard(option, index)}
                    className="absolute top-4 right-4 p-2 bg-white border rounded-md shadow-sm text-gray-500 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedIndex === index ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
              
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mt-6">
                <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Why these work</label>
                <p className="text-sm text-blue-900/80 leading-relaxed">{result.explanation}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
