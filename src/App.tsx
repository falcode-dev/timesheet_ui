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
import { useDataverse } from './hooks/useDataverse';
import { useCalendar } from './hooks/useCalendar';

function App() {
  const { dataverseInfo, workOrders, events: dataverseEvents, selectedWO, setSelectedWO } = useDataverse();
  const {
    events,
    selectedEvent,
    selectedDateTime,
    isModalOpen,
    openNewEntry,
    handleDateClick,
    handleEventClick,
    handleModalSubmit,
    closeModal,
  } = useCalendar();

  const [calendarView, setCalendarView] = useState<'1日' | '3日' | '週'>('週');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);
  const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - (calendarView === '週' ? 7 : calendarView === '3日' ? 3 : 1));
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (calendarView === '週' ? 7 : calendarView === '3日' ? 3 : 1));
    setCurrentDate(newDate);
  };

  const handleToday = () => setCurrentDate(new Date());

  return (
    <div className="app-container">
      <Header workOrders={workOrders} selectedWO={selectedWO} setSelectedWO={setSelectedWO} />

      <main className="main-layout">
        <div className="content-wrapper">
          <ContentHeader
            calendarView={calendarView}
            onCalendarViewChange={setCalendarView}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
            currentDate={currentDate}
            onOpenNewEntry={openNewEntry}
          />

          <div className="content-body">
            <Sidebar />
            <div className="main-calendar">
              <CalendarView
                viewMode={calendarView}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                events={[...dataverseEvents, ...events]} // ✅ Dataverse＋ローカル登録両方
              />
            </div>
          </div>

          <Footer
            onOpenFavoriteModal={() => setIsFavoriteModalOpen(true)}
            onOpenUserListModal={() => setIsUserListModalOpen(true)}
          />
        </div>
      </main>

      <TimeEntryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        selectedDateTime={selectedDateTime}
        selectedEvent={selectedEvent}
        workOrders={workOrders} // ✅ Dataverseで取得したWOを渡す
      />

      <FavoriteTaskModal
        isOpen={isFavoriteModalOpen}
        onClose={() => setIsFavoriteModalOpen(false)}
        onSave={() => setIsFavoriteModalOpen(false)}
      />

      <UserListModal
        isOpen={isUserListModalOpen}
        onClose={() => setIsUserListModalOpen(false)}
        onSave={() => setIsUserListModalOpen(false)}
      />
    </div>
  );
}

export default App;
