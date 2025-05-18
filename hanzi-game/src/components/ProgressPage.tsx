import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useGameProgress } from '../hooks/useGameProgress';
import { WordItem, Difficulty } from '../types';
import wordsData from '../data/wordsData';
import { Link } from 'react-router-dom';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Main container
const ProgressPageContainer = styled.div`
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive, sans-serif;
  color: #3a3a3a; // Dark grey for text
  background-color: #fffaf0; // Floral white - very light, warm background
  border-radius: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.6s ease-out;
`;

// Page title
const PageTitle = styled.h1`
  color: #ff6347; // Tomato red - vibrant and playful
  text-align: center;
  font-size: 3rem;
  margin-bottom: 40px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.15);
`;

// Section styling
const Section = styled.section`
  margin-bottom: 35px;
  padding: 25px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.5s ease-out forwards;
  opacity: 0; /* Start hidden for animation */
  animation-delay: calc(0.1s * var(--section-index, 1)); /* Stagger animation */
`;

const SectionTitle = styled.h2`
  color: #4a4e69; // Dark grayish blue
  font-size: 2rem;
  margin-top:0;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 3px dashed #fca311; // Bright orange
  display: flex;
  align-items: center;
  &:before {
    content: '🌟';
    margin-right: 10px;
    font-size: 1.5em;
  }
`;

// Stats Grid for overall progress
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 25px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%); // Light blue gradient
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  color: white;
  box-shadow: 0 5px 15px rgba(102, 166, 255, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 10px 20px rgba(102, 166, 255, 0.4);
  }
`;

const StatValue = styled.p`
  font-size: 2.8rem;
  font-weight: bold;
  margin: 0 0 8px 0;
`;

const StatLabel = styled.p`
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
`;

// Difficulty Progress Bars
const DifficultySection = styled.div`
  margin-top: 20px;
`;

const DifficultyItem = styled.div`
  margin-bottom: 20px;
`;

const DifficultyLabel = styled.h3`
  font-size: 1.4rem;
  color: #4a4e69;
  margin: 0 0 10px 0;
  text-transform: capitalize;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: #e0e0e0; // Neutral grey for progress bar background
  border-radius: 30px;
  height: 30px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProgressBarFill = styled.div<{ percent: number; difficulty: Difficulty }>`
  height: 100%;
  width: ${props => props.percent}%;
  background: ${props => {
    if (props.difficulty === Difficulty.EASY) return 'linear-gradient(to right, #56ab2f, #a8e063)'; // Lush green
    if (props.difficulty === Difficulty.MEDIUM) return 'linear-gradient(to right, #fbc531, #f9d72f)'; // Sunny yellow
    if (props.difficulty === Difficulty.HARD) return 'linear-gradient(to right, #ee4d5f, #ff7675)'; // Vibrant red/pink
    return '#bdc3c7'; // Default grey
  }};
  border-radius: 30px;
  transition: width 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
`;

// Learned Words List
const LearnedWordsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 18px;
  margin-top: 15px;
`;

const WordCard = styled.div`
  background-color: #e6f7ff; // Very light sky blue
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.07);
  border: 2px solid #ade8f4; // Light cyan border
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const WordText = styled.p`
  font-size: 2rem;
  font-weight: bold;
  color: #0077b6; // Ocean blue
  margin: 0 0 5px 0;
`;

const PinyinText = styled.p`
  font-size: 1rem;
  color: #023e8a; // Darker blue
  margin: 0;
`;

// Achievements
const AchievementsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const AchievementItem = styled.li`
  background-color: #fffacd; // Lemon chiffon - light, cheerful yellow
  padding: 12px 18px;
  border-radius: 10px;
  margin-bottom: 12px;
  font-size: 1.1rem;
  color: #b8860b; // DarkGoldenRod
  border-left: 6px solid #ffd700; // Gold border
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px rgba(255,215,0, 0.2);

  &:before {
    content: '🏅'; /* Using medal emoji */
    margin-right: 12px;
    font-size: 1.4rem;
  }
`;

// Learning Activity
const ActivityText = styled.p`
  font-size: 1.1rem;
  color: #4a4e69;
  line-height: 1.7;
  margin-bottom: 8px;
`;

