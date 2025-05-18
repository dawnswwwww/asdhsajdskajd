import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { WordItem, GameLevel, GameStatus, GameState, GameMode, Difficulty } from '../types';
import wordsData from '../data/wordsData';
import gameLevels from '../data/gameLevels';

// 定义游戏上下文类型
interface GameContextType {
  // 状态
  state: GameState;
  currentWord: WordItem | null;
  availableLevels: GameLevel[];
  isAnswerCorrect: boolean | null;
  
  // 方法
  startGame: (levelId: string, mode: GameMode) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  checkAnswer: (answer: string) => boolean;
  useHint: () => string | undefined;
  selectLevel: (levelId: string) => void;
  nextWord: () => void;
  resetGame: () => void;
}

// 创建游戏上下文
const GameContext = createContext<GameContextType | undefined>(undefined);

// 定义状态操作类型
type GameAction = 
  | { type: 'START_GAME', payload: { levelId: string, mode: GameMode } }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'END_GAME' }
  | { type: 'SET_LEVEL', payload: { levelId: string } }
  | { type: 'SELECT_WORD', payload: { wordId: string } }
  | { type: 'CORRECT_ANSWER', payload: { points: number } }
  | { type: 'WRONG_ANSWER' }
  | { type: 'USE_HINT' }
  | { type: 'NEXT_WORD' }
  | { type: 'RESET_GAME' };

// 初始游戏状态
const initialGameState: GameState = {
  status: GameStatus.READY,
  currentWordId: null,
  score: 0,
  currentLevel: 'level1', // 默认为第一级
  remainingHints: 3,
  correctAnswers: 0,
  wrongAnswers: 0,
  startTime: null,
  endTime: null,
  gameMode: GameMode.PRACTICE
};

// 状态reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        status: GameStatus.PLAYING,
        currentLevel: action.payload.levelId,
        gameMode: action.payload.mode,
        startTime: new Date().toISOString(),
        endTime: null,
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        remainingHints: 3
      };
    
    case 'PAUSE_GAME':
      return {
        ...state,
        status: GameStatus.PAUSED
      };
    
    case 'RESUME_GAME':
      return {
        ...state,
        status: GameStatus.PLAYING
      };
    
    case 'END_GAME':
      return {
        ...state,
        status: GameStatus.COMPLETED,
        endTime: new Date().toISOString()
      };
    
    case 'SET_LEVEL':
      return {
        ...state,
        currentLevel: action.payload.levelId
      };
    
    case 'SELECT_WORD':
      return {
        ...state,
        currentWordId: action.payload.wordId
      };
    
    case 'CORRECT_ANSWER':
      return {
        ...state,
        score: state.score + action.payload.points,
        correctAnswers: state.correctAnswers + 1
      };
    
    case 'WRONG_ANSWER':
      return {
        ...state,
        wrongAnswers: state.wrongAnswers + 1
      };
    
    case 'USE_HINT':
      return {
        ...state,
        remainingHints: state.remainingHints > 0 ? state.remainingHints - 1 : 0
      };
    
    case 'NEXT_WORD':
      return {
        ...state,
        currentWordId: null
      };
    
    case 'RESET_GAME':
      return {
        ...initialGameState
      };
    
    default:
      return state;
  }
};

// 游戏上下文提供者组件
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  
  // 根据当前级别过滤词语数据
  const getWordsForCurrentLevel = (): WordItem[] => {
    const currentLevel = gameLevels.find(level => level.id === state.currentLevel);
    if (!currentLevel) return wordsData;
    
    return wordsData.filter(word => word.difficulty === currentLevel.difficulty);
  };
  
  // 获取可用的级别
  const availableLevels = gameLevels;
  
  // 当当前词ID更改时，更新当前词
  useEffect(() => {
    if (state.currentWordId) {
      const word = wordsData.find(w => w.id === state.currentWordId);
      setCurrentWord(word || null);
    } else if (state.status === GameStatus.PLAYING && !state.currentWordId) {
      // 当游戏状态为进行中但没有当前单词时，随机选择一个
      selectRandomWord();
    } else {
      setCurrentWord(null);
    }
  }, [state.currentWordId, state.status]);
  
  // 随机选择一个词
  const selectRandomWord = () => {
    const levelWords = getWordsForCurrentLevel();
    if (levelWords.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * levelWords.length);
    dispatch({ type: 'SELECT_WORD', payload: { wordId: levelWords[randomIndex].id } });
  };
  
  // 开始游戏
  const startGame = (levelId: string, mode: GameMode) => {
    dispatch({ type: 'START_GAME', payload: { levelId, mode } });
    // 开始游戏时自动选择一个词
    selectRandomWord();
  };
  
  // 暂停游戏
  const pauseGame = () => {
    dispatch({ type: 'PAUSE_GAME' });
  };
  
  // 继续游戏
  const resumeGame = () => {
    dispatch({ type: 'RESUME_GAME' });
  };
  
  // 结束游戏
  const endGame = () => {
    dispatch({ type: 'END_GAME' });
  };
  
  // 验证答案
  const checkAnswer = (answer: string): boolean => {
    if (!currentWord) return false;
    
    const isCorrect = answer.trim().toLowerCase() === currentWord.word;
    setIsAnswerCorrect(isCorrect);
    
    if (isCorrect) {
      // 计算得分，根据难度级别调整
      let points = 0;
      switch (currentWord.difficulty) {
        case Difficulty.EASY:
          points = 10;
          break;
        case Difficulty.MEDIUM:
          points = 20;
          break;
        case Difficulty.HARD:
          points = 30;
          break;
      }
      
      // 挑战模式得分加成
      if (state.gameMode === GameMode.CHALLENGE) {
        points *= 1.5;
      }
      
      dispatch({ type: 'CORRECT_ANSWER', payload: { points } });
    } else {
      dispatch({ type: 'WRONG_ANSWER' });
    }
    
    return isCorrect;
  };
  
  // 使用提示
  const useHint = (): string | undefined => {
    if (state.remainingHints > 0 && currentWord) {
      dispatch({ type: 'USE_HINT' });
      return currentWord.hint;
    }
    return undefined;
  };
  
  // 选择级别
  const selectLevel = (levelId: string) => {
    dispatch({ type: 'SET_LEVEL', payload: { levelId } });
  };
  
  // 进入下一个单词
  const nextWord = () => {
    setIsAnswerCorrect(null);
    dispatch({ type: 'NEXT_WORD' });
    selectRandomWord();
  };
  
  // 重置游戏
  const resetGame = () => {
    setIsAnswerCorrect(null);
    dispatch({ type: 'RESET_GAME' });
  };
  
  // 上下文值
  const contextValue: GameContextType = {
    state,
    currentWord,
    availableLevels,
    isAnswerCorrect,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    checkAnswer,
    useHint,
    selectLevel,
    nextWord,
    resetGame
  };
  
  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// 自定义钩子，用于访问GameContext
export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext必须在GameProvider内部使用');
  }
  return context;
};