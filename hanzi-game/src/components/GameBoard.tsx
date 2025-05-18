import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useGameContext } from '../contexts/GameContext';
import useGameProgress from '../hooks/useGameProgress';
import useSounds from '../hooks/useSounds';
import GameCard from './GameCard';
import AnswerInput from './AnswerInput';
import ScoreBoard from './ScoreBoard';
import { GameStatus, GameMode, GameLevel, Difficulty } from '../types';

// 动画定义
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// 样式化组件
const GameBoardContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const GameHeader = styled.div`
  width: 100%;
  margin-bottom: 20px;
  text-align: center;
`;

const GameTitle = styled.h1`
  font-size: 2.5rem;
  color: #4a5568;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const GameSection = styled.div`
  width: 100%;
  animation: ${fadeIn} 0.5s ease-in;
`;

const GameControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const GameButton = styled.button<{ primary?: boolean; status?: GameStatus }>`
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  background-color: ${props => props.primary ? '#68b5e8' : '#f5f7fa'};
  color: ${props => props.primary ? 'white' : '#4a5568'};
  
  ${props => props.status === GameStatus.PLAYING && props.primary && css`
    animation: ${pulse} 2s infinite;
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: #e2e8f0;
    color: #a0aec0;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
`;

const LevelSelector = styled.div`
  margin: 20px 0;
  width: 100%;
  max-width: 500px;
  animation: ${slideIn} 0.5s ease;
`;

const LevelSelectorTitle = styled.h3`
  font-size: 1.2rem;
  color: #4a5568;
  margin-bottom: 10px;
  text-align: center;
`;

const LevelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
`;

const LevelCard = styled.div<{ selected?: boolean; unlocked?: boolean }>`
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  cursor: ${props => props.unlocked ? 'pointer' : 'not-allowed'};
  transition: all 0.2s ease;
  
  background-color: ${props => props.selected 
    ? '#68b5e8' 
    : props.unlocked 
      ? '#f5f7fa'
      : '#e2e8f0'};
  
  color: ${props => props.selected ? 'white' : '#4a5568'};
  opacity: ${props => props.unlocked ? 1 : 0.7};
  
  &:hover {
    transform: ${props => props.unlocked ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.unlocked ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'};
  }
`;

const LevelName = styled.h4`
  font-size: 0.9rem;
  margin: 0 0 5px;
`;

const LevelInfo = styled.span`
  font-size: 0.8rem;
  display: block;
`;

const ModeToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  width: 100%;
  max-width: 300px;
`;

const ModeLabel = styled.span<{ active?: boolean }>`
  padding: 5px 10px;
  font-size: 0.9rem;
  color: ${props => props.active ? '#4a5568' : '#a0aec0'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;

const ModeToggle = styled.div<{ challenge?: boolean }>`
  width: 60px;
  height: 30px;
  background-color: #e2e8f0;
  border-radius: 15px;
  margin: 0 10px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${props => props.challenge ? '33px' : '3px'};
    width: 24px;
    height: 24px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  background-color: ${props => props.challenge ? '#ffd166' : '#68b5e8'};
`;

const GameProgress = styled.div<{ visible: boolean }>`
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
  width: 100%;
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
`;

const GameMessage = styled.div`
  margin: 20px 0;
  padding: 15px;
  border-radius: 10px;
  background-color: #e8f5e9;
  color: #388e3c;
  text-align: center;
  font-weight: bold;
  animation: ${fadeIn} 0.5s ease;
`;

const GameBoard: React.FC = () => {
  const { 
    state, 
    currentWord, 
    availableLevels, 
    isAnswerCorrect,
    startGame, 
    pauseGame, 
    resumeGame, 
    endGame, 
    selectLevel,
    nextWord,
    resetGame
  } = useGameContext();
  
  const { userProgress, getLevelUnlockStatus } = useGameProgress();
  const { playSound } = useSounds();
  
  const [selectedLevel, setSelectedLevel] = useState(state.currentLevel);
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.PRACTICE);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  
  // 处理游戏完成
  useEffect(() => {
    if (state.status === GameStatus.COMPLETED) {
      setShowCompletionMessage(true);
      playSound('complete');
      
      const timer = setTimeout(() => {
        setShowCompletionMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [state.status, playSound]);
  
  // 处理答案正确后的逻辑
  useEffect(() => {
    if (isAnswerCorrect) {
      const timer = setTimeout(() => {
        nextWord();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isAnswerCorrect, nextWord]);
  
  // 开始游戏
  const handleStartGame = () => {
    playSound('start');
    startGame(selectedLevel, selectedMode);
  };
  
  // 暂停游戏
  const handlePauseGame = () => {
    playSound('click');
    
    if (state.status === GameStatus.PAUSED) {
      resumeGame();
    } else {
      pauseGame();
    }
  };
  
  // 重置游戏
  const handleResetGame = () => {
    playSound('click');
    resetGame();
  };
  
  // 结束游戏
  const handleEndGame = () => {
    playSound('click');
    endGame();
  };
  
  // 选择级别
  const handleSelectLevel = (levelId: string) => {
    // 检查是否已解锁
    const isUnlocked = getLevelUnlockStatus(levelId);
    if (!isUnlocked) return;
    
    playSound('click');
    setSelectedLevel(levelId);
    
    if (state.status === GameStatus.PLAYING) {
      // 如果游戏已经开始，则立即切换级别
      selectLevel(levelId);
    }
  };
  
  // 切换游戏模式
  const handleToggleMode = () => {
    playSound('click');
    setSelectedMode(prevMode => 
      prevMode === GameMode.PRACTICE ? GameMode.CHALLENGE : GameMode.PRACTICE
    );
  };
  
  // 渲染游戏状态
  const renderGameContent = () => {
    switch (state.status) {
      case GameStatus.READY:
        return (
          <>
            <LevelSelector>
              <LevelSelectorTitle>选择级别</LevelSelectorTitle>
              <LevelGrid>
                {availableLevels.map((level: GameLevel) => {
                  const isUnlocked = getLevelUnlockStatus(level.id);
                  return (
                    <LevelCard 
                      key={level.id} 
                      selected={selectedLevel === level.id}
                      unlocked={isUnlocked}
                      onClick={() => handleSelectLevel(level.id)}
                    >
                      <LevelName>{level.name}</LevelName>
                      <LevelInfo>{level.difficulty}</LevelInfo>
                      <LevelInfo>{isUnlocked ? '已解锁' : `需要 ${level.minScore} 分`}</LevelInfo>
                    </LevelCard>
                  );
                })}
              </LevelGrid>
            </LevelSelector>
            
            <ModeToggleContainer>
              <ModeLabel active={selectedMode === GameMode.PRACTICE}>
                练习模式
              </ModeLabel>
              <ModeToggle 
                challenge={selectedMode === GameMode.CHALLENGE}
                onClick={handleToggleMode}
              />
              <ModeLabel active={selectedMode === GameMode.CHALLENGE}>
                挑战模式
              </ModeLabel>
            </ModeToggleContainer>
            
            <GameControls>
              <GameButton 
                primary 
                onClick={handleStartGame}
              >
                开始游戏
              </GameButton>
            </GameControls>
          </>
        );
        
      case GameStatus.PLAYING:
      case GameStatus.PAUSED:
        return (
          <>
            <ScoreBoard compact={true} />
            
            <GameProgress visible={state.status === GameStatus.PLAYING}>
              <GameCard
                currentWord={currentWord}
                showPinyin={false}
                showHint={false}
                isCorrect={isAnswerCorrect}
                size="large"
              />
              
              <AnswerInput 
                disabled={state.status !== GameStatus.PLAYING} 
              />
            </GameProgress>
            
            {state.status === GameStatus.PAUSED && (
              <GameMessage>游戏已暂停</GameMessage>
            )}
            
            <GameControls>
              <GameButton
                onClick={handlePauseGame}
                status={state.status}
              >
                {state.status === GameStatus.PAUSED ? '继续' : '暂停'}
              </GameButton>
              <GameButton onClick={handleEndGame}>
                结束游戏
              </GameButton>
              <GameButton onClick={handleResetGame}>
                重新开始
              </GameButton>
            </GameControls>
          </>
        );
        
      case GameStatus.COMPLETED:
        return (
          <>
            <ScoreBoard showMilestones={true} />
            
            {showCompletionMessage && (
              <GameMessage>
                游戏完成！你的得分是 {state.score} 分
              </GameMessage>
            )}
            
            <GameControls>
              <GameButton primary onClick={handleResetGame}>
                再玩一次
              </GameButton>
            </GameControls>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <GameBoardContainer>
      <GameHeader>
        <GameTitle>汉字学习游戏</GameTitle>
      </GameHeader>
      
      <GameSection>
        {renderGameContent()}
      </GameSection>
    </GameBoardContainer>
  );
};

export default GameBoard;