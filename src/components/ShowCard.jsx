import React from 'react';
import { Star, Heart, Calendar, Globe, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function ShowCard({ show, isFavorite, onToggleFavorite, onClick }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onClick}
      className="bento-card overflow-hidden cursor-pointer flex flex-col group h-full relative hover:border-blue-500/50 hover:bg-[#1e293b]/70 transition-all duration-500 shadow-xl"
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(e, show.id);
        }}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-slate-800 hover:bg-slate-900 transition-all shadow-2xl hover:scale-110 active:scale-95"
      >
        <Heart
          size={18}
          className={isFavorite ? 'fill-red-500 stroke-red-500' : 'text-slate-500 group-hover:text-slate-300'}
        />
      </button>

      {/* Poster Section */}
      <div className="aspect-[3/4] overflow-hidden bg-slate-900 relative">
        {show.image?.medium ? (
          <img
            src={show.image.medium}
            alt={show.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/80 text-6xl">
            🎬
            <span className="text-[10px] text-slate-700 font-black mt-2 tracking-widest text-center px-4">POSTER YO'Q</span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300"></div>
        
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-center">
           <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
             <PlayCircle size={16} className="text-blue-400" />
             <span className="text-xs font-black text-white tracking-widest uppercase">BATAFSIL</span>
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-black text-white line-clamp-1 group-hover:text-blue-400 transition-colors tracking-tight">
            {show.name}
          </h3>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-amber-400 font-black text-sm">
            <Star size={14} className="fill-amber-400" />
            {show.rating?.average || 'Yoʻq'}
          </div>
          <span className="text-slate-800 font-bold text-[10px]">•</span>
          <div className={`text-[10px] font-black uppercase tracking-wider ${show.status === 'Running' ? 'text-emerald-500' : 'text-slate-500'}`}>
            {show.status === 'Running' ? 'Efirda' : show.status === 'Ended' ? 'Tugagan' : show.status || 'Nomaʼlum'}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {show.genres?.slice(0, 3).map((g) => (
            <span key={g} className="text-[9px] font-black bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-lg uppercase tracking-wider group-hover:text-slate-200 group-hover:border-slate-700 transition-colors">
              {g}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest border-t border-slate-800 pt-4">
           <div className="flex items-center gap-2">
            <Calendar size={12} className="text-blue-600" />
            {show.premiered?.split('-')[0] || 'Yoʻq'}
          </div>
          <div className="flex items-center gap-2">
            <Globe size={12} className="text-blue-600" />
            {show.language || 'Yoʻq'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
