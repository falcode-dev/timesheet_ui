import React, { useState } from 'react';
import './App.css';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ContentHeader } from './components/ContentHeader/ContentHeader';
import { CalendarView } from './components/Calendar/CalendarView';
import { TimeEntryModal } from './components/Modal/TimeEntryModal';
import { FavoriteTaskModal } from './components/Modal/FavoriteTaskModal';
import { UserListModal } from './components/Modal/UserListModal';

function App() {
  const [viewMode, setViewMode] = useState<'1日' | '3日' | '週'>('週');
  const [currentDate, setCurrentDate] = useState(new Date());

  // ✅ カレンダーイベント一覧
  const [events, setEvents] = useState<any[]>([]);

  // ✅ モーダル関連
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<{ start: Date; end: Date } | null>(null);
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

  // ========= 日付クリック（範囲選択） ========= //
  const handleDateClick = (range: { start: Date; end: Date }) => {
    setSelectedDateTime(range);
    setIsModalOpen(true);
  };

  // ========= 「新しいタイムエントリを作成」クリック対応 ========= //
  const handleOpenNewEntry = () => {
    const start = new Date();
    start.setHours(9, 0, 0, 0);
    const end = new Date();
    end.setHours(10, 0, 0, 0);
    setSelectedDateTime({ start, end });
    setIsModalOpen(true);
  };

  // ========= モーダルで「作成」押下 ========= //
  const handleModalSubmit = (data: any) => {
    let start: Date;
    let end: Date;

    // 🧩 モーダル入力を優先
    if (data.startDate && data.startHour && data.startMinute) {
      const startStr = data.startDate.replace(/\//g, '-');
      const endStr = data.endDate.replace(/\//g, '-');
      start = new Date(`${startStr}T${data.startHour}:${data.startMinute}:00`);
      end = new Date(`${endStr}T${data.endHour}:${data.endMinute}:00`);
    } else if (selectedDateTime) {
      // 入力が空の場合のみ選択範囲を使う
      start = selectedDateTime.start;
      end = selectedDateTime.end;
    } else {
      // どちらもなければ現在時刻を仮設定
      start = new Date();
      end = new Date(start.getTime() + 60 * 60 * 1000);
    }

    const newEvent = {
      id: String(Date.now()),
      title: data.comment || '新しい予定',
      start,
      end,
    };

    setEvents((prev) => [...prev, newEvent]);
    setIsModalOpen(false);
    setSelectedDateTime(null);
  };


  // ========= お気に入り間接タスク ========= //
  const handleFavoriteSave = (tasks: string[]) => {
    console.log('お気に入り間接タスク:', tasks);
    setIsFavoriteModalOpen(false);
  };

  // ========= ユーザー一覧設定 ========= //
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
            // ✅ 新規ボタンでモーダルを開く
            onOpenNewEntry={handleOpenNewEntry}
          />

          <div className="content-body">
            <Sidebar />
            <div className="main-calendar">
              {/* ✅ カレンダーにイベント一覧を渡す */}
              <CalendarView
                viewMode={viewMode}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                onDateClick={handleDateClick}
                events={events}
              />
            </div>
          </div>

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

      {/* ✅ お気に入り間接タスクモーダル */}
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
