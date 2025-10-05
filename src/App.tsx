import React, { useState } from 'react';
import './App.css';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ContentHeader } from './components/ContentHeader/ContentHeader';
import { CalendarView } from './components/Calendar/CalendarView';

function App() {
  const [viewMode, setViewMode] = useState<'1日' | '3日' | '週'>('週');
  const [currentDate, setCurrentDate] = useState(new Date());

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
              />
            </div>
          </div>

          <Footer />
        </div>
      </main>

    </div>
  );
}

export default App;
