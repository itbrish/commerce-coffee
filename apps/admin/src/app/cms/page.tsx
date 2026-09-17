"use client";
import React, { useState } from 'react';
import { LayoutTemplate, Save, Check } from 'lucide-react';

export default function AdminCMSPage() {
  const [heroTitle, setHeroTitle] = useState('The Art of Exceptional Coffee');
  const [heroSubtitle, setHeroSubtitle] = useState('Curated collection of the world revered espresso machines and precision grinding instruments.');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Section-Based Homepage CMS</h1>
        <p className="text-xs text-slate-400 mt-0.5">Control editorial hero headlines, brand storytelling blocks, and commercial showcase content without touching code.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
        <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
          <span>1. Editorial Hero Banner</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">ACTIVE ON STOREFRONT</span>
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Hero Main Headline (Serif)</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded text-white focus:outline-none focus:border-amber-400 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Editorial Subtitle</label>
            <textarea
              rows={3}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded text-white focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Primary CTA Text</label>
            <input
              type="text"
              defaultValue="Explore Collection"
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded transition"
          >
            {saved ? <Check size={16} /> : <Save size={16} />}
            <span>{saved ? 'Changes Saved to Database' : 'Publish Section Updates'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
