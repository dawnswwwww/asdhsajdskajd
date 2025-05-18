import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useGameContext } from '../contexts/GameContext';
import useGameProgress from '../hooks/useGameProgress';
import useSounds from '../hooks/useSounds';
import GameCard from './GameCard';
import ScoreBoard from './ScoreBoard';
import { GameMode, Difficulty } from '../types';
import gameLevels from '../data/gameLevels';
import wordsData from '../data/wordsData';

// 定义动画
const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const rotateInAnimation = keyframes`
  from {
    transform: rotate(-10deg) scale(0.8);
    opacity: 0;
  }
  to {
    transform: rotate(0) scale(1);
    opacity: 1;
  }
`;

// 样式组件
const HomePageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
`;

const WelcomeHeader = styled.header`
  text-align: center;
  margin-bottom: 30px;
  animation: ${rotateInAnimation} 0.8s ease-out;
`;

const GameTitle = styled.h1`
  font-size: 3.5rem;
  color: #4a5568;
  margin: 10px 0;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const GameSubtitle = styled.h2`
  font-size: 1.5rem;
  color: #68b5e8;
  margin: 0;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const FloatingCharacters = styled.div`
  position: absolute;
  top: 20px;
  font-size: 3rem;
  opacity: 0.2;
  color: #68b5e8;
  user-select: none;
  pointer-events: none;
  animation: ${floatAnimation} 3s infinite ease-in-out;
  
  &:nth-child(odd) {
    animation-duration: 4s;
  }
  
  &:nth-child(3n) {
    animation-duration: 5s;
    animation-delay: 1s;
  }
  
  &.left {
    left: 5%;
  }
  
  &.right {
    right: 5%;
  }
`;

const MainContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

const ActionButton = styled(Link)`
  background-color: #ffd166;
  color: #4a5568;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.3rem;
  font-weight: bold;
  text-decoration: none;
  margin: 20px 0;
  text-align: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  animation: ${pulseAnimation} 2s infinite;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    background-color: #ffbe33;
  }
  
  @media (max-width: 768px) {
    padding: 12px 25px;
    font-size: 1.1rem;
  }
`;

const ContentSection = styled.section`
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 30px;
  width: 100%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #4a5568;
  margin-top: 0;
  margin-bottom: 15px;
  text-align: center;
  border-bottom: 2px dashed #c0c7d2;
  padding-bottom: 10px;
  font-family: 'Comic Sans MS', cursive, sans-serif;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #68b5e8;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #4a5568;
`;

const ModesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
`;

const ModeCard = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
`;

const ModeTitle = styled.h4`
  font-size: 1.3rem;
  color: #4a5568;
  margin-top: 0;
  margin-bottom: 10px;
`;

const ModeDescription = styled.p`
  font-size: 0.95rem;
  color: #718096;
  margin-bottom: 20px;
`;

const ModeButton = styled(Link)`
  background-color: #68b5e8;
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #4a9ad9;
    transform: scale(1.05);
  }
`;

const UnlockedLevels = styled.div`
  margin: 20px 0;
`;

const LevelsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const LevelBadge = styled.div<{ difficulty: Difficulty }>`
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
  padding: 8px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: bold;
`;

const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 300px;
  margin-bottom: 10px;
`;

const SettingLabel = styled.span`
  font-size: 1rem;
  color: #4a5568;
`;

const Toggle = styled.div<{ active: boolean }>`
  width: 50px;
  height: 26px;
  background-color: ${props => props.active ? '#68b5e8' : '#cbd5e0'};
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${props => props.active ? '27px' : '3px'};
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.3s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 300px;
  margin-top: 10px;
`;

