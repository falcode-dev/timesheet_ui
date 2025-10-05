import './App.css';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ContentHeader } from './components/ContentHeader/ContentHeader';

function App() {
  return (
    <div className="app-container">
      <Header />

      {/* ← コンテンツ全体 */}
      <main className="main-layout">
        {/* 上部にContentHeader */}
        <ContentHeader />

        {/* サイドバー + カレンダー */}
        <div className="content-body">
          <Sidebar />
          <div className="main-calendar">
            {/* カレンダー領域（後で本実装） */}
            <p>カレンダー表示予定</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