const ChartPlaceholder = styled.div`
  height: 150px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0a0a0;
  border-radius: 15px;
  margin-top: 20px;
  font-style: italic;
`;

// Back Button
const BackButtonContainer = styled.div`
  text-align: center;
  margin-top: 40px;
`;

const BackButton = styled(Link)`
  display: inline-block;
  padding: 12px 25px;
  background: linear-gradient(to right, #ff7e5f, #feb47b); // Orange gradient
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 5px 15px rgba(255, 126, 95, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 20px rgba(255, 126, 95, 0.4);
  }
`;

const formatDate = (isoString: string | null): string => {
  if (!isoString) return '暂无记录';
  try {
    return new Date(isoString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return '日期无效';
  }
};

const ProgressPage: React.FC = () => {
  const { userProgress, overallCompletion, difficultyCompletion } = useGameProgress();

  const learnedWordDetails: WordItem[] = userProgress.completedWords
    .map(wordId => wordsData.find(w => w.id === wordId))
    .filter((word): word is WordItem => word !== undefined);

  return (
    <ProgressPageContainer>
      <PageTitle>我的学习报告</PageTitle>

      <Section style={{ ['--section-index' as string]: 1 }}>
        <SectionTitle>学习总览</SectionTitle>
        <StatsGrid>
          <StatCard>
            <StatValue>{userProgress.totalScore}</StatValue>
            <StatLabel>总分数</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{learnedWordDetails.length}</StatValue>
            <StatLabel>已掌握词语</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{overallCompletion}%</StatValue>
            <StatLabel>总体完成度</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{userProgress.streakDays}</StatValue>
            <StatLabel>连续学习</StatLabel>
          </StatCard>
        </StatsGrid>
      </Section>

      <Section style={{ ['--section-index' as string]: 2 }}>
        <SectionTitle>各难度进度</SectionTitle>
        <DifficultySection>
          {Object.entries(difficultyCompletion).map(([difficulty, percent]) => (
            <DifficultyItem key={difficulty}>
              <DifficultyLabel>{difficulty}</DifficultyLabel>
              <ProgressBarContainer>
                <ProgressBarFill percent={percent} difficulty={difficulty as Difficulty}>
                  {percent}%
                </ProgressBarFill>
              </ProgressBarContainer>
            </DifficultyItem>
          ))}
        </DifficultySection>
      </Section>

      <Section style={{ ['--section-index' as string]: 3 }}>
        <SectionTitle>已掌握的汉字/词语 ({learnedWordDetails.length})</SectionTitle>
        {learnedWordDetails.length > 0 ? (
          <LearnedWordsGrid>
            {learnedWordDetails.map(word => (
              <WordCard key={word.id}>
                <WordText>{word.word}</WordText>
                <PinyinText>{word.pinyin}</PinyinText>
              </WordCard>
            ))}
          </LearnedWordsGrid>
        ) : (
          <ActivityText>还没有学过的汉字呢，快去【开始学习】吧！🚀</ActivityText>
        )}
      </Section>

      <Section style={{ ['--section-index' as string]: 4 }}>
        <SectionTitle>我的成就</SectionTitle>
        {userProgress.achievements.length > 0 ? (
          <AchievementsList>
            {userProgress.achievements.map((achievementId, index) => (
              // Assuming achievementId is a descriptive name or ID string for now
              <AchievementItem key={index}>{achievementId}</AchievementItem>
            ))}
          </AchievementsList>
        ) : (
          <ActivityText>继续努力，解锁更多成就！💪</ActivityText>
        )}
      </Section>

      <Section style={{ ['--section-index' as string]: 5 }}>
        <SectionTitle>学习活动统计</SectionTitle>
        <ActivityText>上次学习时间：{formatDate(userProgress.lastPlayedAt)}</ActivityText>
        <ActivityText>当前已连续学习：<strong>{userProgress.streakDays}</strong> 天</ActivityText>
        <ChartPlaceholder>更多学习频率图表正在努力开发中...敬请期待! ✨</ChartPlaceholder>
      </Section>
      
      <BackButtonContainer>
        <BackButton to="/">返回主页</BackButton>
      </BackButtonContainer>
    </ProgressPageContainer>
  );
};

export default ProgressPage;
