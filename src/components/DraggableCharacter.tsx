import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'motion/react';
import Character from './Character';
import { CharacterAttributes, Bin } from '../types';

interface Props {
  character: CharacterAttributes;
  isSelected?: boolean;
  onSelect?: () => void;
  bins?: Bin[];
  onQuickMove?: (charId: string, binId: string | null) => void;
  inBin?: boolean;
}

export const DraggableCharacter: React.FC<Props> = ({ 
  character, 
  isSelected, 
  onSelect, 
  bins = [], 
  onQuickMove,
  inBin = false
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: character.id,
    data: { character },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handlePointerDownAction = (e: React.PointerEvent) => {
    e.stopPropagation(); // Prevent drag start
  };

  return (
    <div className="relative inline-block m-1.5 touch-none" style={{ zIndex: isDragging ? 999 : (isSelected ? 50 : 1) }}>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
      >
        <motion.div
           onClick={(e) => {
            if (onSelect) onSelect();
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          whileHover={!isDragging ? { y: -2, scale: 1.02 } : undefined}
          whileTap={!isDragging ? { scale: 0.95 } : undefined}
          className={`glass-card p-3 rounded-[1.5rem] cursor-grab select-none flex items-center justify-center transition-shadow
            ${isDragging ? 'shadow-2xl opacity-95 cursor-grabbing ring-2 ring-[#5E81F4] scale-105' : ''}
            ${isSelected && !isDragging ? 'ring-2 ring-[#5E81F4] bg-[#F5F8FF]' : 'hover:shadow-lg'}`}
        >
          <Character attributes={character} size={76} />
        </motion.div>
      </div>

      {isSelected && onQuickMove && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute ${inBin ? '-bottom-16' : '-top-16'} left-1/2 -translate-x-1/2 flex gap-1.5 glass-panel p-1.5 rounded-full shadow-lg border border-white/50 z-[1000]`}
          onPointerDown={handlePointerDownAction}
        >
          {inBin && (
            <button
              onClick={(e) => { e.stopPropagation(); onQuickMove(character.id, null); }}
              className="px-5 h-12 rounded-full bg-black/5 text-[#1D1D1F] font-semibold text-sm flex items-center justify-center hover:bg-black/10 transition-colors whitespace-nowrap"
            >
              꺼내기
            </button>
          )}
          {!inBin && bins.map((bin, idx) => (
            <button
              key={bin.id}
              onClick={(e) => { e.stopPropagation(); onQuickMove(character.id, bin.id); }}
              className="px-5 h-12 rounded-full bg-[#5E81F4] text-white font-semibold text-sm flex items-center justify-center hover:bg-[#4B69DB] transition-colors shadow-sm whitespace-nowrap"
            >
              {idx + 1}번 칸
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};
