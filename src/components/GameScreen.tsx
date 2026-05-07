import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, pointerWithin } from '@dnd-kit/core';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, RotateCcw, Check, ArrowRight, Wand2, Plus, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { DraggableCharacter } from './DraggableCharacter';
import { DroppableBin } from './DroppableBin';

interface Props {
  store: ReturnType<typeof useGameStore>;
  onFinish: (myCriteria: string) => void;
  onHome: () => void;
}

export const GameScreen: React.FC<Props> = ({ store, onFinish, onHome }) => {
  const { characters, bins, unclassifiedIds, hiddenIds, moveCharacter, resetSorting, renameBin, addMoreCards, autoClassify, soundEnabled, setSoundEnabled, mode } = store;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [criteriaInput, setCriteriaInput] = useState('');
  const [showCriteriaInput, setShowCriteriaInput] = useState(false);

  const playTone = (type: 'pop' | 'glass' | 'chime') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      } else if (type === 'glass') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(900, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      }
    } catch(e) {}
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setSelectedCardId(null);
    playTone('pop');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (over) {
      moveCharacter(active.id as string, over.id as string);
      if (over.id !== 'unclassified') {
        playTone('glass');
      } else {
        playTone('pop');
      }
    }
  };

  const handleQuickMove = (charId: string, binId: string | null) => {
    moveCharacter(charId, binId);
    setSelectedCardId(null);
    if (binId !== null) {
      playTone('glass');
    } else {
      playTone('pop');
    }
  };

  const handleBinSelect = (binId: string) => {
    if (selectedCardId) {
      handleQuickMove(selectedCardId, binId);
    }
  };

  const handleCompleteClick = () => {
    playTone('chime');
    onFinish('');
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--color-bg)] overflow-hidden" onClick={() => setSelectedCardId(null)}>
      
      {/* Floating Top Nav */}
      <div className="absolute top-4 md:top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 md:px-8">
        <div className="flex items-center justify-between w-full max-w-7xl">
          <div className="flex items-center gap-2 pointer-events-auto">
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={(e) => { e.stopPropagation(); onHome(); }}
               className="w-10 h-10 glass-panel rounded-full flex items-center justify-center text-[#6E6E73] shadow-sm"
             >
               <Home size={18} />
             </motion.button>
             <h2 className="text-xl md:text-2xl font-bold text-[#1D1D1F] tracking-tight ml-1">분류 탐험대</h2>
          </div>
          <div className="glass-panel rounded-full p-1.5 flex items-center gap-1 shadow-sm pointer-events-auto">
            {mode === 'teacher' && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); playTone('pop'); autoClassify(); }}
                className="w-10 h-10 rounded-full hover:bg-black/5 text-[#5E81F4] flex items-center justify-center transition-colors"
                title="빠른 분류"
              >
                <Wand2 size={20} />
              </motion.button>
            )}

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); playTone('pop'); setSoundEnabled(!soundEnabled); }}
              className="w-10 h-10 rounded-full hover:bg-black/5 text-[#6E6E73] flex items-center justify-center transition-colors"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); playTone('pop'); resetSorting(); }}
              className="w-10 h-10 rounded-full hover:bg-black/5 text-[#6E6E73] flex items-center justify-center transition-colors"
            >
              <RotateCcw size={20} />
            </motion.button>

            {!unclassifiedIds.length && !hiddenIds.length && (
              <motion.button 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); handleCompleteClick(); }}
                className="w-10 h-10 rounded-full bg-[#5E81F4] text-white flex items-center justify-center shadow-md ml-1"
              >
                <Check size={20} />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <DndContext 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
        collisionDetection={pointerWithin}
      >
        <div className="flex-1 flex flex-col mt-20 md:mt-24 w-full justify-between items-center h-[calc(100vh-6rem)] relative z-10 px-4 md:px-8">
          
          {/* Classification Bins */}
          <div className={`flex-1 w-full max-w-7xl grid gap-4 md:gap-6 lg:gap-8 pb-32 md:pb-40 ${bins.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
            {bins.map(bin => (
              <DroppableBin 
                key={bin.id} 
                id={bin.id} 
                name={bin.name} 
                count={bin.characterIds.length}
                criteria={bin.criteria}
                onRename={(newName) => renameBin(bin.id, newName)}
                isSelected={selectedCardId !== null && unclassifiedIds.includes(selectedCardId)}
                onSelect={() => handleBinSelect(bin.id)}
              >
                {characters
                  .filter(c => bin.characterIds.includes(c.id))
                  .map(char => (
                    <div key={char.id} onClick={(e) => e.stopPropagation()}>
                      <DraggableCharacter 
                        character={char}
                        isSelected={selectedCardId === char.id}
                        onSelect={() => setSelectedCardId(char.id === selectedCardId ? null : char.id)}
                        bins={bins}
                        onQuickMove={handleQuickMove}
                        inBin={true}
                      />
                    </div>
                  ))}
              </DroppableBin>
            ))}
          </div>

          {/* Card Tray - Bottom Fixed Panel */}
          <div className="absolute bottom-6 left-4 right-4 md:left-8 md:right-8 flex justify-center pointer-events-none z-20">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
              className="w-full max-w-5xl glass-panel rounded-[2rem] p-4 flex flex-col pointer-events-auto"
            >
              <div className="flex items-center justify-between px-2 mb-3">
                <span className="text-[#6E6E73] font-semibold text-sm flex items-center gap-2">
                  남은 카드 <span className="bg-[#5E81F4] text-white text-xs px-2 py-0.5 rounded-full font-bold">{unclassifiedIds.length}</span>
                </span>
                {hiddenIds.length > 0 && (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); playTone('pop'); addMoreCards(); }}
                    className="flex items-center gap-1.5 text-sm bg-black/5 hover:bg-black/10 text-[#1D1D1F] px-4 py-1.5 rounded-full font-semibold transition-colors"
                  >
                    <Plus size={16} />카드 추가 ({hiddenIds.length})
                  </motion.button>
                )}
              </div>
              
              <div className="flex overflow-x-auto gap-2 scrollbar-hide pb-2 pt-2 px-2 items-center min-h-[100px]">
                {unclassifiedIds.length === 0 && hiddenIds.length === 0 ? (
                  <div className="w-full flex items-center justify-center py-4">
                    <p className="text-[#6E6E73] text-sm md:text-base font-medium">모든 분류를 마쳤습니다. 상단의 완료 아이콘을 눌러주세요.</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {characters
                      .filter(c => unclassifiedIds.includes(c.id))
                      .map(char => (
                        <div key={char.id} onClick={(e) => e.stopPropagation()}>
                          <DraggableCharacter 
                            character={char} 
                            isSelected={selectedCardId === char.id}
                            onSelect={() => {
                              playTone('pop');
                              setSelectedCardId(char.id === selectedCardId ? null : char.id);
                            }}
                            bins={bins}
                            onQuickMove={handleQuickMove}
                            inBin={false}
                          />
                        </div>
                      ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </DndContext>

    </div>
  );
};
