import React, { useState } from 'react';
import './App.css';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ContentHeader } from './components/ContentHeader/ContentHeader';
import { CalendarView } from './components/Calendar/CalendarView';
import { TimeEntryModal } from './components/Modal/TimeEntryModal';

function App() {
  const [viewMode, setViewMode] = useState<'1日' | '3日' | '週'>('週');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

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

          <Footer />
        </div>
      </main>

      {/* ✅ モーダル */}
      <TimeEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        selectedDateTime={selectedDateTime} // 日時を渡す
      />
    </div>
  );
}

export default App;
