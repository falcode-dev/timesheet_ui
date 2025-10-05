import React, { useState } from 'react';
import './App.css';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ContentHeader } from './components/ContentHeader/ContentHeader';
import { CalendarView } from './components/Calendar/CalendarView';
import { TimeEntryModal } from './components/Modal/TimeEntryModal';
import { FavoriteTaskModal } from './components/Modal/FavoriteTaskModal';
import { UserListModal } from './components/Modal/UserListModal'; // ✅ 追加

function App() {
  const [viewMode, setViewMode] = useState<'1日' | '3日' | '週'>('週');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  // ✅ モーダル管理
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);
  const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);

  // ========= カレンダー制御 ========= //
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

  // ========= タイムエントリモーダル ========= //
  const handleDateClick = (date: Date) => {
    setSelectedDateTime(date);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: any) => {
    console.log('Time Entry 作成:', { ...data, date: selectedDateTime });
    setIsModalOpen(false);
  };

  // ========= お気に入り間接タスクモーダル ========= //
  const handleFavoriteSave = (tasks: string[]) => {
    console.log('お気に入り間接タスク:', tasks);
    setIsFavoriteModalOpen(false);
  };

  // ========= ユーザー一覧設定モーダル ========= //
  const handleUserListSave = (users: string[]) => {
    console.log('ユーザー一覧設定:', users);
    setIsUserListModalOpen(false);
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
                onDateClick={handleDateClick}
              />
            </div>
          </div>

          {/* ✅ Footerにモーダル開閉関数を渡す */}
          <Footer
            onOpenFavoriteModal={() => setIsFavoriteModalOpen(true)}
            onOpenUserListModal={() => setIsUserListModalOpen(true)}
          />
        </div>
      </main>

      {/* ✅ タイムエントリモーダル */}
      <TimeEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        selectedDateTime={selectedDateTime}
      />

      {/* ✅ お気に入り間接タスク設定モーダル */}
      <FavoriteTaskModal
        isOpen={isFavoriteModalOpen}
        onClose={() => setIsFavoriteModalOpen(false)}
        onSave={handleFavoriteSave}
      />

      {/* ✅ ユーザー一覧設定モーダル */}
      <UserListModal
        isOpen={isUserListModalOpen}
        onClose={() => setIsUserListModalOpen(false)}
        onSave={handleUserListSave}
      />
    </div>
  );
}

export default App;
