import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useGameContext } from '../contexts/GameContext';
import useSounds from '../hooks/useSounds';

// 定义组件props接口
interface AnswerInputProps {
  maxLength?: number;
  onSubmit?: (answer: string) => void;
  onRequestHint?: () => void;
  disabled?: boolean;
}

// 输入按钮弹跳动画
const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

// 正确答案动画
const correctAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

// 错误答案振动动画
const shakeAnimation = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

// 淡入淡出动画
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// 样式化组件
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 15px;
  position: relative;
`;

const AnswerTextField = styled.input<{ isCorrect?: boolean | null }>`
  width: 70%;
  padding: 15px 20px;
  font-size: 1.2rem;
  border: 3px solid #a2d9ff;
  border-radius: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  outline: none;
  transition: all 0.3s ease;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  text-align: center;
  
  &:focus {
    border-color: #68b5e8;
    box-shadow: 0 4px 12px rgba(104, 181, 232, 0.3);
  }
  
  ${props => props.isCorrect === true && css`
    border-color: #6cca78;
    background-color: #e8f5e9;
    animation: ${correctAnimation} 0.5s ease;
  `}
  
  ${props => props.isCorrect === false && css`
    border-color: #ff6b6b;
    background-color: #ffebee;
    animation: ${shakeAnimation} 0.5s ease;
  `}
  
  @media (max-width: 768px) {
    width: 60%;
    padding: 12px 15px;
    font-size: 1rem;
  }
`;

const SubmitButton = styled.button<{ isActive?: boolean }>`
  background-color: #68b5e8;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #4a9ad9;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  ${props => props.isActive && css`
    animation: ${bounceAnimation} 0.5s;
  `}
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
`;

const HintButton = styled.button<{ hintsRemaining: number }>`
  position: absolute;
  right: 0;
  top: -45px;
  background-color: ${props => props.hintsRemaining > 0 ? '#ffd166' : '#cccccc'};
  color: ${props => props.hintsRemaining > 0 ? '#333' : '#777'};
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  cursor: ${props => props.hintsRemaining > 0 ? 'pointer' : 'not-allowed'};
  font-size: 0.9rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.hintsRemaining > 0 ? '#feb144' : '#cccccc'};
    transform: ${props => props.hintsRemaining > 0 ? 'translateY(-2px)' : 'none'};
  }
  
  &:active {
    transform: ${props => props.hintsRemaining > 0 ? 'translateY(0)' : 'none'};
  }
`;

const HintBadge = styled.span`
  background-color: white;
  color: #333;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  margin-left: 8px;
`;

const FeedbackMessage = styled.div<{ type: 'success' | 'error' | 'info' }>`
  margin-top: 15px;
  padding: 10px 20px;
  border-radius: 20px;
  animation: ${fadeIn} 0.3s ease;
  font-weight: bold;
  text-align: center;
  
  background-color: ${props => {
    switch (props.type) {
      case 'success':
        return '#e8f5e9';
      case 'error':
        return '#ffebee';
      default:
        return '#e3f2fd';
    }
  }};
  
  color: ${props => {
    switch (props.type) {
      case 'success':
        return '#388e3c';
      case 'error':
        return '#d32f2f';
      default:
        return '#1976d2';
    }
  }};
  
  border: 2px solid ${props => {
    switch (props.type) {
      case 'success':
        return '#a5d6a7';
      case 'error':
        return '#ef9a9a';
      default:
        return '#90caf9';
    }
  }};
`;

const AnswerInput: React.FC<AnswerInputProps> = ({
  maxLength = 10,
  onSubmit,
  onRequestHint,
  disabled = false
}) => {
  const [answer, setAnswer] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('info');
  
  const { state, checkAnswer, useHint, isAnswerCorrect } = useGameContext();
  const { playSound } = useSounds();
  const inputRef = useRef<HTMLInputElement>(null);

  // 处理答案输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 限制输入长度
    if (e.target.value.length <= maxLength) {
      setAnswer(e.target.value);
    }
  };

  // 处理答案提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!answer.trim()) {
      setFeedbackMessage('请输入你的答案！');
      setFeedbackType('info');
      return;
    }
    
    // 播放点击音效
    playSound('click');
    
    // 验证答案
    const isCorrect = checkAnswer(answer);
    
    // 设置反馈信息
    if (isCorrect) {
      setFeedbackMessage('真棒！答对了！');
      setFeedbackType('success');
      playSound('correct');
    } else {
      setFeedbackMessage('再试一次！');
      setFeedbackType('error');
      playSound('incorrect');
    }
    
    // 如果提供了外部提交处理器，则调用它
    if (onSubmit) {
      onSubmit(answer);
    }
    
    // 清空输入，如果答案不正确
    if (!isCorrect) {
      setAnswer('');
      // 聚焦输入框
      inputRef.current?.focus();
    }
    
    // 按钮动画
    setIsActive(true);
    setTimeout(() => setIsActive(false), 500);
  };

  // 处理提示请求
  const handleHintRequest = () => {
    if (state.remainingHints <= 0) return;
    
    // 播放提示音效
    playSound('hint');
    
    // 获取提示
    const hint = useHint();
    
    // 设置反馈信息为提示内容
    if (hint) {
      setFeedbackMessage(`提示: ${hint}`);
      setFeedbackType('info');
    }
    
    // 如果提供了外部提示处理器，则调用它
    if (onRequestHint) {
      onRequestHint();
    }
  };

  // 当答案验证状态变化时，重置输入框（如果答案正确）
  useEffect(() => {
    if (isAnswerCorrect) {
      setTimeout(() => {
        setAnswer('');
        if (feedbackMessage) {
          setFeedbackMessage(null);
        }
      }, 2000);
    }
  }, [isAnswerCorrect, feedbackMessage]);

  // 自动聚焦输入框
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // 清除反馈信息的定时器
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  return (
    <InputContainer>
      <FormContainer onSubmit={handleSubmit}>
        <HintButton 
          type="button" 
          onClick={handleHintRequest} 
          hintsRemaining={state.remainingHints}
          disabled={disabled || state.remainingHints <= 0}
        >
          提示
          <HintBadge>{state.remainingHints}</HintBadge>
        </HintButton>
        
        <AnswerTextField
          ref={inputRef}
          type="text"
          value={answer}
          onChange={handleInputChange}
          placeholder="输入答案..."
          maxLength={maxLength}
          isCorrect={isAnswerCorrect}
          disabled={disabled}
          autoComplete="off"
        />
        
        <SubmitButton 
          type="submit" 
          isActive={isActive}
          disabled={disabled || !answer.trim()}
        >
          ✓
        </SubmitButton>
      </FormContainer>
      
      {feedbackMessage && (
        <FeedbackMessage type={feedbackType}>
          {feedbackMessage}
        </FeedbackMessage>
      )}
    </InputContainer>
  );
};

export default AnswerInput;