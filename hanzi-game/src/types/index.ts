// 定义难度枚举类型
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// 定义汉字/词语数据类型
export interface WordItem {
  id: string;
  word: string;
  pinyin: string;
  meaning: string;
  difficulty: Difficulty;
  hint?: string;
  category?: string;
}

// 定义游戏难度级别类型
export interface GameLevel {
  id: string;
  name: string;
  description: string;
  wordCount: number;
  minScore?: number;
  difficulty: Difficulty;
}

// 定义用户进度类型
export interface UserProgress {
  userId: string;
  currentLevel: string;
  totalScore: number;
  completedWords: string[]; // 存储已完成词语的ID
  achievements: string[]; // 存储获得的成就ID
  lastPlayedAt: string; // ISO格式日期字符串
  streakDays: number; // 连续学习天数
  levelProgress: {
    [levelId: string]: {
      score: number;
      completed: boolean;
      wordsLearned: number;
    }
  };
}

// 定义游戏状态类型
export enum GameStatus {
  READY = 'ready',
  PLAYING = 'playing',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}

export interface GameState {
  status: GameStatus;
  currentWordId: string | null;
  score: number;
  currentLevel: string;
  remainingHints: number;
  correctAnswers: number;
  wrongAnswers: number;
  startTime: string | null; // ISO格式日期字符串
  endTime: string | null; // ISO格式日期字符串
  gameMode: 'practice' | 'challenge';
}

// 定义游戏模式类型
export enum GameMode {
  PRACTICE = 'practice', // 练习模式
  CHALLENGE = 'challenge' // 挑战模式
}

// 定义成就类型
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string; // 描述获得成就的条件
  unlocked: boolean;
}