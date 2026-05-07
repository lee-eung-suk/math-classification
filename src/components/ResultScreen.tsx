import React from 'react';
import { useGameStore } from '../store/useGameStore';
import Character from './Character';
import { RotateCcw, Award, Home } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  store: ReturnType<typeof useGameStore>;
  myCriteria: string;
  onRestart: () => void;
}

export const ResultScreen: React.FC<Props> = ({ store, myCriteria, onRestart }) => {
  const { bins, characters, mode } = store;

  const playPop = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch(e) {}
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--color-bg)] overflow-hidden">
      
      {/* Floating Top Nav */}
      <div className="absolute top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4 md:px-8">
        <div className="flex items-center justify-between w-full max-w-7xl">
          <div className="flex items-center gap-2">
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => { playPop(); onRestart(); }}
               className="w-10 h-10 glass-panel rounded-full flex items-center justify-center text-[#6E6E73] shadow-sm border border-white/50"
             >
               <Home size={18} />
             </motion.button>
             <h2 className="text-xl md:text-2xl font-bold text-[#1D1D1F] tracking-tight ml-1">분류 결과</h2>
          </div>
          <div className="glass-panel rounded-full p-1.5 flex items-center shadow-sm border border-white/50">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { playPop(); onRestart(); }}
              className="px-6 h-10 rounded-full hover:bg-black/5 text-[#1D1D1F] flex items-center gap-2 transition-colors font-bold text-sm"
            >
              <RotateCcw size={18} />
              처음으로
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full px-4 md:px-8 pt-24 pb-12 scrollbar-hide">
        <div className="max-w-5xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-center mb-10 md:mb-16"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-[#FCA5A5]/20 rounded-[1.2rem] mb-6"
            >
              <Award className="w-8 h-8 text-[#FCA5A5]" />
            </motion.div>
            
            <h3 className="text-xl md:text-2xl text-[#6E6E73] font-medium mb-3">나의 분류 기준은</h3>
            <div className="inline-block glass-panel px-8 md:px-12 py-4 md:py-6 rounded-[2rem]">
              <h2 className="text-3xl md:text-5xl font-bold text-[#5E81F4] tracking-tight">{myCriteria}</h2>
            </div>
          </motion.div>

          <div className={`grid gap-6 md:gap-8 ${bins.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
            {bins.map((bin, index) => (
              <motion.div 
                key={bin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 + (index * 0.1) }}
                className="glass-panel rounded-[2.5rem] p-6 lg:p-8 flex flex-col items-center"
              >
                <div className="bg-white/80 px-6 py-2 rounded-full mb-6 shadow-sm border border-white">
                  <h3 className="text-xl font-bold text-[#1D1D1F]">{bin.name}</h3>
                </div>
                
                <div className="flex flex-wrap justify-center gap-3">
                  {characters
                    .filter(c => bin.characterIds.includes(c.id))
                    .map(char => (
                      <div key={char.id} className="relative">
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="glass-card p-3 rounded-[1.5rem] flex items-center justify-center pointer-events-none shadow-sm"
                        >
                          <Character attributes={char} size={60} />
                        </motion.div>
                        {mode === 'pair' && (
                          <div className="mt-2 text-center">
                            <input 
                              type="text" 
                              placeholder="특징 메모..." 
                              className="w-24 text-xs p-2 bg-black/5 rounded-xl border-none focus:ring-2 focus:ring-[#5E81F4] outline-none text-center font-medium text-[#1D1D1F] placeholder:text-[#aeaeb2] transition-all"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  {bin.characterIds.length === 0 && (
                    <div className="py-8 text-[#6E6E73] font-medium text-sm">
                      분류된 캐릭터가 없습니다
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
