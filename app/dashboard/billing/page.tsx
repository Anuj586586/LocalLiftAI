'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle2, Zap } from 'lucide-react';
import { useLocalizedPrice } from '@/hooks/useLocalizedPrice';

export default function BillingPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { priceString, isLoading } = useLocalizedPrice(29);

  const handleSubscribe = async () => {
    setIsProcessing(true);
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
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Billing & Subscription</h1>
        <p className="mt-2 text-gray-600">Manage your subscription and payment methods.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="space-y-4 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-2">
            <Zap className="w-4 h-4" />
            Pro Plan
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Upgrade to Pro</h2>
          <p className="text-gray-600">
            Get unlimited AI content generations, premium SEO tools, and priority support to grow your local business faster.
          </p>
          <ul className="space-y-2 pt-2">
            {[
              'Unlimited Content Generations',
              'Advanced Local SEO Tools',
              'Automated Review Responses',
              'Priority 24/7 Support'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="w-full md:w-auto bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col items-center min-w-[280px]">
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {isLoading ? <span className="animate-pulse bg-gray-200 h-10 w-24 rounded inline-block"></span> : priceString}
            <span className="text-lg text-gray-500 font-normal">/month</span>
          </div>
          <p className="text-sm text-gray-500 mb-6">Cancel anytime</p>
          
          <button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 bg-[#3C2EE5] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#3C2EE5]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <CreditCard className="w-5 h-5" />
            {isProcessing ? 'Processing...' : 'Upgrade Now'}
          </button>
          
          <p className="text-xs text-gray-400 mt-4 text-center">Secure payment powered by Stripe</p>
        </div>
      </div>
    </div>
  );
}
