import React, { useState } from 'react';
import { GameMode, BinCount, Difficulty, CharacterAttributes } from '../types';
import { Sparkles, Users, BookOpen, Search, Settings, Maximize, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Character from './Character';

interface Props {
  onStart: (count: number, bins: BinCount, mode: GameMode) => void;
}

export const StartScreen: React.FC<Props> = ({ onStart }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [cardCount, setCardCount] = useState(8);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [selectedGuide, setSelectedGuide] = useState<{label: string, desc: string, chars?: CharacterAttributes[], colors?: string[]} | null>(null);

  const guideItems = [
    { 
      label: "캐릭터 종류", 
      desc: "로봇인지 사람인지 확인해요. 로봇은 몸이 금속으로 되어 있고 머리에 안테나가 있답니다.",
      chars: [
        { id: 'g1', type: 'robot', color: 'red', expression: 'smile', hasGlasses: false, hasHat: false, hasRibbon: false, hasBag: false } as CharacterAttributes,
        { id: 'g2', type: 'human', color: 'red', expression: 'smile', hasGlasses: false, hasHat: false, hasRibbon: false, hasBag: false } as CharacterAttributes
      ]
    },
    { 
      label: "안경 유무", 
      desc: "캐릭터가 안경을 쓰고 있는지 아닌지에 따라 나눌 수 있어요.",
      chars: [
        { id: 'g3', type: 'human', color: 'blue', expression: 'smile', hasGlasses: true, hasHat: false, hasRibbon: false, hasBag: false } as CharacterAttributes
      ]
    },
    { 
      label: "머리 장식", 
      desc: "리본을 달고 있거나 가방을 메고 있는 특징을 찾아보세요.",
      chars: [
        { id: 'g4', type: 'robot', color: 'green', expression: 'smile', hasGlasses: false, hasHat: false, hasRibbon: true, hasBag: false } as CharacterAttributes,
        { id: 'g5', type: 'robot', color: 'green', expression: 'smile', hasGlasses: false, hasHat: false, hasRibbon: false, hasBag: true } as CharacterAttributes
      ]
    },
    { 
      label: "얼굴 색깔", 
      desc: "빨강, 파랑, 초록, 노랑 등 얼굴의 색깔이 같은 것끼리 모아요.",
      colors: ['#FCA5A5', '#AECBFA', '#A7F3D0', '#FDE047']
    },
    { 
      label: "모자의 종류", 
      desc: "쓰고 있는 모자의 모양이 무엇인지 관찰해 보세요.",
      chars: [
        { id: 'g6', type: 'human', color: 'yellow', expression: 'smile', hasGlasses: false, hasHat: true, hasRibbon: false, hasBag: false } as CharacterAttributes
      ]
    },
    { 
      label: "입 모양", 
      desc: "웃고 있거나 속상한 표정 등 입의 모양에 따라 분류할 수 있어요.",
      chars: [
        { id: 'g7', type: 'human', color: 'red', expression: 'smile', hasGlasses: false, hasHat: false, hasRibbon: false, hasBag: false } as CharacterAttributes,
        { id: 'g8', type: 'human', color: 'red', expression: 'sad', hasGlasses: false, hasHat: false, hasRibbon: false, hasBag: false } as CharacterAttributes
      ]
    }
  ];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

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

  const handleModeClick = (mode: GameMode, bins: BinCount) => {
    playPop();
    onStart(cardCount, bins, mode);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] bg-[var(--color-bg)] px-4 relative overflow-hidden">
      
      {/* Floating Top Controls */}
      <div className="absolute top-6 right-6 lg:top-10 lg:right-10 flex gap-3 z-50">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { playPop(); toggleFullscreen(); }}
          className="w-12 h-12 glass-panel rounded-full text-[#6E6E73] hover:text-[#1D1D1F] flex items-center justify-center transition-colors"
        >
          <Maximize size={22} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { playPop(); setShowSettings(true); }}
          className="w-12 h-12 glass-panel rounded-full text-[#6E6E73] hover:text-[#1D1D1F] flex items-center justify-center transition-colors"
        >
          <Settings size={22} />
        </motion.button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="glass-panel p-10 md:p-14 lg:p-16 rounded-[3rem] w-full max-w-4xl text-center"
      >
        <div className="mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-[#5E81F4]/10 rounded-[1.5rem] mb-6"
          >
            <Sparkles className="w-10 h-10 text-[#5E81F4]" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1D1D1F] mb-4 tracking-tight">
            분류 탐험대
          </h1>
          <p className="text-lg md:text-xl text-[#6E6E73] font-medium max-w-md mx-auto">
            친구들과 함께 즐겁게 모양과 특징을 나누어 볼까요?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <MotionCard 
            icon={<BookOpen className="w-8 h-8 text-[#5E81F4]" />}
            title="자유 분류하기"
            desc="내가 정한 기준으로 나누어요"
            onClick={() => handleModeClick('student', 2)}
            delay={0.2}
          />
          <MotionCard 
            icon={<Users className="w-8 h-8 text-[#A7F3D0]" />}
            title="짝꿍과 함께"
            desc="서로의 분류 기준을 맞혀봐요"
            onClick={() => handleModeClick('pair', 2)}
            delay={0.3}
          />
          <MotionCard 
            icon={<Sparkles className="w-8 h-8 text-[#AECBFA]" />}
            title="3칸으로 나누기"
            desc="조금 더 넓은 바구니로 나누어요"
            onClick={() => handleModeClick('teacher', 3)}
            delay={0.4}
          />
          <MotionCard 
            icon={<Search className="w-8 h-8 text-[#FCA5A5]" />}
            title="비밀 기준 맞히기"
            desc="놀이를 통해 숨겨진 기준을 찾아내요"
            onClick={() => handleModeClick('guess', 2)}
            delay={0.5}
          />
        </div>

        {/* Info Section / Guide */}
        <div className="mt-12 pt-12 border-t border-black/5">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-8 bg-[#5E81F4]/10 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-[#5E81F4]" />
            </div>
            <h3 className="text-lg font-bold text-[#1D1D1F]">어떤 특징을 관찰할까요?</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {guideItems.map((item, idx) => (
              <GuideItem 
                key={idx}
                label={item.label} 
                desc={item.desc}
                chars={item.chars}
                colors={item.colors}
                onClick={() => setSelectedGuide(item)}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Guide Detail Modal */}
      <AnimatePresence>
        {selectedGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGuide(null)}
            className="fixed inset-0 z-[100] bg-white/40 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel w-full max-w-sm rounded-[3rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedGuide(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-black/5 rounded-full flex items-center justify-center text-[#6E6E73] hover:bg-black/10 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex justify-center mb-8 gap-4 py-8">
                {selectedGuide.chars && selectedGuide.chars.map((c, i) => (
                  <div key={i} className="scale-[1.8]">
                    <Character attributes={c} size={64} />
                  </div>
                ))}
                {selectedGuide.colors && (
                  <div className="flex gap-4">
                    {selectedGuide.colors.map((col, i) => (
                      <div key={i} className="w-14 h-14 rounded-2xl border-4 border-white shadow-sm" style={{ backgroundColor: col }} />
                    ))}
                  </div>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-3xl font-bold text-[#1D1D1F] mb-4 tracking-tight">{selectedGuide.label}</h3>
                <p className="text-lg text-[#6E6E73] font-medium leading-relaxed">
                  {selectedGuide.desc}
                </p>
              </div>

              <button
                onClick={() => setSelectedGuide(null)}
                className="w-full mt-10 py-5 bg-[#5E81F4] text-white rounded-[2rem] font-bold text-xl shadow-lg shadow-[#5E81F4]/20 hover:bg-[#4d6fd9] transition-colors"
              >
                확인했어요
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/40 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="glass-panel rounded-[2.5rem] p-8 max-w-sm w-full relative"
            >
              <button 
                onClick={() => setShowSettings(false)}
                className="absolute top-6 right-6 p-2 text-[#6E6E73] hover:text-[#1D1D1F] bg-black/5 hover:bg-black/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-8 tracking-tight flex items-center gap-2">
                <Settings className="text-[#5E81F4]" />
                설정
              </h3>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-[#6E6E73] mb-3">전체 카드 개수</label>
                  <div className="flex bg-black/5 p-1.5 rounded-2xl">
                    {[8, 12, 16].map((count) => (
                      <button
                        key={count}
                        onClick={() => { playPop(); setCardCount(count); }}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all text-base ${
                          cardCount === count ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                        }`}
                      >
                        {count}장
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#6E6E73] mb-3">난이도</label>
                  <div className="flex bg-black/5 p-1.5 rounded-2xl">
                    {(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => { playPop(); setDifficulty(d); }}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all text-base ${
                          difficulty === d ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                        }`}
                      >
                        {d === 'easy' ? '쉬움' : d === 'normal' ? '보통' : '어려움'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => { playPop(); setShowSettings(false); }}
                    className="w-full py-4 bg-[#1D1D1F] text-white rounded-2xl font-bold hover:bg-black transition-colors"
                  >
                    완료
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MotionCard = ({ icon, title, desc, onClick, delay }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void, delay: number }) => (
  <motion.button 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 300, damping: 25, delay }}
    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.95)" }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="group flex items-center p-6 bg-white/70 rounded-[2rem] border border-white/50 transition-colors text-left shadow-sm"
  >
    <div className="w-16 h-16 rounded-[1.2rem] bg-black/5 flex items-center justify-center shrink-0 mr-5 group-hover:bg-white transition-colors shadow-sm">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold text-[#1D1D1F] mb-1">{title}</h3>
      <p className="text-sm text-[#6E6E73] font-medium leading-snug">{desc}</p>
    </div>
  </motion.button>
);

interface GuideItemProps {
  label: string; 
  desc: string; 
  chars?: CharacterAttributes[];
  colors?: string[];
  onClick: () => void;
}

const GuideItem: React.FC<GuideItemProps> = ({ 
  label, 
  desc, 
  chars, 
  colors,
  onClick
}) => (
  <motion.button 
    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.9)' }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="bg-white/60 p-4 rounded-2xl border border-white flex flex-col items-center gap-2 shadow-sm text-center"
  >
    <div className="h-14 flex items-center justify-center gap-1 mb-1">
      {chars && chars.map((c, i) => (
        <div key={c.id} className={`${chars.length > 1 ? 'scale-75 -mx-2' : ''}`}>
          <Character attributes={c} size={48} />
        </div>
      ))}
      {colors && (
        <div className="flex gap-1">
          {colors.map((col, i) => (
            <div key={i} className="w-5 h-5 rounded-full border border-black/5" style={{ backgroundColor: col }} />
          ))}
        </div>
      )}
    </div>
    <span className="text-sm font-bold text-[#1D1D1F] tracking-tight">{label}</span>
    <span className="text-[10px] font-medium text-[#B2B2B2] whitespace-nowrap overflow-hidden text-ellipsis w-full">열어보기</span>
  </motion.button>
);
