import React, { useState, useEffect } from 'react';
import { X, Star, Calendar, Clock, List, ExternalLink, Loader2, Info, Layout } from 'lucide-react';
import { motion } from 'motion/react';

export function ShowModal({ show, onClose }) {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        const response = await fetch(`https://api.tvmaze.com/shows/${show.id}/episodes`);
        const data = await response.json();
        setEpisodes(data);
      } catch (err) {
        console.error('Epizodlarni olishda xatolik:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEpisodes();
    
    // Lock scroll
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'unset';
  }, [show.id]);

  const stripHtml = (html) => {
    if (!html) return 'Tavsif mavjud emas';
    return html.replace(/<[^>]*>/g, '');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-slate-950/95 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#020617] border border-slate-800 w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[40px] flex flex-col lg:flex-row shadow-[0_0_100px_rgba(37,99,235,0.15)] relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-30 p-3 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all shadow-2xl hover:scale-110 active:scale-90"
        >
          <X size={24} className="text-white" />
        </button>

        {/* Left: Poster + Visual Background */}
        <div className="w-full lg:w-2/5 h-80 lg:h-auto relative overflow-hidden bg-slate-900 lg:border-r border-slate-800">
          {show.image?.original ? (
            <img
              src={show.image.original}
              alt={show.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-8xl">
              🎬
              <p className="text-xs font-black text-slate-700 mt-4 tracking-widest uppercase">POSTER NOAVIER</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent lg:hidden"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#020617] hidden lg:block"></div>
        </div>

        {/* Right: Detailed Content */}
        <div className="w-full lg:w-3/5 p-8 md:p-16 overflow-y-auto custom-scrollbar flex flex-col">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-blue-500 font-black tracking-widest text-[10px] uppercase bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 shadow-lg shadow-blue-500/5">
              FILM DETALLARI
            </span>
            <span className="text-slate-600 font-bold px-3 py-1 bg-white/5 rounded-lg text-xs uppercase tracking-widest border border-white/5">{show.type === 'Scripted' ? 'Serial' : show.type || 'Serial'}</span>
          </div>

          <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9] bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">
            {show.name}
          </h2>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-[24px] flex flex-col items-center justify-center gap-2 group hover:border-amber-500/30 transition-all">
              <Star className="text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" size={24} />
              <span className="text-white font-black text-xl leading-none">{show.rating?.average || 'N/A'}</span>
              <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">REYTING</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-[24px] flex flex-col items-center justify-center gap-2 group hover:border-blue-500/30 transition-all">
              <Calendar className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />
              <span className="text-white font-black text-xl leading-none">{show.premiered?.split('-')[0] || 'Nomaʼlum'}</span>
              <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">YILI</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-[24px] flex flex-col items-center justify-center gap-2 group hover:border-purple-500/30 transition-all">
              <Clock className="text-purple-400 group-hover:scale-110 transition-transform" size={24} />
              <span className="text-white font-black text-xl leading-none">{show.averageRuntime || show.runtime || '0'} daqiqa</span>
              <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">DAVOMIYLIGI</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-[24px] flex flex-col items-center justify-center gap-2 group hover:border-emerald-500/30 transition-all">
              <Layout className="text-emerald-400 group-hover:scale-110 transition-transform" size={24} />
              <span className="text-white font-black text-xl leading-none">{loading ? '...' : episodes.length}</span>
              <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">EPIZOD</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-12">
            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-4">
              <Info size={16} className="text-blue-600" />
              TAVSIF VA SYUJET
              <span className="flex-grow h-[1px] bg-slate-800"></span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-lg font-medium opacity-80 first-letter:text-4xl first-letter:font-black first-letter:text-blue-500 first-letter:mr-1">
              {stripHtml(show.summary)}
            </p>
          </div>

          {/* Episodes Section */}
          <div className="mb-8">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                  <List size={16} className="text-blue-600" />
                  EPIZODLAR RO'YXATI
                  <span className="w-20 h-[1px] bg-slate-800"></span>
                </h4>
                {show.officialSite && (
                  <a 
                    href={show.officialSite} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] font-black text-blue-500 hover:text-blue-400 transition-all flex items-center gap-2 bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10 uppercase tracking-widest"
                  >
                    RASMIY KO'RISH <ExternalLink size={12} />
                  </a>
                )}
             </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              {loading ? (
                <div className="py-12 flex flex-col items-center gap-3">
                   <Loader2 className="animate-spin text-blue-600" size={40} />
                   <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Yuklanmoqda...</p>
                </div>
              ) : episodes.length > 0 ? (
                episodes.map((ep) => (
                  <div key={ep.id} className="flex items-center gap-5 p-5 bg-slate-900/60 border border-slate-800 rounded-3xl hover:border-slate-700 hover:bg-slate-900 transition-all group shadow-sm">
                    <div className="bg-blue-600/10 px-3 py-2 rounded-xl border border-blue-500/20">
                      <span className="text-blue-500 font-mono text-xs font-black">S{ep.season < 10 ? '0'+ep.season : ep.season} E{ep.number < 10 ? '0'+ep.number : ep.number}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-slate-100 text-sm font-black group-hover:text-blue-400 transition-colors uppercase tracking-tight">{ep.name}</p>
                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.1em] mt-1">{ep.airdate || 'Sana yo\'q'}</p>
                    </div>
                    {ep.rating?.average && (
                       <div className="flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-500/5 px-2 py-1 rounded-lg">
                         <Star size={10} className="fill-amber-500" />
                         {ep.rating.average}
                       </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-slate-700 font-black uppercase tracking-[0.2em] text-xs">Epizodlar topilmadi</div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-auto pt-8 border-t border-slate-900">
            {show.genres?.map((g) => (
              <span key={g} className="px-5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-blue-500 hover:text-white transition-all cursor-default">
                {g}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
