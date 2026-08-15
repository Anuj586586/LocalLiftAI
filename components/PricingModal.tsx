import { X, Check, Zap } from 'lucide-react';
import { useState } from 'react';

export function PricingModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubscribe = async (plan: string) => {
    setIsProcessing(plan);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to initiate checkout');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (err: any) {
      console.error(err);
      alert(`Payment Error: ${err.message}`);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>
        <div className="p-8 text-center bg-indigo-50 border-b border-indigo-100">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">You&apos;re out of credits!</h2>
          <p className="text-gray-600 max-w-md mx-auto">Upgrade to a premium plan to continue generating AI content and access exclusive features.</p>
        </div>
        <div className="p-8 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Starter Plan */}
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Starter</h3>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-gray-900">
              $19<span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">Perfect for small businesses getting started with AI.</p>
            <ul className="mt-6 space-y-3">
              {['100 AI Generation Credits / mo', 'Basic Content Templates', 'Standard Email Support'].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleSubscribe('starter')}
              disabled={isProcessing !== null}
              className="mt-8 w-full block rounded-lg bg-indigo-50 text-indigo-600 font-semibold py-3 text-center hover:bg-indigo-100 transition-colors disabled:opacity-50"
            >
              {isProcessing === 'starter' ? 'Processing...' : 'Get Starter'}
            </button>
          </div>
          
          {/* Pro Plan */}
          <div className="bg-indigo-600 rounded-xl p-6 border border-indigo-500 shadow-md relative">
            <div className="absolute top-0 right-6 transform -translate-y-1/2">
              <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                Most Popular
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Pro Business</h3>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-white">
              $49<span className="ml-1 text-xl font-medium text-indigo-200">/mo</span>
            </div>
            <p className="mt-4 text-sm text-indigo-100">Everything you need to dominate your local market.</p>
            <ul className="mt-6 space-y-3">
              {['Unlimited AI Generations', 'All Premium Templates', 'Social Media Auto-Posting', 'Priority 24/7 Support'].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-indigo-200 shrink-0" />
                  <span className="text-sm text-white">{feature}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleSubscribe('pro')}
              disabled={isProcessing !== null}
              className="mt-8 w-full block rounded-lg bg-white text-indigo-600 font-semibold py-3 text-center hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isProcessing === 'pro' ? 'Processing...' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
