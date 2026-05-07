import { CharacterAttributes, Bin } from '../types';

export interface Criterion {
  id: string;
  label: string;
  type: 'binary' | 'category';
  check: (char: CharacterAttributes) => string | boolean;
  explanation: (value: string | boolean) => string;
}

export const POSSIBLE_CRITERIA: Criterion[] = [
  {
    id: 'glasses',
    label: '안경',
    type: 'binary',
    check: (c) => c.hasGlasses,
    explanation: (v) => v ? '안경을 쓴 캐릭터' : '안경을 안 쓴 캐릭터'
  },
  {
    id: 'hat',
    label: '모자',
    type: 'binary',
    check: (c) => c.hasHat,
    explanation: (v) => v ? '모자를 쓴 캐릭터' : '모자를 안 쓴 캐릭터'
  },
  {
    id: 'ribbon',
    label: '리본',
    type: 'binary',
    check: (c) => c.hasRibbon,
    explanation: (v) => v ? '리본이 있는 캐릭터' : '리본이 없는 캐릭터'
  },
  {
    id: 'bag',
    label: '가방',
    type: 'binary',
    check: (c) => c.hasBag,
    explanation: (v) => v ? '가방을 멘 캐릭터' : '가방을 안 멘 캐릭터'
  },
  {
    id: 'expression_smile',
    label: '웃는 표정',
    type: 'binary',
    check: (c) => c.expression === 'smile',
    explanation: (v) => v ? '웃고 있는 캐릭터' : '웃고 있지 않은 캐릭터'
  },
  {
    id: 'type',
    label: '캐릭터 종류',
    type: 'category',
    check: (c) => c.type,
    explanation: (v) => {
      if (v === 'human') return '사람 캐릭터';
      if (v === 'animal') return '동물 캐릭터';
      return '로봇 캐릭터';
    }
  },
  {
    id: 'type_robot',
    label: '로봇',
    type: 'binary',
    check: (c) => c.type === 'robot',
    explanation: (v) => v ? '로봇 캐릭터' : '로봇이 아닌 캐릭터'
  },
  {
    id: 'type_human',
    label: '사람',
    type: 'binary',
    check: (c) => c.type === 'human',
    explanation: (v) => v ? '사람 캐릭터' : '사람이 아닌 캐릭터'
  },
  {
    id: 'color',
    label: '얼굴 색깔',
    type: 'category',
    check: (c) => c.color,
    explanation: (v) => {
      if (v === 'red') return '빨간색 캐릭터';
      if (v === 'blue') return '파란색 캐릭터';
      if (v === 'green') return '초록색 캐릭터';
      return '노란색 캐릭터';
    }
  },
  // Specific color binary checks to handle "Red vs Not Red"
  {
    id: 'color_red',
    label: '빨간색',
    type: 'binary',
    check: (c) => c.color === 'red',
    explanation: (v) => v ? '빨간색 캐릭터' : '빨간색이 아닌 캐릭터'
  },
  {
    id: 'color_blue',
    label: '파란색',
    type: 'binary',
    check: (c) => c.color === 'blue',
    explanation: (v) => v ? '파란색 캐릭터' : '파란색이 아닌 캐릭터'
  },
  {
    id: 'color_green',
    label: '초록색',
    type: 'binary',
    check: (c) => c.color === 'green',
    explanation: (v) => v ? '초록색 캐릭터' : '초록색이 아닌 캐릭터'
  },
  {
    id: 'color_yellow',
    label: '노란색',
    type: 'binary',
    check: (c) => c.color === 'yellow',
    explanation: (v) => v ? '노란색 캐릭터' : '노란색이 아닌 캐릭터'
  }
];

export interface QuizOption {
  id: string;
  label: string;
  isValid: boolean;
  reason?: string; // Specific feedback for incorrect options
  criterion: Criterion;
}

export function generateQuizOptions(
  characters: CharacterAttributes[],
  bins: Bin[],
  difficulty: 'easy' | 'normal' | 'hard'
): QuizOption[] {
  const options: QuizOption[] = [];
  const placedCharacterIds = bins.flatMap(b => b.characterIds);
  const placedCharacters = characters.filter(c => placedCharacterIds.includes(c.id));

  for (const criterion of POSSIBLE_CRITERIA) {
    let isMatch = true;
    let reason = "";
    const binValues = new Map<string, any>();

    for (const bin of bins) {
      if (bin.characterIds.length === 0) continue;

      const charsInBin = characters.filter(c => bin.characterIds.includes(c.id));
      const values = new Set(charsInBin.map(c => criterion.check(c)));

      if (values.size > 1) {
        // This bin contains mixed values for this criterion
        isMatch = false;
        const valueList = Array.from(values);
        reason = `${bin.name}에 ${criterion.label}에 대해 서로 다른 특징을 가진 캐릭터가 섞여 있어요.`;
        break;
      }
      
      const value = Array.from(values)[0];
      if (Array.from(binValues.values()).includes(value)) {
        // Another bin already has this specific value
        isMatch = false;
        reason = `여러 바구니에 똑같이 ${criterion.explanation(value)}가 들어 있어서 구분되지 않아요.`;
        break;
      }
      binValues.set(bin.id, value);
    }

    // Secondary check: Ensure ALL placed characters are consistently categorized by this rule
    // for binary rules, we typically expect one bin to be "Yes" and another "No" (if 2 bins)
    
    options.push({
      id: criterion.id,
      label: getFriendlyCriteriaLabel(criterion, bins, characters),
      isValid: isMatch,
      reason: isMatch ? undefined : reason,
      criterion: criterion
    });
  }

  // Filter to prioritize options that actually categorized something
  const correctOnes = options.filter(o => o.isValid);
  const incorrectOnes = options.filter(o => !o.isValid);

  const result: QuizOption[] = [];
  
  if (correctOnes.length > 0) {
    // Collect all valid mathematical criteria
    result.push(...correctOnes); 
  } else {
    // If user did something random, we don't say "Special". 
    // We try to find the "best fit" or just show clear distractors to show why it's not mathematical.
    result.push({
      id: 'none',
      label: '일정한 규칙이 없음',
      isValid: false,
      reason: '카드를 나눈 명확한 공통점을 찾기 어려워요. 다시 한 번 살펴볼까요?',
      criterion: POSSIBLE_CRITERIA[0]
    });
  }

  // Fill with distractors based on difficulty
  const maxTotal = difficulty === 'easy' ? 2 : difficulty === 'normal' ? 3 : 4;
  
  // If we already have enough correct ones, we might still want to mix in distractors 
  // to make it a real quiz, unless the user specifically wants all valid ones.
  // But let's at least ensure we don't exceed maxTotal if we have too many correct ones,
  // or we just show all correct ones if they are few.
  
  const neededDistractors = Math.max(0, maxTotal - result.length);
  
  if (neededDistractors > 0) {
    const distractors = shuffle(incorrectOnes).slice(0, neededDistractors);
    result.push(...distractors);
  }

  return shuffle(result).slice(0, Math.max(result.length, maxTotal));
}

function getFriendlyCriteriaLabel(criterion: Criterion, bins: Bin[], characters: CharacterAttributes[]): string {
  if (criterion.type === 'binary') {
    if (criterion.id.startsWith('color_')) {
      return `${criterion.label}인 것과 아닌 것`;
    }
    return `${criterion.label}이(가) 있는 것과 없는 것`;
  }
  return `${criterion.label}의 종류에 따른 분류`;
}

function shuffle<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}
