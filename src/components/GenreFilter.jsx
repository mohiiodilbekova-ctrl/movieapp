import React from 'react';
import { motion } from 'motion/react';

export function GenreFilter({ genres, selectedGenre, onSelect }) {
  if (genres.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-10 w-full animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col gap-2 w-full">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Janrlar bo'yicha filter</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(null)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
              selectedGenre === null
                ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/30'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            Barchasi
          </motion.button>
          {genres.map((genre) => (
            <motion.button
              key={genre}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(genre)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
                selectedGenre === genre
                  ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/30'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {genre}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
