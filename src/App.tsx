import React, { useState } from 'react';
import './App.css';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ContentHeader } from './components/ContentHeader/ContentHeader';
import { CalendarView } from './components/Calendar/CalendarView';
import { TimeEntryModal } from './components/Modal/TimeEntryModal';
import { FavoriteTaskModal } from './components/Modal/FavoriteTaskModal'; // ✅ 追加

function App() {
  const [viewMode, setViewMode] = useState<'1日' | '3日' | '週'>('週');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  // ✅ 「お気に入り間接タスク設定」モーダルの状態管理
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - (viewMode === '週' ? 7 : viewMode === '3日' ? 3 : 1));
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (viewMode === '週' ? 7 : viewMode === '3日' ? 3 : 1));
    setCurrentDate(newDate);
  };

  const handleToday = () => setCurrentDate(new Date());

  // ✅ カレンダークリックでモーダルを開く
  const handleDateClick = (date: Date) => {
    setSelectedDateTime(date);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: any) => {
    console.log('Time Entry 作成:', { ...data, date: selectedDateTime });
    setIsModalOpen(false);
  };

  // ✅ お気に入り間接タスク保存処理
  const handleFavoriteSave = (tasks: string[]) => {
    console.log('お気に入り間接タスク:', tasks);
    setIsFavoriteModalOpen(false);
  };

  return (
    <div className="app-container">
      <Header />

      <main className="main-layout">
        <div className="content-wrapper">
          <ContentHeader
            viewMode={viewMode}
            onViewChange={setViewMode}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
            currentDate={currentDate}
          />

          <div className="content-body">
            <Sidebar />
            <div className="main-calendar">
              <CalendarView
                viewMode={viewMode}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                onDateClick={handleDateClick} // ✅ カレンダークリックイベント
              />
            </div>
          </div>

          {/* ✅ Footerにモーダル開閉関数を渡す */}
          <Footer onOpenFavoriteModal={() => setIsFavoriteModalOpen(true)} />
        </div>
      </main>

      {/* ✅ タイムエントリモーダル */}
      <TimeEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        selectedDateTime={selectedDateTime} // 日時を渡す
      />

      {/* ✅ お気に入り間接タスク設定モーダル */}
      <FavoriteTaskModal
        isOpen={isFavoriteModalOpen}
        onClose={() => setIsFavoriteModalOpen(false)}
        onSave={handleFavoriteSave}
      />
    </div>
  );
}

export default App;
