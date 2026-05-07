import { useState, useCallback } from 'react';
import { CharacterAttributes, CharacterType, ColorType, ExpressionType, GameMode, Difficulty, BinCount, Bin } from '../types';

const types: CharacterType[] = ['human', 'animal', 'robot'];
const colors: ColorType[] = ['red', 'blue', 'green', 'yellow'];
const expressions: ExpressionType[] = ['smile', 'sad', 'surprise', 'wink'];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomBoolean = () => Math.random() > 0.5;

export const generateCharacters = (count: number, difficulty: Difficulty): CharacterAttributes[] => {
  const characters: CharacterAttributes[] = [];
  
  for (let i = 0; i < count; i++) {
    // In easy mode, maybe limit the variation? The requirement says:
    // Easy: 1 attribute difference maybe? But it's easier to just generate full variance and let teacher set criteria.
    // Let's just generate full random for now, difficulty can dictate criteria strictly.
    characters.push({
      id: `char-${i}`,
      type: getRandomElement(types),
      color: getRandomElement(colors),
      expression: getRandomElement(expressions),
      hasHat: getRandomBoolean(),
      hasGlasses: getRandomBoolean(),
      hasRibbon: getRandomBoolean(),
      hasBag: getRandomBoolean(),
    });
  }
  return characters;
};

export const useGameStore = () => {
  const [characters, setCharacters] = useState<CharacterAttributes[]>([]);
  const [bins, setBins] = useState<Bin[]>([]);
  const [unclassifiedIds, setUnclassifiedIds] = useState<string[]>([]);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [mode, setMode] = useState<GameMode>('open');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [binCount, setBinCount] = useState<BinCount>(2);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const initGame = useCallback((newCount: number, newBinCount: BinCount, newMode: GameMode) => {
    const newCharacters = generateCharacters(newCount, 'normal');
    setCharacters(newCharacters);
    
    // Start with max 8 cards, hide the rest
    const initialVisibleCount = Math.min(8, newCount);
    setUnclassifiedIds(newCharacters.slice(0, initialVisibleCount).map(c => c.id));
    setHiddenIds(newCharacters.slice(initialVisibleCount).map(c => c.id));
    
    const newBins: Bin[] = Array.from({ length: newBinCount }).map((_, i) => ({
      id: `bin-${i}`,
      name: `분류 ${i + 1}`,
      characterIds: [],
    }));
    
    setBins(newBins);
    setMode(newMode);
    setBinCount(newBinCount);
    setIsFinished(false);
  }, []);

  const moveCharacter = useCallback((charId: string, toBinId: string | null) => {
    // Remove from everywhere first
    setUnclassifiedIds(prev => prev.filter(id => id !== charId));
    setBins(prevBins => prevBins.map(bin => ({
      ...bin,
      characterIds: bin.characterIds.filter(id => id !== charId)
    })));

    // Add to new destination
    if (toBinId === 'unclassified' || toBinId === null) {
      setUnclassifiedIds(prev => [...prev, charId]);
    } else {
      setBins(prevBins => prevBins.map(bin => 
        bin.id === toBinId ? { ...bin, characterIds: [...bin.characterIds, charId] } : bin
      ));
    }
  }, []);

  const renameBin = useCallback((binId: string, newName: string) => {
    setBins(prevBins => prevBins.map(bin => 
      bin.id === binId ? { ...bin, name: newName } : bin
    ));
  }, []);

  const addMoreCards = useCallback(() => {
    setHiddenIds(prev => {
      const toAdd = prev.slice(0, 4);
      setUnclassifiedIds(u => [...u, ...toAdd]);
      return prev.slice(4);
    });
  }, []);

  const autoClassify = useCallback(() => {
    // A quick sample classification: Has Glasses vs No Glasses
    // In a real app we might pass criteria, but for now we'll do something simple
    const hasGlassesBin = bins[0];
    const noGlassesBin = bins[1];
    if (bins.length < 2) return;

    const allCharIds = characters.map(c => c.id);
    
    // Unhide all logic
    setHiddenIds([]);
    setUnclassifiedIds([]);

    const glassesIds = characters.filter(c => c.hasGlasses).map(c => c.id);
    const noGlassesIds = characters.filter(c => !c.hasGlasses).map(c => c.id);

    setBins(prevBins => prevBins.map((bin, idx) => {
      if (idx === 0) return { ...bin, name: '안경 있음', characterIds: glassesIds };
      if (idx === 1) return { ...bin, name: '안경 없음', characterIds: noGlassesIds };
      return { ...bin, characterIds: [] };
    }));
  }, [characters, bins]);

  const resetSorting = useCallback(() => {
    const totalIds = characters.map(c => c.id);
    const initialVisibleCount = Math.min(8, totalIds.length);
    setUnclassifiedIds(totalIds.slice(0, initialVisibleCount));
    setHiddenIds(totalIds.slice(initialVisibleCount));
    setBins(prevBins => prevBins.map(bin => ({ ...bin, characterIds: [] })));
    setIsFinished(false);
  }, [characters]);

  return {
    characters,
    bins,
    unclassifiedIds,
    hiddenIds,
    mode,
    difficulty,
    binCount,
    soundEnabled,
    isFinished,
    setSoundEnabled,
    setIsFinished,
    initGame,
    moveCharacter,
    renameBin,
    addMoreCards,
    autoClassify,
    resetSorting,
  };
};
