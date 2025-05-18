import { createGlobalStyle } from 'styled-components';

// 定义颜色变量
const colors = {
  // 主色调 - 明亮、活泼的颜色
  primary: '#68b5e8', // 明亮的蓝色
  primaryLight: '#a2d9ff',
  primaryDark: '#4a9ad9',
  
  // 强调色
  accent: '#ffd166', // 温暖的黄色
  accentLight: '#ffecb3',
  accentDark: '#feb144',
  
  // 成功/错误反馈色
  success: '#6cca78', // 柔和的绿色
  successLight: '#e8f5e9',
  error: '#ff6b6b', // 柔和的红色
  errorLight: '#ffebee',
  
  // 中性色
  text: '#4a5568', // 深灰色文字
  textLight: '#718096', // 浅灰色文字
  background: '#f7f9fb', // 非常浅的蓝灰色背景
  card: '#ffffff', // 卡片背景
  
  // 难度级别颜色
  easy: '#a2d9ff', // 浅蓝色
  medium: '#ffd166', // 黄色
  hard: '#ff9f9f', // 浅红色
};

// 定义通用动画关键帧
const animations = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    60% { transform: translateY(-10px); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  
  @keyframes pop {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
`;

// 创建全局样式
const GlobalStyle = createGlobalStyle`
  ${animations}
  
  :root {
    /* 存储颜色变量以便通过CSS变量访问 */
    --color-primary: ${colors.primary};
    --color-primary-light: ${colors.primaryLight};
    --color-primary-dark: ${colors.primaryDark};
    --color-accent: ${colors.accent};
    --color-accent-light: ${colors.accentLight};
    --color-accent-dark: ${colors.accentDark};
    --color-success: ${colors.success};
    --color-success-light: ${colors.successLight};
    --color-error: ${colors.error};
    --color-error-light: ${colors.errorLight};
    --color-text: ${colors.text};
    --color-text-light: ${colors.textLight};
    --color-background: ${colors.background};
    --color-card: ${colors.card};
    --color-easy: ${colors.easy};
    --color-medium: ${colors.medium};
    --color-hard: ${colors.hard};
    
    /* 圆角值 */
    --border-radius-small: 8px;
    --border-radius-medium: 16px;
    --border-radius-large: 25px;
    --border-radius-round: 50px;
    
    /* 阴影效果 */
    --shadow-small: 0 2px 5px rgba(0, 0, 0, 0.1);
    --shadow-medium: 0 6px 15px rgba(0, 0, 0, 0.1);
    --shadow-large: 0 10px 25px rgba(0, 0, 0, 0.15);
    
    /* 间距 */
    --spacing-xs: 5px;
    --spacing-sm: 10px;
    --spacing-md: 20px;
    --spacing-lg: 30px;
    --spacing-xl: 40px;
    
    /* 字体大小 */
    --font-size-xs: 0.8rem;
    --font-size-sm: 1rem;
    --font-size-md: 1.2rem;
    --font-size-lg: 1.5rem;
    --font-size-xl: 2rem;
    --font-size-xxl: 3rem;
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    min-height: 100%;
    overflow-x: hidden;
  }
  
  body {
    font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif;
    background-color: ${colors.background};
    color: ${colors.text};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif;
    margin-bottom: 0.5em;
    font-weight: 700;
    line-height: 1.2;
  }
  
  h1 {
    font-size: 2.5rem;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  h3 {
    font-size: 1.75rem;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  a {
    color: ${colors.primary};
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: ${colors.primaryDark};
    }
  }
  
  button {
    cursor: pointer;
    font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif;
    border: none;
    border-radius: var(--border-radius-small);
    padding: 8px 16px;
    background-color: ${colors.primary};
    color: white;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: ${colors.primaryDark};
      transform: translateY(-2px);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  input, textarea, select {
    font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif;
    padding: 10px 15px;
    border-radius: var(--border-radius-small);
    border: 2px solid ${colors.primaryLight};
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: ${colors.primary};
      box-shadow: 0 0 0 3px ${colors.primaryLight}40;
    }
  }
  
  /* 响应式断点 */
  @media (max-width: 768px) {
    :root {
      --font-size-xs: 0.75rem;
      --font-size-sm: 0.9rem;
      --font-size-md: 1.1rem;
      --font-size-lg: 1.3rem;
      --font-size-xl: 1.6rem;
      --font-size-xxl: 2.2rem;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    h2 {
      font-size: 1.75rem;
    }
    
    h3 {
      font-size: 1.5rem;
    }
    
    body {
      padding: 0 10px;
    }
  }
  
  /* 禁用元素轮廓，使用自定义轮廓 */
  :focus {
    outline: none;
  }
  
  /* 使滚动条更有趣且适合儿童主题 */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${colors.primaryLight}30;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${colors.primary};
    border-radius: 10px;
    border: 3px solid ${colors.primaryLight}30;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.primaryDark};
  }
  
  /* 平滑滚动 */
  html {
    scroll-behavior: smooth;
  }
  
  /* 文本选择颜色 */
  ::selection {
    background-color: ${colors.accent};
    color: ${colors.text};
  }
`;

export default GlobalStyle;