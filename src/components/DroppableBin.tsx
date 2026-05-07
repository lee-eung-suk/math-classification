import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2 } from 'lucide-react';

interface Props {
  id: string;
  name: string;
  count: number;
  criteria?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onRename?: (newName: string) => void;
  children: React.ReactNode;
}

export const DroppableBin: React.FC<Props> = ({ id, name, count, criteria, isSelected, onSelect, onRename, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);

  const handleSave = () => {
    setIsEditing(false);
    if (onRename && editName.trim()) {
      onRename(editName.trim());
    } else {
      setEditName(name);
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      onClick={onSelect}
      animate={{ 
        scale: isOver ? 1.01 : 1,
        borderColor: (isOver || isSelected) ? 'rgba(94, 129, 244, 0.4)' : 'rgba(255, 255, 255, 0.6)',
        backgroundColor: (isOver || isSelected) ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.72)'
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`glass-panel rounded-[2.5rem] p-5 lg:p-8 flex flex-col flex-1 transition-shadow cursor-pointer relative overflow-hidden h-full group
        ${(isOver || isSelected) ? 'shadow-[0_0_0_2px_rgba(94,129,244,0.15)] ring-2 ring-[#5E81F4]/20' : 'hover:bg-white/80'}`}
    >
      <div className="flex flex-col items-center mb-6 z-10 relative">
        {isEditing ? (
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <input 
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              onBlur={handleSave}
              className="px-4 py-2 bg-black/5 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#5E81F4] border-none outline-none text-center font-bold text-[#1D1D1F] w-48 transition-all"
              autoFocus
              placeholder="분류 기준을 적어주세요"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 group/edit" onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>
            <h3 className="text-xl md:text-2xl font-bold text-[#1D1D1F] group-hover/edit:text-[#5E81F4] transition-colors select-none tracking-tight">
              {name}
            </h3>
            <span className="bg-black/5 text-[#6E6E73] rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm group-hover/edit:bg-[#5E81F4]/10 group-hover/edit:text-[#5E81F4] transition-colors">
              {count}
            </span>
            <div className="opacity-0 group-hover/edit:opacity-100 text-[#6E6E73] hover:text-[#5E81F4] transition-opacity p-1 ml-1 cursor-pointer">
              <Edit2 size={16} />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto w-full -mx-2 px-2 pb-2 scrollbar-hide z-10 relative">
        <div className="flex flex-wrap content-start items-start justify-center gap-2 min-h-full pb-8">
          <AnimatePresence>
            {children}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