const VolumeSlider = styled.input`
  flex: 1;
  margin-left: 10px;
  -webkit-appearance: none;
  height: 6px;
  border-radius: 3px;
  background: #cbd5e0;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #68b5e8;
    cursor: pointer;
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { userProgress, overallCompletion, difficultyCompletion, getLevelUnlockStatus } = useGameProgress();
  const { resetGame } = useGameContext();
  const { playSound, toggleSound, isSoundEnabled, setVolume, currentVolume } = useSounds();
  
  // 解锁的级别
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>([]);
  
  // 更新解锁的级别
  useEffect(() => {
    const unlocked = gameLevels
      .filter(level => getLevelUnlockStatus(level.id))
      .map(level => level.id);
    
    setUnlockedLevels(unlocked);
  }, [getLevelUnlockStatus, userProgress]);
  
  // 处理游戏开始
  const handleStartGame = () => {
    playSound('click');
    resetGame();
    navigate('/game');
  };
  
  // 处理音量调整
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setVolume(volume);
  };
  
  // 随机选择展示词汇
  const [showcaseWord] = useState(() => {
    const easyWords = wordsData.filter(word => word.difficulty === Difficulty.EASY);
    const randomIndex = Math.floor(Math.random() * easyWords.length);
    return easyWords[randomIndex];
  });
  
  return (
    <HomePageContainer>
      {/* 背景漂浮汉字 */}
      <FloatingCharacters className="left" style={{ top: '15%' }}>人</FloatingCharacters>
      <FloatingCharacters className="right" style={{ top: '10%' }}>山</FloatingCharacters>
      <FloatingCharacters className="left" style={{ top: '30%', left: '15%' }}>水</FloatingCharacters>
      <FloatingCharacters className="right" style={{ top: '40%', right: '10%' }}>火</FloatingCharacters>
      <FloatingCharacters className="left" style={{ bottom: '20%', left: '8%' }}>木</FloatingCharacters>
      
      <WelcomeHeader>
        <GameTitle>汉字学习游戏</GameTitle>
        <GameSubtitle>学习汉字，挑战自我！</GameSubtitle>
      </WelcomeHeader>
      
      <MainContent>
        <GameCard
          currentWord={showcaseWord}
          showPinyin={true}
          showHint={false}
          size="medium"
        />
        
        <ActionButton to="/game" onClick={handleStartGame}>
          开始学习
        </ActionButton>
        
        <ContentSection>
          <SectionTitle>游戏模式</SectionTitle>
          <ModesContainer>
            <ModeCard>
              <ModeTitle>练习模式</ModeTitle>
              <ModeDescription>
                慢节奏学习模式，无时间限制，适合初学者。可以使用提示，专注于掌握汉字基础。
              </ModeDescription>
              <ModeButton to="/game" onClick={() => {
                resetGame();
                navigate('/game', { state: { mode: GameMode.PRACTICE } });
              }}>
                进入练习
              </ModeButton>
            </ModeCard>
            
            <ModeCard>
              <ModeTitle>挑战模式</ModeTitle>
              <ModeDescription>
                快节奏竞赛模式，有时间限制，适合已有基础的学习者。答对得分更高，挑战你的反应速度和记忆力。
              </ModeDescription>
              <ModeButton to="/game" onClick={() => {
                resetGame();
                navigate('/game', { state: { mode: GameMode.CHALLENGE } });
              }}>
                开始挑战
              </ModeButton>
            </ModeCard>
          </ModesContainer>
        </ContentSection>
        
        <ContentSection>
          <SectionTitle>我的学习进度</SectionTitle>
          <StatGrid>
            <StatCard>
              <StatValue>{userProgress.completedWords.length}</StatValue>
              <StatLabel>已学习汉字</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{userProgress.totalScore}</StatValue>
              <StatLabel>总分数</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{`${overallCompletion}%`}</StatValue>
              <StatLabel>总体完成度</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{userProgress.streakDays}</StatValue>
              <StatLabel>连续学习天数</StatLabel>
            </StatCard>
          </StatGrid>
          
          <UnlockedLevels>
            <SectionTitle>已解锁级别</SectionTitle>
            <LevelsList>
              {gameLevels.map(level => (
                getLevelUnlockStatus(level.id) && (
                  <LevelBadge key={level.id} difficulty={level.difficulty}>
                    {level.name}
                  </LevelBadge>
                )
              ))}
            </LevelsList>
          </UnlockedLevels>
          
          {userProgress.totalScore > 0 && (
            <ScoreBoard compact={true} />
          )}
          
          <ModeButton to="/progress">
            查看详细学习报告
          </ModeButton>
        </ContentSection>
        
        <ContentSection>
          <SectionTitle>设置</SectionTitle>
          <SettingsSection>
            <SettingRow>
              <SettingLabel>音效</SettingLabel>
              <Toggle 
                active={isSoundEnabled} 
                onClick={() => {
                  toggleSound();
                  playSound('click');
                }}
              />
            </SettingRow>
            
            <VolumeControl>
              <SettingLabel>音量</SettingLabel>
              <VolumeSlider 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={currentVolume} 
                onChange={handleVolumeChange} 
              />
            </VolumeControl>
          </SettingsSection>
        </ContentSection>
      </MainContent>
    </HomePageContainer>
  );
};

export default HomePage;