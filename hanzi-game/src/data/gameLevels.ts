import { GameLevel, Difficulty } from '../types';

const gameLevels: GameLevel[] = [
  {
    id: 'level1',
    name: '初级 - 基础汉字',
    description: '学习基本的汉字，适合汉字学习的初学者，包含单字和简单词语。',
    wordCount: 10,
    minScore: 0,
    difficulty: Difficulty.EASY
  },
  {
    id: 'level2',
    name: '中级 - 常用词语',
    description: '学习日常生活中常用的双字词语，提高汉字应用能力。',
    wordCount: 10,
    minScore: 100,
    difficulty: Difficulty.MEDIUM
  },
  {
    id: 'level3',
    name: '高级 - 成语词汇',
    description: '学习常见成语和复杂词汇，挑战你的汉字掌握程度。',
    wordCount: 10,
    minScore: 250,
    difficulty: Difficulty.HARD
  },
  {
    id: 'level4',
    name: '挑战级 - 综合练习',
    description: '混合各种难度的汉字和词语，全面提升你的汉字能力。',
    wordCount: 20,
    minScore: 400,
    difficulty: Difficulty.HARD
  },
  {
    id: 'level5',
    name: '大师级 - 速度挑战',
    description: '在限定时间内完成更多汉字和词语的识别，考验反应速度和记忆力。',
    wordCount: 30,
    minScore: 600,
    difficulty: Difficulty.HARD
  }
];

export default gameLevels;