import React, { useState } from 'react';
import { Search, Shuffle, RefreshCcw, Loader2, Music } from 'lucide-react';
import { motion } from 'motion/react';
import { CategorySelector } from './components/CategorySelector';
import { ResultDisplay } from './components/ResultDisplay';
import { generateSong, SongGenerationResult } from './lib/gemini';
import { GENRES, MOODS, THEMES } from './constants';

export default function App() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<SongGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleSelection = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    max: number
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else if (list.length < max) {
      setList([...list, item]);
    }
  };

  const clearAll = () => {
    setSelectedGenres([]);
    setSelectedMoods([]);
    setSelectedThemes([]);
    setSearchText('');
  };

  const randomizeAll = () => {
    const randomItems = (arr: string[], count: number) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };
    
    setSelectedGenres(randomItems(GENRES, Math.floor(Math.random() * 5) + 1));
    setSelectedMoods(randomItems(MOODS, Math.floor(Math.random() * 5) + 1));
    setSelectedThemes(randomItems(THEMES, Math.floor(Math.random() * 5) + 1));
  };

  const handleGenerate = async () => {
    let finalGenres = selectedGenres;
    let finalMoods = selectedMoods;
    let finalThemes = selectedThemes;

    if (finalGenres.length === 0 && finalMoods.length === 0 && finalThemes.length === 0 && !searchText.trim()) {
      const randomItems = (arr: string[], count: number) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };
      
      finalGenres = randomItems(GENRES, 5);
      finalMoods = randomItems(MOODS, 5);
      finalThemes = randomItems(THEMES, 5);
      
      setSelectedGenres(finalGenres);
      setSelectedMoods(finalMoods);
      setSelectedThemes(finalThemes);
    }

    setIsGenerating(true);
    setError(null);
    try {
      const res = await generateSong(finalGenres, finalMoods, finalThemes, searchText);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-orange-500/30">
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500 mb-6 shadow-[0_0_40px_rgba(249,115,22,0.4)]"
          >
            <Music size={32} className="text-black" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-4"
          >
            SORIDRAW's <span className="text-red-500">Studio</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-zinc-400 uppercase tracking-[0.3em] mb-12"
          >
            Compose Your Atmosphere
          </motion.p>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
          >
            당신의 이야기를 <span className="text-orange-500">음악</span>으로
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-zinc-300 text-lg max-w-2xl mx-auto">
              장르, 분위기, 주제를 선택하여 당신만의 감성적인 곡을 작곡해보세요.
            </p>
            <p className="text-zinc-500 text-sm max-w-2xl mx-auto">
              선택하지 않은 항목은 가장 잘 어울리는 분위기로 자동 완성됩니다.
            </p>
          </motion.div>
        </div>

        {/* Categories */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
          <CategorySelector
            title="장르 (Genre)"
            items={GENRES}
            selectedItems={selectedGenres}
            maxSelections={5}
            onToggle={(item) => toggleSelection(item, selectedGenres, setSelectedGenres, 5)}
            onClear={() => setSelectedGenres([])}
          />
          <CategorySelector
            title="분위기 (Mood)"
            items={MOODS}
            selectedItems={selectedMoods}
            maxSelections={5}
            onToggle={(item) => toggleSelection(item, selectedMoods, setSelectedMoods, 5)}
            onClear={() => setSelectedMoods([])}
          />
          <CategorySelector
            title="주제 (Theme)"
            items={THEMES}
            selectedItems={selectedThemes}
            maxSelections={5}
            onToggle={(item) => toggleSelection(item, selectedThemes, setSelectedThemes, 5)}
            onClear={() => setSelectedThemes([])}
          />

          {/* Search Bar & Actions */}
          <div className="mt-8 pt-8 border-t border-zinc-900 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="추가로 원하는 느낌이나 악기를 자유롭게 적어주세요..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isGenerating) {
                    handleGenerate();
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={randomizeAll}
                className="p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-orange-500 transition-colors flex items-center justify-center group"
                title="Randomize All"
              >
                <Shuffle size={20} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>
              <button
                onClick={clearAll}
                className="p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200 transition-colors flex items-center justify-center group"
                title="Clear All"
              >
                <RefreshCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-8 py-4 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    작곡 중...
                  </>
                ) : (
                  '곡 생성'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-8">
            {error}
          </div>
        )}

        {/* Results */}
        {result && !isGenerating && (
          <ResultDisplay 
            result={result} 
            selectedGenres={selectedGenres}
            selectedMoods={selectedMoods}
            selectedThemes={selectedThemes}
          />
        )}
      </main>
    </div>
  );
}
