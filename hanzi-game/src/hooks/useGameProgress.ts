import { useState, useEffect, useCallback } from 'react';
import { UserProgress, Difficulty, GameLevel } from '../types';
import useLocalStorage from './useLocalStorage';
import wordsData from '../data/wordsData';
import gameLevels from '../data/gameLevels';

// 创建用户进度的默认值
const createInitialProgress = (): UserProgress => {
  // 创建每个级别的初始进度
  const initialLevelProgress: Record<string, { score: number; completed: boolean; wordsLearned: number }> = {};
  
  // 为每个级别创建初始进度数据
  gameLevels.forEach(level => {
    initialLevelProgress[level.id] = {
      score: 0,
      completed: false,
      wordsLearned: 0
    };
  });

  // 生成唯一用户ID
  const userId = `user_${Date.now()}`;

  return {
    userId,
    currentLevel: gameLevels[0].id, // 默认为第一级
    totalScore: 0,
    completedWords: [],
    achievements: [],
    lastPlayedAt: new Date().toISOString(),
    streakDays: 0,
    levelProgress: initialLevelProgress
  };
};

/**
 * 自定义Hook，用于管理游戏进度
 * @returns 游戏进度相关状态和方法
 */
export function useGameProgress() {
  // 从localStorage读取进度数据，如果不存在则创建初始值
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('hanzi-game-progress', createInitialProgress());
  
  // 计算总体完成度
  const [overallCompletion, setOverallCompletion] = useState(0);
  
  // 计算各难度级别的完成情况
  const [difficultyCompletion, setDifficultyCompletion] = useState<Record<Difficulty, number>>({
    [Difficulty.EASY]: 0,
    [Difficulty.MEDIUM]: 0,
    [Difficulty.HARD]: 0
  });

  // 更新用户分数
  const updateScore = useCallback((levelId: string, additionalScore: number) => {
    setUserProgress(prev => {
      const levelProgress = { ...prev.levelProgress };
      
      // 更新特定级别的分数
      if (levelProgress[levelId]) {
        levelProgress[levelId] = {
          ...levelProgress[levelId],
          score: levelProgress[levelId].score + additionalScore
        };
      }
      
      // 计算新的总分数
      const newTotalScore = Object.values(levelProgress).reduce(
        (total, level) => total + level.score,
        0
      );
      
      return {
        ...prev,
        totalScore: newTotalScore,
        levelProgress,
        lastPlayedAt: new Date().toISOString()
      };
    });
  }, [setUserProgress]);

  // 记录已学习的汉字/词语
  const markWordAsLearned = useCallback((wordId: string, levelId: string) => {
    setUserProgress(prev => {
      // 如果已经学习过这个词，则不重复添加
      if (prev.completedWords.includes(wordId)) {
        return prev;
      }
      
      const levelProgress = { ...prev.levelProgress };
      
      // 更新特定级别的已学习单词数量
      if (levelProgress[levelId]) {
        levelProgress[levelId] = {
          ...levelProgress[levelId],
          wordsLearned: levelProgress[levelId].wordsLearned + 1
        };
      }
      
      return {
        ...prev,
        completedWords: [...prev.completedWords, wordId],
        levelProgress,
        lastPlayedAt: new Date().toISOString()
      };
    });
  }, [setUserProgress]);

  // 检查并解锁新级别
  const checkAndUnlockLevels = useCallback(() => {
    setUserProgress(prev => {
      const levelProgress = { ...prev.levelProgress };
      let highestUnlockedLevel = prev.currentLevel;
      
      // 检查每个级别是否可以解锁
      gameLevels.forEach(level => {
        // 如果级别已经完成，则跳过
        if (levelProgress[level.id]?.completed) {
          return;
        }
        
        // 检查是否满足解锁条件
        if (level.minScore !== undefined && prev.totalScore >= level.minScore) {
          // 记录最高解锁级别的ID
          const currentLevelIndex = gameLevels.findIndex(l => l.id === highestUnlockedLevel);
          const thisLevelIndex = gameLevels.findIndex(l => l.id === level.id);
          
          if (thisLevelIndex > currentLevelIndex) {
            highestUnlockedLevel = level.id;
          }
        }
      });
      
      // 只有当有新级别解锁时才更新
      if (highestUnlockedLevel !== prev.currentLevel) {
        return {
          ...prev,
          currentLevel: highestUnlockedLevel
        };
      }
      
      return prev;
    });
  }, [setUserProgress]);

  // 完成指定级别
  const completeLevel = useCallback((levelId: string) => {
    setUserProgress(prev => {
      const levelProgress = { ...prev.levelProgress };
      
      if (levelProgress[levelId]) {
        levelProgress[levelId] = {
          ...levelProgress[levelId],
          completed: true
        };
      }
      
      return {
        ...prev,
        levelProgress
      };
    });
    
    // 解锁检查
    checkAndUnlockLevels();
  }, [setUserProgress, checkAndUnlockLevels]);

  // 更新学习连续天数
  useEffect(() => {
    const checkStreak = () => {
      setUserProgress(prev => {
        const today = new Date();
        const lastPlayed = new Date(prev.lastPlayedAt);
        
        // 计算日期差值，不考虑时间部分
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const lastPlayedDate = new Date(lastPlayed.getFullYear(), lastPlayed.getMonth(), lastPlayed.getDate());
        
        const diffTime = todayDate.getTime() - lastPlayedDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // 如果是连续一天，增加连续天数
        if (diffDays === 1) {
          return {
            ...prev,
            streakDays: prev.streakDays + 1,
            lastPlayedAt: today.toISOString()
          };
        }
        // 如果是当天再次学习，不增加连续天数
        else if (diffDays === 0) {
          return prev;
        }
        // 如果间隔超过一天，重置连续天数
        else {
          return {
            ...prev,
            streakDays: 1,
            lastPlayedAt: today.toISOString()
          };
        }
      });
    };
    
    // 每次组件加载时检查连续天数
    checkStreak();
  }, [setUserProgress]);

  // 计算总体完成度和各难度级别的完成情况
  useEffect(() => {
    // 计算总体完成度
    const completedWordCount = userProgress.completedWords.length;
    const totalWordCount = wordsData.length;
    const newOverallCompletion = totalWordCount > 0 ? (completedWordCount / totalWordCount) * 100 : 0;
    
    setOverallCompletion(Math.round(newOverallCompletion));
    
    // 计算各难度级别的完成情况
    const difficultyWords = {
      [Difficulty.EASY]: wordsData.filter(word => word.difficulty === Difficulty.EASY),
      [Difficulty.MEDIUM]: wordsData.filter(word => word.difficulty === Difficulty.MEDIUM),
      [Difficulty.HARD]: wordsData.filter(word => word.difficulty === Difficulty.HARD)
    };
    
    const newDifficultyCompletion = {
      [Difficulty.EASY]: 0,
      [Difficulty.MEDIUM]: 0,
      [Difficulty.HARD]: 0
    };
    
    // 计算每个难度级别的完成百分比
    Object.entries(difficultyWords).forEach(([difficulty, words]) => {
      const completedInDifficulty = words.filter(word => 
        userProgress.completedWords.includes(word.id)
      ).length;
      
      const diffCompletion = words.length > 0 
        ? (completedInDifficulty / words.length) * 100 
        : 0;
      
      newDifficultyCompletion[difficulty as Difficulty] = Math.round(diffCompletion);
    });
    
    setDifficultyCompletion(newDifficultyCompletion);
  }, [userProgress.completedWords]);

  // 获取指定级别的解锁状态
  const getLevelUnlockStatus = useCallback((levelId: string): boolean => {
    const level = gameLevels.find(l => l.id === levelId);
    if (!level || level.minScore === undefined) return true;
    return userProgress.totalScore >= level.minScore;
  }, [userProgress.totalScore]);

  // 获取指定级别的完成度
  const getLevelCompletion = useCallback((levelId: string): number => {
    const level = gameLevels.find(l => l.id === levelId);
    if (!level) return 0;
    
    const levelWordsCount = wordsData.filter(word => word.difficulty === level.difficulty).length;
    if (levelWordsCount === 0) return 0;
    
    const levelProgress = userProgress.levelProgress[levelId];
    if (!levelProgress) return 0;
    
    return Math.round((levelProgress.wordsLearned / levelWordsCount) * 100);
  }, [userProgress.levelProgress]);

  // 检查用户进度是否需要升级（用于成就系统等）
  const checkProgressUpdate = useCallback(() => {
    checkAndUnlockLevels();
    // 这里可以添加成就检查逻辑
  }, [checkAndUnlockLevels]);

  return {
    userProgress,
    overallCompletion,
    difficultyCompletion,
    updateScore,
    markWordAsLearned,
    completeLevel,
    checkAndUnlockLevels,
    getLevelUnlockStatus,
    getLevelCompletion,
    checkProgressUpdate
  };
}

export default useGameProgress;