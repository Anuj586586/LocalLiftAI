'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Loader2, Search, CheckCircle2, Copy } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { PricingModal } from '@/components/PricingModal';

export default function SeoMakerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [type, setType] = useState<'product' | 'website'>('product');
  const [additionalContext, setAdditionalContext] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{title: string, description: string, keywords: string, explanation: string} | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, stats } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (!droppedFile.type.startsWith('image/')) {
        alert('Please drop an image file');
        return;
      }
      setFile(droppedFile);
      const url = URL.createObjectURL(droppedFile);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result?.toString().replace(/^data:(.*,)?/, '');
        if ((encoded!.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded!.length % 4));
        }
        resolve(encoded || '');
      };
      reader.onerror = error => reject(error);
    });
  };

  const generateSeo = async () => {
    if (!file || !user) return;
    
    if ((stats?.creditsUsed || 0) >= 20) {
      setShowPricing(true);
      return;
    }
    
    setIsGenerating(true);
    setResult(null);

    try {
      const imageBase64 = await toBase64(file);
      const mimeType = file.type;

      const response = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          type,
          additionalContext
        })
      });

      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || 'Failed to generate SEO data');

      setResult(data);

      await addDoc(collection(db, 'seo'), {
        userId: user.uid,
        type,
        additionalContext,
        title: data.title,
        description: data.description,
        keywords: data.keywords,
        creditsCost: 5,
        createdAt: serverTimestamp()
      });

    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <p className="text-sm font-semibold text-indigo-600 tracking-wider uppercase mb-1">SEO Maker</p>
        <h1 className="text-3xl font-bold text-gray-900">Generate Optimized Metadata</h1>
        <p className="text-gray-500 mt-2">Upload a product image or website screenshot to generate high-ranking SEO titles, meta descriptions, and keywords.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Input */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">IMAGE TYPE</label>
            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="type" 
                  className="peer sr-only" 
                  checked={type === 'product'} 
                  onChange={() => setType('product')} 
                />
                <div className="p-4 border rounded-xl text-center font-medium text-gray-600 peer-checked:bg-indigo-50 peer-checked:border-indigo-500 peer-checked:text-indigo-700 hover:bg-gray-50 transition-all">
                  Product Photo
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="type" 
                  className="peer sr-only" 
                  checked={type === 'website'} 
                  onChange={() => setType('website')} 
                />
                <div className="p-4 border rounded-xl text-center font-medium text-gray-600 peer-checked:bg-indigo-50 peer-checked:border-indigo-500 peer-checked:text-indigo-700 hover:bg-gray-50 transition-all">
                  Website Screenshot
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">UPLOAD IMAGE</label>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                previewUrl 
                  ? 'border-indigo-200 bg-indigo-50/30' 
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50'
              }`}
            >
              {previewUrl ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 border">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white font-medium flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-semibold mb-1">Click to upload or drag and drop</p>
                  <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">ADDITIONAL CONTEXT (OPTIONAL)</label>
            <input 
              type="text" 
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="e.g. Target audience, brand name, specific features"
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
            />
          </div>

          <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium text-gray-500">Cost: 5 Credits</p>
            <button 
              onClick={generateSeo}
              disabled={isGenerating || !file}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#3C2EE5] text-white rounded-xl font-semibold hover:bg-[#3226c2] transition-colors disabled:opacity-70"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />} 
              {isGenerating ? 'Analyzing Image...' : 'Generate SEO Metadata'}
            </button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" /> SEO Results
          </h2>

          {!result && !isGenerating ? (
            <div className="h-64 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-gray-300">
                <Search className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium mb-1">Waiting for image analysis</p>
              <p className="text-gray-400 text-sm max-w-[250px]">Upload an image and hit generate to see optimized SEO tags here.</p>
            </div>
          ) : isGenerating ? (
            <div className="h-64 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#3C2EE5] animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Using Vision AI to analyze visual features...</p>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Title */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative group">
                <div className="flex justify-between items-start mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">SEO Title</label>
                  <span className={`text-xs font-medium ${result.title.length > 60 ? 'text-orange-500' : 'text-green-600'}`}>
                    {result.title.length} chars
                  </span>
                </div>
                <p className="text-gray-900 font-semibold text-lg">{result.title}</p>
                <button 
                  onClick={() => copyToClipboard(result.title, 'title')}
                  className="absolute top-4 right-4 p-2 bg-white border rounded-md shadow-sm text-gray-500 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copied === 'title' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative group">
                <div className="flex justify-between items-start mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Meta Description</label>
                  <span className={`text-xs font-medium ${result.description.length > 160 ? 'text-orange-500' : 'text-green-600'}`}>
                    {result.description.length} chars
                  </span>
                </div>
                <p className="text-gray-700">{result.description}</p>
                <button 
                  onClick={() => copyToClipboard(result.description, 'description')}
                  className="absolute top-4 right-4 p-2 bg-white border rounded-md shadow-sm text-gray-500 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copied === 'description' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Keywords */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Keywords / Tags</label>
                  <button 
                    onClick={() => copyToClipboard(result.keywords, 'keywords')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    {copied === 'keywords' ? 'COPIED!' : 'COPY ALL'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.split(',').map((keyword, i) => (
                    <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md text-sm font-medium">
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strategy Explanation */}
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">SEO Strategy Context</label>
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
