import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useGameContext } from '../contexts/GameContext';
import useGameProgress from '../hooks/useGameProgress';
import { GameLevel, Difficulty } from '../types';
import gameLevels from '../data/gameLevels';

// 分数增加动画
const scoreIncreaseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// 完成进度动画
const progressAnimation = keyframes`
  from {
    width: 0;
  }
`;

// 成就解锁动画
const achievementAnimation = keyframes`
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  10% {
    transform: translateY(0);
    opacity: 1;
  }
  90% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 0;
  }
`;

// 里程碑达成动画
const milestoneAnimation = keyframes`
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

// 样式化组件
const ScoreBoardContainer = styled.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  border-radius: 16px;
  padding: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  margin: 0 auto 20px;
  position: relative;
  overflow: hidden;
`;

const ScoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 2px dashed #c0c7d2;
  padding-bottom: 10px;
`;

const ScoreTitle = styled.h2`
  font-size: 1.3rem;
  color: #4a5568;
  margin: 0;
  font-family: 'Comic Sans MS', cursive, sans-serif;
`;

const ScoreSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ScoreValue = styled.span<{ animate?: boolean }>`
  font-size: 2.2rem;
  font-weight: bold;
  color: #4a5568;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  ${props => props.animate && css`
    animation: ${scoreIncreaseAnimation} 0.6s;
  `}
`;

const ScoreIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #ffd166;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 1.4rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 12px;
  margin-bottom: 15px;
`;

const StatItem = styled.div<{ correct?: boolean }>`
  background-color: ${props => props.correct ? '#e8f5e9' : '#ffebee'};
  border: 2px solid ${props => props.correct ? '#a5d6a7' : '#ef9a9a'};
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 5px;
`;

const StatValue = styled.span<{ correct?: boolean }>`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.correct ? '#388e3c' : '#d32f2f'};
`;

const LevelSection = styled.div`
  margin-top: 15px;
  position: relative;
`;

const LevelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const LevelName = styled.h3`
  font-size: 1.1rem;
  color: #4a5568;
  margin: 0;
`;

const LevelBadge = styled.div<{ difficulty?: Difficulty }>`
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${props => {
    switch (props.difficulty) {
      case Difficulty.EASY:
        return '#a2d9ff';
      case Difficulty.MEDIUM:
        return '#ffd166';
      case Difficulty.HARD:
        return '#ff9f9f';
      default:
        return '#a2d9ff';
    }
  }};
  color: #4a5568;
`;

const ProgressBar = styled.div`
  background-color: #edf2f7;
  border-radius: 20px;
  height: 10px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div<{ percent: number; animate?: boolean }>`
  background: linear-gradient(90deg, #a2d9ff 0%, #68b5e8 100%);
  width: ${props => `${props.percent}%`};
  height: 100%;
  border-radius: 20px;
  transition: width 1s ease-in-out;
  ${props => props.animate && css`
    animation: ${progressAnimation} 1.5s ease-out;
  `}
`;

const MilestonesSection = styled.div`
  margin-top: 15px;
`;

const MilestoneTitle = styled.h3`
  font-size: 1rem;
  color: #4a5568;
  margin: 0 0 8px 0;
`;

const MilestoneContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-top: 5px;
`;

const MilestonePoint = styled.div<{ achieved: boolean; animate?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  color: white;
  background-color: ${props => props.achieved ? '#4CAF50' : '#bbbbbb'};
  position: relative;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  ${props => props.animate && css`
    animation: ${milestoneAnimation} 0.8s;
  `}
  
  &:after {
    content: '';
    position: absolute;
    top: -4px;
    right: -4px;
    bottom: -4px;
    left: -4px;
    border: 2px solid ${props => props.achieved ? '#a5d6a7' : 'transparent'};
    border-radius: 50%;
    opacity: ${props => props.achieved ? 1 : 0};
  }
`;

const MilestoneLine = styled.div`
  position: absolute;
  top: 50%;
  left: 12px;
  right: 12px;
  height: 3px;
  background-color: #bbbbbb;
  transform: translateY(-50%);
  z-index: 1;
`;

const MilestoneLabel = styled.div`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  text-align: center;
  width: 60px;
  color: #4a5568;
`;

const AchievementNotification = styled.div<{ show: boolean }>`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 209, 102, 0.9);
  padding: 8px 15px;
  border-radius: 30px;
  color: #4a5568;
  font-weight: bold;
  opacity: ${props => props.show ? 1 : 0};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: opacity 0.3s;
  animation: ${achievementAnimation} 5s;
  pointer-events: none;
  z-index: 10;
`;

interface ScoreBoardProps {
  showMilestones?: boolean;
  compact?: boolean;
}

