import { PublicHeader } from '@/components/PublicHeader';
import { PublicFooter } from '@/components/PublicFooter';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#3C2EE5] selection:text-white">
      <PublicHeader />
      
      <main className="flex-1 pb-24">
        <section className="pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Choose the plan that fits your local business. No hidden fees.
          </p>
          
          <div className="inline-flex items-center gap-2 p-1.5 bg-gray-100 rounded-full text-sm font-semibold mb-16">
            <button className="px-6 py-2 bg-white shadow-sm rounded-full text-gray-900">Monthly</button>
            <button className="px-6 py-2 text-gray-500 hover:text-gray-900">Annually (Save 20%)</button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
            {/* Starter Plan */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Basic</h3>
              <p className="text-gray-500 text-sm mb-6 h-10">Perfect for single-location businesses just getting started.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₹99</span>
                <span className="text-gray-500 font-medium">/month</span>
              </div>
              <Link href="/login" className="w-full py-3 px-4 bg-gray-50 text-gray-900 font-semibold rounded-xl text-center hover:bg-gray-100 transition-colors border mb-8">
                Start Free Trial
              </Link>
              <div className="space-y-4 flex-1">
                {['20 AI Credits/month', '1 Business Location', 'Basic Post Templates', 'Standard Support'].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                     <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-3xl p-8 border-2 border-[#3C2EE5] shadow-xl shadow-indigo-100 relative flex flex-col scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3C2EE5] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold text-[#3C2EE5] mb-2">Medium</h3>
              <p className="text-gray-500 text-sm mb-6 h-10">Everything you need to automate your local marketing completely.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₹299</span>
                <span className="text-gray-500 font-medium">/month</span>
              </div>
              <Link href="/login" className="w-full py-3 px-4 bg-[#3C2EE5] text-white font-semibold rounded-xl text-center hover:bg-[#3226c2] shadow-md shadow-indigo-100 transition-colors mb-8">
                Get Started
              </Link>
              <div className="space-y-4 flex-1">
                {['100 AI Credits/month', 'Up to 3 Locations', 'Advanced Creative Studio', 'Priority Email Support', 'Custom Brand Voice'].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#3C2EE5]" />
                    <span className="text-gray-900 font-semibold text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
              <p className="text-gray-500 text-sm mb-6 h-10">For agencies and multi-location franchises.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₹699</span>
                <span className="text-gray-500 font-medium">/month</span>
              </div>
              <Link href="/contact" className="w-full py-3 px-4 bg-gray-50 text-gray-900 font-semibold rounded-xl text-center hover:bg-gray-100 transition-colors border mb-8">
                Contact Sales
              </Link>
              <div className="space-y-4 flex-1">
                {['Unlimited Credits', 'Unlimited Locations', 'API Access', 'Dedicated Account Manager', 'White-label Reports'].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <PublicFooter />
    </div>
  );
}
