export type CharacterType = 'human' | 'animal' | 'robot';
export type ColorType = 'red' | 'blue' | 'green' | 'yellow';
export type ExpressionType = 'smile' | 'sad' | 'surprise' | 'wink';
export type Difficulty = 'easy' | 'normal' | 'hard';
export type GameMode = 'teacher' | 'student' | 'pair' | 'guess' | 'open';
export type BinCount = 2 | 3;

export interface CharacterAttributes {
  id: string;
  type: CharacterType;
  color: ColorType;
  expression: ExpressionType;
  hasHat: boolean;
  hasGlasses: boolean;
  hasRibbon: boolean;
  hasBag: boolean;
}

export interface Bin {
  id: string;
  name: string;
  criteria?: string;
  characterIds: string[];
}

export interface GameState {
  characters: CharacterAttributes[];
  bins: Bin[];
  unclassifiedIds: string[];
  hiddenIds: string[];
  mode: GameMode;
  difficulty: Difficulty;
  binCount: BinCount;
  soundEnabled: boolean;
}
