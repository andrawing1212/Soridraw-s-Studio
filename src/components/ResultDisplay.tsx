import React, { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { SongGenerationResult } from '../lib/gemini';
import { motion } from 'motion/react';

interface ResultDisplayProps {
  result: SongGenerationResult;
  selectedGenres: string[];
  selectedMoods: string[];
  selectedThemes: string[];
}

export function ResultDisplay({ result, selectedGenres, selectedMoods, selectedThemes }: ResultDisplayProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({ text, field, label }: { text: string; field: string; label: string }) => (
    <button
      onClick={() => handleCopy(text, field)}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md transition-colors border border-zinc-700 hover:border-zinc-600"
    >
      {copiedField === field ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
      {label}
    </button>
  );

  const formattedTitle = `[${result.genres.join(', ')}] '${result.englishTitle}' / '${result.koreanTitle}'`;

  const renderBadge = (item: string, selectedList: string[]) => {
    const isAuto = !selectedList.includes(item);
    return (
      <span
        key={item}
        className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-full border transition-colors ${
          isAuto
            ? 'bg-[#3E2723]/40 text-[#D7CCC8] border-[#5D4037] shadow-[0_0_10px_rgba(93,64,55,0.2)]' // Brown for auto-completed
            : 'bg-zinc-800 text-zinc-300 border-zinc-700'
        }`}
      >
        {item}
        {isAuto && <Sparkles size={10} className="text-[#BCAAA4] ml-0.5" />}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12 space-y-8"
    >
      {/* Applied Categories */}
      <div className="p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Applied Atmosphere</h3>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-700"></span> Selected</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#5D4037]"></span> Auto-completed</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.appliedGenres.map(g => renderBadge(g, selectedGenres))}
          {result.appliedMoods.map(m => renderBadge(m, selectedMoods))}
          {result.appliedThemes.map(t => renderBadge(t, selectedThemes))}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">{formattedTitle}</h2>
          <CopyButton text={formattedTitle} field="title" label="Copy Title" />
        </div>
      </div>

      {/* Prompt */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Music Prompt</h3>
          <CopyButton text={result.musicPrompt} field="prompt" label="Copy Prompt" />
        </div>
        <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-sm text-zinc-300 leading-relaxed font-mono">
          {result.musicPrompt}
        </div>
      </div>

      {/* Lyrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* English Lyrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">English Lyrics</h3>
            <CopyButton text={result.englishLyrics} field="eng_lyrics" label="Copy English" />
          </div>
          <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {result.englishLyrics}
          </div>
        </div>

        {/* Korean Lyrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Korean Lyrics</h3>
            <CopyButton text={result.koreanLyrics} field="kor_lyrics" label="Copy Korean" />
          </div>
          <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {result.koreanLyrics}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