// 里程碑数据
const milestones = [
  { points: 100, label: '初学者' },
  { points: 250, label: '进阶者' },
  { points: 500, label: '专家' },
  { points: 1000, label: '大师' },
  { points: 2000, label: '传奇' }
];

const ScoreBoard: React.FC<ScoreBoardProps> = ({ showMilestones = true, compact = false }) => {
  const { state, availableLevels } = useGameContext();
  const { userProgress, getLevelCompletion } = useGameProgress();
  
  const [animateScore, setAnimateScore] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementMessage, setAchievementMessage] = useState('');
  const [animateMilestone, setAnimateMilestone] = useState<number | null>(null);
  
  const prevScore = useRef(state.score);
  const prevLevel = useRef(state.currentLevel);
  
  // 当分数变化时触发动画
  useEffect(() => {
    if (state.score > prevScore.current) {
      setAnimateScore(true);
      
      const timeout = setTimeout(() => {
        setAnimateScore(false);
      }, 600);
      
      return () => clearTimeout(timeout);
    }
    
    prevScore.current = state.score;
  }, [state.score]);
  
  // 检查里程碑达成
  useEffect(() => {
    const checkMilestones = () => {
      // 找到刚刚达到的里程碑
      const justAchievedMilestone = milestones.findIndex(
        m => state.score >= m.points && prevScore.current < m.points
      );
      
      if (justAchievedMilestone !== -1) {
        setAnimateMilestone(justAchievedMilestone);
        setShowAchievement(true);
        setAchievementMessage(`恭喜！你已达到${milestones[justAchievedMilestone].label}级别！`);
        
        const timeout = setTimeout(() => {
          setShowAchievement(false);
          setAnimateMilestone(null);
        }, 5000);
        
        return () => clearTimeout(timeout);
      }
    };
    
    checkMilestones();
  }, [state.score]);
  
  // 当级别变化时检查
  useEffect(() => {
    if (state.currentLevel !== prevLevel.current) {
      const newLevel = availableLevels.find(l => l.id === state.currentLevel);
      
      if (newLevel) {
        setShowAchievement(true);
        setAchievementMessage(`解锁新级别：${newLevel.name}`);
        
        const timeout = setTimeout(() => {
          setShowAchievement(false);
        }, 5000);
        
        return () => clearTimeout(timeout);
      }
    }
    
    prevLevel.current = state.currentLevel;
  }, [state.currentLevel, availableLevels]);
  
  // 获取当前级别
  const currentLevel = availableLevels.find(l => l.id === state.currentLevel) || availableLevels[0];
  
  // 获取当前级别的完成度
  const levelCompletion = getLevelCompletion(state.currentLevel);
  
  // 渲染里程碑
  const renderMilestones = () => {
    return (
      <MilestonesSection>
        <MilestoneTitle>分数里程碑</MilestoneTitle>
        <MilestoneContainer>
          <MilestoneLine />
          {milestones.map((milestone, index) => (
            <MilestonePoint 
              key={index}
              achieved={state.score >= milestone.points}
              animate={animateMilestone === index}
              style={{
                left: `${index * (100 / (milestones.length - 1))}%`,
                marginLeft: index === 0 ? '0' : index === milestones.length - 1 ? '-24px' : '-12px'
              }}
            >
              {index + 1}
              <MilestoneLabel>{milestone.label}</MilestoneLabel>
            </MilestonePoint>
          ))}
        </MilestoneContainer>
      </MilestonesSection>
    );
  };
  
  return (
    <ScoreBoardContainer>
      <AchievementNotification show={showAchievement}>
        🎉 {achievementMessage}
      </AchievementNotification>
      
      <ScoreHeader>
        <ScoreTitle>游戏分数</ScoreTitle>
        <ScoreSection>
          <ScoreIcon>🏆</ScoreIcon>
          <ScoreValue animate={animateScore}>{state.score}</ScoreValue>
        </ScoreSection>
      </ScoreHeader>
      
      <StatsGrid>
        <StatItem correct>
          <StatLabel>答对</StatLabel>
          <StatValue correct>{state.correctAnswers}</StatValue>
        </StatItem>
        
        <StatItem>
          <StatLabel>答错</StatLabel>
          <StatValue>{state.wrongAnswers}</StatValue>
        </StatItem>
      </StatsGrid>
      
      <LevelSection>
        <LevelHeader>
          <LevelName>{currentLevel.name}</LevelName>
          <LevelBadge difficulty={currentLevel.difficulty}>
            {currentLevel.difficulty}
          </LevelBadge>
        </LevelHeader>
        
        <ProgressBar>
          <ProgressFill 
            percent={levelCompletion} 
            animate={state.score > 0} 
          />
        </ProgressBar>
      </LevelSection>
      
      {showMilestones && !compact && renderMilestones()}
    </ScoreBoardContainer>
  );
};

export default ScoreBoard;