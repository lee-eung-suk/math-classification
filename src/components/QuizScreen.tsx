import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, Trophy, Home, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/useGameStore';
import { generateQuizOptions, QuizOption } from '../lib/quizLogic';
import Character from './Character';

interface Props {
  store: ReturnType<typeof useGameStore>;
  onComplete: (criteriaLabel: string) => void;
  onBack: () => void;
  onHome: () => void;
}

export const QuizScreen: React.FC<Props> = ({ store, onComplete, onBack, onHome }) => {
  const { bins, characters, difficulty } = store;
  
  const options = useMemo(() => 
    generateQuizOptions(characters, bins, difficulty), 
    [characters, bins, difficulty]
  );
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [errorReason, setErrorReason] = useState<string | null>(null);

  const handleSelect = (option: QuizOption) => {
    if (selectedId && isCorrect) return; // Already solved
    
    setSelectedId(option.id);
    const correct = option.isValid;
    setIsCorrect(correct);
    
    if (correct) {
      setErrorReason(null);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5E81F4', '#FCA5A5', '#A7F3D0', '#FDE047']
      });
      playTone('chime');
      setTimeout(() => setShowExplanation(true), 600);
    } else {
      setErrorReason(option.reason || '다시 한번 살펴볼까요?');
      playTone('pop');
    }
  };

  const playTone = (type: 'pop' | 'chime') => {
    if (!store.soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      if (type === 'pop') {
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      } else {
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(900, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      }
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch(e) {}
  };

  const handleFinish = () => {
    const selectedOption = options.find(o => o.id === selectedId);
    onComplete(selectedOption?.label || '나만의 분류 기준');
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--color-bg)] overflow-hidden">
      {/* Header */}
      <div className="absolute top-6 left-0 right-0 z-50 flex justify-center px-8">
        <div className="flex items-center justify-between w-full max-w-7xl">
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="w-10 h-10 glass-panel rounded-full flex items-center justify-center text-[#6E6E73] shadow-sm border border-white/50"
            >
              <ArrowLeft size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHome}
              className="w-10 h-10 glass-panel rounded-full flex items-center justify-center text-[#6E6E73] shadow-sm border border-white/50"
            >
              <Home size={18} />
            </motion.button>
          </div>

          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 shadow-sm border border-white/50"
          >
            <HelpCircle className="text-[#5E81F4]" />
            <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight">수학적 분류 기준 찾기</h2>
          </motion.div>

          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row pt-24 pb-8 px-4 md:px-8 gap-6 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Left Side: Summary of Classification */}
        <div className="md:w-1/3 flex flex-col glass-panel rounded-[2.5rem] p-6 overflow-hidden border border-white/50">
          <h3 className="text-lg font-bold text-[#6E6E73] mb-4 text-center">나의 분류 결과</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
            {bins.map((bin, idx) => (
              <div key={bin.id} className="bg-white/50 rounded-2xl p-4 border border-white">
                <p className="text-xs font-bold text-[#aeaeb2] mb-2 uppercase tracking-widest">{bin.name}</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {characters
                    .filter(c => bin.characterIds.includes(c.id))
                    .map(char => (
                      <div key={char.id} className="p-1.5 glass-card rounded-xl">
                        <Character attributes={char} size={36} />
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Quiz Options */}
        <div className="md:w-2/3 flex flex-col justify-center gap-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-3xl font-bold text-[#1D1D1F] tracking-tight">어떤 규칙으로 분류했나요?</h1>
            <p className="text-[#6E6E73] font-medium">눈에 보이는 특징을 가장 잘 설명하는 기준을 골라보세요.</p>
          </div>

          <div className="grid gap-4 max-w-lg mx-auto w-full">
            <AnimatePresence mode="wait">
              {!showExplanation ? (
                <motion.div 
                  key="options"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid gap-3"
                >
                  {options.map((option) => (
                    <QuizOptionCard 
                      key={option.id}
                      option={option}
                      isSelected={selectedId === option.id}
                      isCorrect={selectedId === option.id ? isCorrect : null}
                      onClick={() => handleSelect(option)}
                    />
                  ))}
                  
                  <AnimatePresence>
                    {errorReason && !isCorrect && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-[#FCA5A5]/10 border border-[#FCA5A5]/20 p-4 rounded-2xl text-center"
                      >
                        <p className="text-[#FCA5A5] font-bold">{errorReason}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div 
                  key="explanation"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel p-8 rounded-[2.5rem] border-2 border-[#A7F3D0]/20 shadow-xl"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-[#A7F3D0]/10 rounded-2xl flex items-center justify-center">
                      <Trophy className="text-[#5E81F4] w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#1D1D1F]">정확한 분류 기준입니다!</h3>
                      <p className="text-[#6E6E73] font-medium">공통된 성질을 아주 잘 찾아냈어요.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 bg-white/50 p-6 rounded-2xl border border-white mb-8">
                     {bins.map((bin, idx) => {
                       const char = characters.find(c => bin.characterIds.includes(c.id));
                       if (!char) return null;
                       const opt = options.find(o => o.id === selectedId);
                       const val = opt?.criterion.check(char);
                       const explanation = opt?.criterion.explanation(val as any);
                       
                       return (
                         <div key={bin.id} className="flex items-center gap-3">
                           <span className="w-8 h-8 bg-[#5E81F4] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                             {idx + 1}
                           </span>
                           <p className="text-lg font-bold text-[#1D1D1F]">{bin.name}: <span className="text-[#5E81F4]">{explanation}</span></p>
                         </div>
                       );
                     })}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFinish}
                    className="w-full py-5 bg-[#5E81F4] text-white rounded-[1.5rem] font-bold text-xl shadow-lg shadow-[#5E81F4]/20 flex items-center justify-center gap-2"
                  >
                    결과 확인하기
                    <ArrowRight size={22} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuizOptionCardProps {
  option: QuizOption;
  isSelected: boolean;
  isCorrect: boolean | null;
  onClick: () => void;
}

const QuizOptionCard: React.FC<QuizOptionCardProps> = ({ 
  option, 
  isSelected, 
  isCorrect, 
  onClick 
}) => {
  return (
    <motion.button
      whileHover={isSelected && isCorrect ? {} : { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.95)' }}
      whileTap={isSelected && isCorrect ? {} : { scale: 0.98 }}
      animate={isSelected && isCorrect === false ? { x: [-4, 4, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      className={`relative w-full p-6 lg:p-8 rounded-[1.8rem] text-left border-2 transition-all shadow-sm flex items-center justify-between
        ${!isSelected ? 'bg-white/70 border-white hover:shadow-md' : ''}
        ${isSelected && isCorrect === true ? 'bg-white border-[#A7F3D0] shadow-[#A7F3D0]/20' : ''}
        ${isSelected && isCorrect === false ? 'bg-white border-[#FCA5A5]' : ''}
      `}
    >
      <span className={`text-xl md:text-2xl font-bold tracking-tight
        ${isSelected && isCorrect === true ? 'text-[#1D1D1F]' : 'text-[#1D1D1F]'}
        ${isSelected && isCorrect === false ? 'text-[#FCA5A5]' : ''}
      `}>
        {option.label}
      </span>
      
      {isSelected && isCorrect === true && (
        <CheckCircle2 className="text-[#A7F3D0] w-8 h-8" />
      )}
      {isSelected && isCorrect === false && (
        <XCircle className="text-[#FCA5A5] w-8 h-8" />
      )}
    </motion.button>
  );
};
