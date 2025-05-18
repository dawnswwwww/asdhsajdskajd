import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { WordItem, Difficulty } from '../types';

// 定义组件props接口
interface GameCardProps {
  currentWord: WordItem | null;
  showPinyin?: boolean;
  showHint?: boolean;
  isFlipped?: boolean;
  isCorrect?: boolean | null;
  size?: 'small' | 'medium' | 'large';
  onFlip?: () => void;
}

// 卡片翻转动画
const flipAnimation = keyframes`
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(180deg);
  }
`;

const flipBackAnimation = keyframes`
  0% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(0deg);
  }
`;

// 卡片弹跳动画
const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
`;

// 样式化组件
const CardContainer = styled.div<{
  size?: 'small' | 'medium' | 'large';
  difficulty?: Difficulty;
}>`
  width: ${props => (props.size === 'large' ? '300px' : props.size === 'small' ? '200px' : '250px')};
  height: ${props => (props.size === 'large' ? '400px' : props.size === 'small' ? '250px' : '320px')};
  perspective: 1000px;
  margin: 20px auto;
  cursor: pointer;
  
  @media (max-width: 768px) {
    width: ${props => (props.size === 'large' ? '250px' : props.size === 'small' ? '150px' : '200px')};
    height: ${props => (props.size === 'large' ? '330px' : props.size === 'small' ? '200px' : '260px')};
  }
`;

const CardInner = styled.div<{ isFlipped?: boolean; isCorrect?: boolean | null }>`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  
  ${props => props.isFlipped && css`
    animation: ${flipAnimation} 0.6s forwards;
  `}
  
  ${props => props.isFlipped === false && css`
    animation: ${flipBackAnimation} 0.6s forwards;
  `}
  
  ${props => props.isCorrect === true && css`
    animation: ${bounceAnimation} 1s;
  `}
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const CardFront = styled(CardFace)<{ difficulty?: Difficulty }>`
  background: ${props => {
    switch (props.difficulty) {
      case Difficulty.EASY:
        return 'linear-gradient(135deg, #a2d9ff 0%, #68b5e8 100%)';
      case Difficulty.MEDIUM:
        return 'linear-gradient(135deg, #ffd166 0%, #feb144 100%)';
      case Difficulty.HARD:
        return 'linear-gradient(135deg, #ff9f9f 0%, #ff6b6b 100%)';
      default:
        return 'linear-gradient(135deg, #a2d9ff 0%, #68b5e8 100%)';
    }
  }};
  color: #fff;
`;

const CardBack = styled(CardFace)`
  background: linear-gradient(135deg, #f7f9fb 0%, #e6eef5 100%);
  transform: rotateY(180deg);
  color: #333;
`;

const WordText = styled.h1<{ wordLength?: number }>`
  font-size: ${props => {
    if (props.wordLength && props.wordLength > 2) {
      return props.wordLength > 3 ? '4rem' : '5rem';
    }
    return '7rem';
  }};
  margin: 0 0 10px 0;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    font-size: ${props => {
      if (props.wordLength && props.wordLength > 2) {
        return props.wordLength > 3 ? '3rem' : '4rem';
      }
      return '5rem';
    }};
  }
`;

const PinyinText = styled.p`
  font-size: 1.5rem;
  margin: 10px 0;
  font-style: italic;
  color: rgba(255, 255, 255, 0.9);
`;

const MeaningText = styled.p`
  font-size: 1.2rem;
  margin: 10px 0;
  font-weight: bold;
`;

const HintText = styled.p`
  font-size: 1.1rem;
  margin: 15px 0;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  width: 90%;
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
`;

const DifficultyIndicator = styled.div<{ difficulty?: Difficulty }>`
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
`;

const DifficultyDot = styled.span<{ active?: boolean; difficulty?: Difficulty }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
  background-color: ${props => (props.active ? '#fff' : 'rgba(255, 255, 255, 0.3)')};
`;

const GameCard: React.FC<GameCardProps> = ({
  currentWord,
  showPinyin = false,
  showHint = false,
  isFlipped = false,
  isCorrect = null,
  size = 'medium',
  onFlip
}) => {
  const [internalFlipped, setInternalFlipped] = useState(isFlipped);

  useEffect(() => {
    setInternalFlipped(isFlipped);
  }, [isFlipped]);

  const handleCardClick = () => {
    if (onFlip) {
      onFlip();
    } else {
      setInternalFlipped(!internalFlipped);
    }
  };

  // 渲染难度指示器
  const renderDifficultyDots = (difficulty?: Difficulty) => {
    if (!difficulty) return null;

    let dotsCount;
    switch (difficulty) {
      case Difficulty.EASY:
        dotsCount = 1;
        break;
      case Difficulty.MEDIUM:
        dotsCount = 2;
        break;
      case Difficulty.HARD:
        dotsCount = 3;
        break;
      default:
        dotsCount = 0;
    }

    return (
      <DifficultyIndicator difficulty={difficulty}>
        {Array.from({ length: 3 }).map((_, index) => (
          <DifficultyDot 
            key={index}
            active={index < dotsCount}
            difficulty={difficulty}
          />
        ))}
      </DifficultyIndicator>
    );
  };

  return (
    <CardContainer 
      size={size}
      difficulty={currentWord?.difficulty}
      onClick={handleCardClick}
    >
      <CardInner isFlipped={internalFlipped} isCorrect={isCorrect}>
        <CardFront difficulty={currentWord?.difficulty}>
          {currentWord && (
            <>
              <WordText wordLength={currentWord.word.length}>
                {currentWord.word}
              </WordText>
              
              {showPinyin && (
                <PinyinText>{currentWord.pinyin}</PinyinText>
              )}
              
              {showHint && currentWord.hint && (
                <HintText>{currentWord.hint}</HintText>
              )}
              
              {currentWord.category && (
                <CategoryBadge>{currentWord.category}</CategoryBadge>
              )}
              
              {renderDifficultyDots(currentWord.difficulty)}
            </>
          )}
        </CardFront>
        
        <CardBack>
          {currentWord && (
            <>
              <WordText wordLength={currentWord.word.length}>
                {currentWord.word}
              </WordText>
              
              <PinyinText style={{ color: '#555' }}>
                {currentWord.pinyin}
              </PinyinText>
              
              <MeaningText>{currentWord.meaning}</MeaningText>
              
              {currentWord.hint && (
                <HintText style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                  提示: {currentWord.hint}
                </HintText>
              )}
            </>
          )}
        </CardBack>
      </CardInner>
    </CardContainer>
  );
};

export default GameCard;