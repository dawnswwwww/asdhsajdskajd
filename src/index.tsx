import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // 更新状态，下次渲染时显示降级UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("应用错误:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 显示自定义错误页面
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          fontFamily: "'Comic Sans MS', cursive, sans-serif"
        }}>
          <h1>哎呀，出了点小问题！</h1>
          <p>别担心，我们正在努力修复。请刷新页面或稍后再试。</p>
          <button onClick={() => window.location.reload()} style={{
            padding: '10px 20px',
            borderRadius: '25px',
            background: '#ffd166',
            border: 'none',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '20px'
          }}>
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 使用ReactDOM.createRoot渲染应用
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// 如果需要启用服务工作线程，可以使用以下方式
// 1. 取消注释下面的代码以启用基本的服务工作线程
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js').then(registration => {
//       console.log('SW已注册: ', registration);
//     }).catch(error => {
//       console.log('SW注册失败: ', error);
//     });
//   });
// }

// 如果你想开始测量应用性能，可以传递一个函数
// 来记录结果（例如：reportWebVitals(console.log)）
// 或发送到分析终端。了解更多：https://bit.ly/CRA-vitals
reportWebVitals();