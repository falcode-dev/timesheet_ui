import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// アプリでパフォーマンス測定を開始する場合は、結果をログに記録する関数（例: reportWebVitals(console.log)）を
// 渡すか、分析エンドポイントに送信してください。詳細はこちら: https://bit.ly/CRA-vitals
reportWebVitals();