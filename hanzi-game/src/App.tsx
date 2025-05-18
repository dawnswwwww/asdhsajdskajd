import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { GameProvider } from './contexts/GameContext';
import GlobalStyle from './styles/GlobalStyle';
import HomePage from './components/HomePage';
import GameBoard from './components/GameBoard';
import ProgressPage from './components/ProgressPage';

// 导航栏组件
const NavBar = styled.nav`
  background-color: #fff;
  padding: 12px 20px;
  display: flex;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1000px;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a5568;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled.a`
  color: #4a5568;
  text-decoration: none;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #a2d9ff;
    color: #4a5568;
  }
  
  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 0.9rem;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 10px;
`;

function App() {
  return (
    <Router>
      <GameProvider>
        <AppContainer>
          <GlobalStyle />
          <NavBar>
            <NavContainer>
              <Logo>汉字学习</Logo>
              <NavLinks>
                <NavLink href="/">首页</NavLink>
                <NavLink href="/game">游戏</NavLink>
                <NavLink href="/progress">进度</NavLink>
              </NavLinks>
            </NavContainer>
          </NavBar>
          <MainContent>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/game" element={<GameBoard />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </GameProvider>
    </Router>
  );
}

export default App;