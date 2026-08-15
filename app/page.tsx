import { PublicHeader } from '@/components/PublicHeader';
import { PublicFooter } from '@/components/PublicFooter';
import { Sparkles, TrendingUp, PlayCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#3C2EE5] selection:text-white">
      <PublicHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-bold tracking-wide mb-8 border border-gray-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            LOCALLIFT 2.0 IS LIVE
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
            Your AI Marketing Team for Your <br className="hidden md:block" />
            <span className="text-[#3C2EE5] underline decoration-4 underline-offset-8">Local Business</span>
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create weeks of social media content, festival campaigns, and targeted promotions in minutes — purpose-built for Indian businesses.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-[#3C2EE5] text-white rounded-xl font-semibold hover:bg-[#3226c2] transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-lg">
              Start Creating Free <span className="text-xl leading-none">→</span>
            </Link>
          </div>
          <p className="text-sm font-medium text-gray-400">No credit card required. Cancel anytime.</p>
        </section>

        {/* Mockup Section */}
        <section className="px-4 md:px-8 max-w-6xl mx-auto mb-24 relative z-10 hidden md:block">
          <div className="bg-white rounded-[2rem] border border-gray-200 shadow-2xl overflow-hidden flex flex-col relative">
             {/* Browser Chrome */}
             <div className="h-14 bg-gray-50 border-b flex items-center px-6 gap-4">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400" />
                   <div className="w-3 h-3 rounded-full bg-amber-400" />
                   <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="bg-white border rounded-md px-4 py-1.5 text-xs text-gray-500 font-medium flex items-center gap-2 flex-1 max-w-sm ml-4">
                   <span className="w-3 h-3 opacity-50">🔒</span> locallift.ai/dashboard/pink-bean-jaipur
                </div>
             </div>
             
             {/* App Interface Mockup inside Browser */}
             <div className="flex h-[500px]">
                {/* Mock Sidebar */}
                <div className="w-64 border-r bg-white p-4 flex flex-col gap-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-50 rounded-full" />
                      <div>
                         <div className="font-bold text-sm">Pink Bean Café</div>
                         <div className="text-xs text-gray-500">Jaipur, RJ</div>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="bg-[#3C2EE5] text-white px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
                         <Sparkles className="w-4 h-4" /> Campaign Studio
                      </div>
                      <div className="text-gray-600 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                         <div className="w-4 h-4 opacity-70">📅</div> Content Planner
                      </div>
                      <div className="text-gray-600 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                         <div className="w-4 h-4 opacity-70">📊</div> Insights
                      </div>
                   </div>
                </div>
                
                {/* Mock Main Content */}
                <div className="flex-1 bg-gray-50/50 p-8 flex flex-col gap-6 relative">
                   <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-900">Generate Diwali Campaign</h2>
                      <div className="px-4 py-2 bg-[#3C2EE5] text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm">
                         <Sparkles className="w-4 h-4" /> Generate Now
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-6 flex-1">
                      <div className="col-span-2 bg-white rounded-xl border p-6 flex flex-col gap-6">
                         <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full w-fit">
                            <CheckCircle2 className="w-4 h-4" /> AI Analyzed Local Trends
                         </div>
                         <div className="space-y-3">
                            <div className="h-4 bg-gray-100 rounded-sm w-3/4" />
                            <div className="h-4 bg-gray-100 rounded-sm w-full" />
                            <div className="h-4 bg-gray-100 rounded-sm w-5/6" />
                         </div>
                         <div className="grid grid-cols-2 gap-4 mt-auto">
                            <div className="aspect-[4/3] rounded-lg bg-gray-100 overflow-hidden relative">
                               <img src="https://picsum.photos/seed/diwali/400/300" className="w-full h-full object-cover" alt="Diwali" />
                               <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded text-xs font-semibold">Post 1: Pre-Diwali Offer</div>
                            </div>
                            <div className="aspect-[4/3] rounded-lg bg-gray-100 overflow-hidden relative">
                               <img src="https://picsum.photos/seed/festival/400/300" className="w-full h-full object-cover" alt="Festival" />
                               <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded text-xs font-semibold">Reel: Festive Prep</div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="col-span-1 bg-gray-50 rounded-xl border p-6">
                         <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">CAMPAIGN SETTINGS</h3>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b">
                               <span className="text-sm font-medium text-gray-700">Language</span>
                               <span className="text-xs font-semibold bg-indigo-100 text-[#3C2EE5] px-2 py-1 rounded">Hinglish</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b">
                               <span className="text-sm font-medium text-gray-700">Tone</span>
                               <span className="text-sm text-gray-600">Warm & Festive</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b">
                               <span className="text-sm font-medium text-gray-700">Duration</span>
                               <span className="text-sm text-gray-600">7 Days</span>
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   {/* Floating widget */}
                   <div className="absolute bottom-8 right-8 bg-white rounded-xl shadow-xl border p-4 flex items-center gap-4 animate-bounce">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                         <TrendingUp className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                         <div className="text-sm font-bold text-gray-900">Engagement +42%</div>
                         <div className="text-xs text-gray-500 font-medium">Last 7 days</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>
        
        {/* Trusted By Banner */}
        <section className="border-y bg-white py-12 px-4 md:px-8 text-center">
           <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-8">BUILT FOR BUSINESSES THAT WANT TO MARKET BETTER, NOT HARDER.</p>
           <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
              {['Cafés & Bakeries', 'Salons & Spas', 'Boutiques', 'Restaurants', 'Gyms & Studios', 'Creators', 'Local Retail'].map((type, i) => (
                 <div key={type} className={`px-6 py-3 rounded-full border bg-white text-sm font-bold flex items-center gap-2 shadow-sm ${i % 2 === 0 ? 'text-[#3C2EE5] border-indigo-100' : 'text-rose-500 border-rose-100'}`}>
                    <span className="opacity-70">🏪</span> {type}
                 </div>
              ))}
           </div>
        </section>
      </main>
      
      <PublicFooter />
    </div>
  );
}
