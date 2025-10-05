import './App.css';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ContentHeader } from './components/ContentHeader/ContentHeader';

function App() {
  return (
    <div className="app-container">
      <Header />

      <main className="main-layout">
        {/* コンテンツ全体の白枠 */}
        <div className="content-wrapper">
          <ContentHeader />

          <div className="content-body">
            <Sidebar />
            <div className="main-calendar">
              {/* カレンダー本体 */}
              <p>カレンダー表示予定</p>
            </div>
          </div>

          <Footer />
        </div>
      </main>


    </div>
  );
}

export default App;
