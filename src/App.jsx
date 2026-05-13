import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, Heart, Film, Loader2, Sparkles, AlertCircle, 
  Home, Calendar, Zap, Bell, User, Layers, TrendingUp 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ShowCard } from './components/ShowCard';
import { ShowModal } from './components/ShowModal';
import { GenreFilter } from './components/GenreFilter';
import { useFavorites } from './hooks/useFavorites';

const POPULAR_QUERIES = ['The Last of Us', 'Breaking Bad', 'The Bear', 'Succession', 'Beef', 'Friends', 'Batman'];

export default function App() {
  const [query, setQuery] = useState('');
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [viewMode, setViewMode] = useState('home'); // 'home', 'favorites'
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Search logic trigger when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchShows(debouncedQuery);
    } else if (debouncedQuery === '') {
       // Only clear if user cleared input
       // But let's keep trending if empty
       searchShows('Trending');
    }
  }, [debouncedQuery]);

  // Initial load
  useEffect(() => {
    searchShows('Trending');
  }, []);

  const searchShows = async (searchQuery) => {
    setLoading(true);
    setError('');
    setSelectedGenre(null);

    try {
      const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Serverda xatolik yuz berdi');
      const data = await response.json();
      setShows(data.map((item) => item.show));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredShows = useMemo(() => {
    let result = shows;
    
    if (viewMode === 'favorites') {
      // In JS, we might have many IDs, but TVMaze doesn't support bulk fetch by ID easily
      // So we filter current results. 
      // ADVANCED: We would ideally fetch each favorite by ID if not in result
      result = shows.filter(s => favorites.includes(s.id));
    }
    
    if (selectedGenre) {
      result = result.filter(s => s.genres?.includes(selectedGenre));
    }
    
    return result;
  }, [shows, selectedGenre, favorites, viewMode]);

  const availableGenres = useMemo(() => {
    const allGenres = shows.flatMap(s => s.genres || []);
    return Array.from(new Set(allGenres)).sort();
  }, [shows]);

  const handleToggleFavorite = (e, id) => {
    toggleFavorite(id);
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-200 selection:bg-blue-500/30 overflow-hidden font-sans">
      
      {/* SIDEBAR - Bento Layout style */}
      <aside className="w-80 glass-panel border-r border-slate-800/50 hidden lg:flex flex-col p-8 space-y-10 z-20 shadow-2xl">
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => {
            setQuery('');
            setViewMode('home');
            searchShows('Trending');
          }}
        >
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform duration-500">
            🎬
          </div>
          <h1 className="font-black text-2xl tracking-tighter text-white uppercase italic">
            Kino<span className="text-blue-500">Qidir</span>
          </h1>
        </div>

        <nav className="space-y-3">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6 px-4">MENU</p>
          <button 
            onClick={() => { setViewMode('home'); setQuery(''); searchShows('Trending'); }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] font-black uppercase tracking-widest text-[11px] transition-all border ${
              viewMode === 'home' 
                ? 'bg-blue-600/10 text-blue-500 border-blue-500/20 shadow-lg' 
                : 'text-slate-500 border-transparent hover:bg-slate-900 hover:text-slate-300'
            }`}
          >
            <Home size={18} className={viewMode === 'home' ? 'text-blue-500' : ''} />
            Trenddagilar
          </button>
          <button 
            onClick={() => setViewMode('favorites')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] font-black uppercase tracking-widest text-[11px] transition-all border ${
              viewMode === 'favorites' 
                ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-lg' 
                : 'text-slate-500 border-transparent hover:bg-slate-900 hover:text-slate-300'
            }`}
          >
            <Heart size={18} className={viewMode === 'favorites' ? 'fill-red-500' : ''} />
            Sevimlilar
            <span className="ml-auto bg-slate-900 text-[10px] py-1 px-3 rounded-full font-black border border-slate-800">{favorites.length}</span>
          </button>
          <button className="w-full flex items-center gap-4 px-6 py-4 text-slate-500 hover:bg-slate-900 hover:text-slate-300 rounded-[20px] transition font-black uppercase tracking-widest text-[11px] border border-transparent">
            <Layers size={18} />
            Kolleksiyalar
          </button>
        </nav>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pt-4">
           <div className="flex items-center gap-2 mb-6 px-4">
              <TrendingUp size={14} className="text-blue-500" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">TEZKOR QIDIRUV</p>
           </div>
           <div className="grid grid-cols-1 gap-3 px-2">
             {POPULAR_QUERIES.map(q => (
               <button
                 key={q}
                 onClick={() => { setQuery(q); searchShows(q); }}
                 className="w-full text-left px-5 py-4 bg-[#0f172a] border border-slate-800 text-[12px] font-black uppercase tracking-widest text-slate-400 rounded-2xl hover:border-blue-500/50 hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm"
               >
                 {q}
               </button>
             ))}
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col p-6 lg:p-12 overflow-hidden relative">
        
        {/* Header with Search */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 w-full animate-in fade-in slide-in-from-top-10 duration-700">
          <div className="relative w-full group">
             <div className="absolute inset-0 bg-blue-500/5 blur-xl group-focus-within:bg-blue-500/10 transition-all"></div>
             <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors duration-500" size={20} />
             <input
               type="text"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder="Sizga qanday serial yoki film kerak? (masalan: Game of Thrones)"
               className="w-full bg-[#0f172a]/50 border border-slate-800 rounded-[30px] py-6 pl-18 pr-8 text-sm font-bold placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-500 shadow-2xl backdrop-blur-md"
             />
             {loading && (
               <div className="absolute right-8 top-1/2 -translate-y-1/2">
                 <Loader2 className="animate-spin text-blue-500" size={20} />
               </div>
             )}
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pb-20">
          
          {/* Genre Row */}
          {!loading && shows.length > 0 && viewMode !== 'favorites' && (
            <GenreFilter
              genres={availableGenres}
              selectedGenre={selectedGenre}
              onSelect={setSelectedGenre}
            />
          )}

          {/* Result Messaging */}
          <div className="mb-12">
            {!loading && shows.length === 0 && viewMode === 'home' && (
               <div className="py-32 flex flex-col items-center text-center animate-in zoom-in duration-700">
                 <div className="w-28 h-28 mb-10 bento-card flex items-center justify-center bg-blue-600/5 border-blue-500/20 shadow-[0_0_100px_rgba(37,99,235,0.1)]">
                   <Sparkles className="text-blue-500" size={48} />
                 </div>
                 <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">Olam kashfiyotlarini kutmoqda</h2>
                 <p className="text-slate-500 mb-10 max-w-lg mx-auto font-medium leading-relaxed italic">
                   Barcha zamonlarning eng yaxshi kinolari faqat siz uchun. Istalgan nomni yozing va biz sehrimizni ko'rsatamiz.
                 </p>
                 <div className="flex flex-wrap justify-center gap-4">
                    {['Marvel', 'Space', 'Netflix', 'HBO', 'Anime'].map(tag => (
                      <button key={tag} onClick={() => { setQuery(tag); searchShows(tag); }} className="px-5 py-2.5 bg-slate-900/40 rounded-full border border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:border-blue-500 transition-all font-mono">
                        #{tag}
                      </button>
                    ))}
                 </div>
               </div>
            )}

            {error && (
              <div className="bento-card p-12 flex flex-col items-center gap-4 bg-red-500/5 border-red-500/20 max-w-xl mx-auto shadow-2xl animate-in shake duration-500">
                <AlertCircle className="text-red-500" size={48} />
                <p className="text-red-400 font-black text-center text-xl">{error}</p>
                <button onClick={() => searchShows(query || 'Trending')} className="mt-4 text-[10px] bg-slate-900 border border-slate-800 px-8 py-3 rounded-2xl hover:bg-slate-800 text-slate-200 font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">QAYTA URINISH</button>
              </div>
            )}

            {viewMode === 'home' && !loading && shows.length > 0 && (
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                 <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">
                    {query ? `"${query}" - natijalar` : 'Ommabop Seriyallar'}
                 </h2>
                 <span className="bg-slate-900 text-[10px] font-black py-1 px-3 rounded-lg text-slate-500 border border-slate-800 uppercase tracking-widest">{shows.length} NATIJA</span>
              </div>
            )}

            {viewMode === 'favorites' && (
               <div className="mb-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
                    <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">SEVIMLI SERIALLAR</h2>
                    <span className="bg-slate-900 text-[10px] font-black py-1 px-3 rounded-lg text-slate-500 border border-slate-800 uppercase tracking-widest">{favorites.length} TA</span>
                  </div>
                  {favorites.length === 0 && (
                    <div className="py-32 flex flex-col items-center text-center">
                       <Heart size={80} className="text-slate-800 mb-8" />
                       <h3 className="text-3xl font-black text-slate-500 uppercase tracking-tight">Ro'yxat bo'sh</h3>
                       <p className="text-slate-600 mt-4 max-w-sm mx-auto font-medium">Hali hech qanday serialni sevimlilarga qo'shmabsiz. Qidiruv natijalaridagi ❤️ belgisini bosing.</p>
                       <button onClick={() => setViewMode('home')} className="mt-10 px-8 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/30 hover:scale-105 transition-transform active:scale-95">KASHF QILISHNI BOSHLASH</button>
                    </div>
                  )}
               </div>
            )}
          </div>

          {/* Grid Layout - Universal Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredShows.map((show) => (
                <ShowCard
                  key={show.id}
                  show={show}
                  isFavorite={isFavorite(show.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onClick={() => setSelectedShow(show)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Footer Placeholder for Endless Scroll effect or similar */}
          {!loading && shows.length > 0 && (
             <div className="mt-20 py-20 border-t border-slate-900 text-center">
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">KinoQidir © 2026 • Professional Film Portali</p>
             </div>
          )}
        </div>
      </main>

      {/* MODAL SYSTEM */}
      <AnimatePresence>
        {selectedShow && (
          <ShowModal
            show={selectedShow}
            onClose={() => setSelectedShow(null)}
          />
        )}
      </AnimatePresence>

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-[80%] h-[80%] bg-blue-600/5 blur-[200px] rounded-full animate-pulse duration-[10s]"></div>
        <div className="absolute bottom-[-30%] left-[-10%] w-[80%] h-[80%] bg-purple-600/5 blur-[200px] rounded-full animate-pulse duration-[15s]"></div>
      </div>
    </div>
  );
}
