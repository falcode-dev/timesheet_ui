import React, { useState, useEffect } from 'react';
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
  // ✅ カレンダービュー
  const [calendarView, setCalendarView] = useState<'1日' | '3日' | '週'>('週');
  const [currentDate, setCurrentDate] = useState(new Date());

  // ✅ カレンダーイベント一覧
  const [events, setEvents] = useState<any[]>([]);

  // ✅ モーダル関連
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);
  const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);

  // ✅ Dataverse情報（画面表示用）
  const [dataverseInfo, setDataverseInfo] = useState<string>('読み込み中...');

  // ✅ proto_test1 リスト（対象WO選択用）
  const [workOrders, setWorkOrders] = useState<{ id: string; name: string }[]>([]);
  const [selectedWO, setSelectedWO] = useState<string>('');

  // ✅ 共通：Dataverse Xrm 参照を安全に取得
  const getXrm = (): any | null => {
    if ((window as any).Xrm) return (window as any).Xrm;
    if ((window.parent as any)?.Xrm) return (window.parent as any).Xrm;
    return null;
  };

  // ========= ✅ Dataverse ユーザー情報 & proto_test1 取得 ========= //
  useEffect(() => {
    const xrm = getXrm();
    if (!xrm) {
      setDataverseInfo('⚠️ Dataverse 環境外です（ローカル or 通常のWeb実行環境）。');
      return;
    }

    try {
      const globalCtx = xrm.Utility.getGlobalContext();
      const user = globalCtx.userSettings;
      const userId = user.userId.replace(/[{}]/g, '');

      let info = `✅ Dataverse 環境情報\n`;
      info += `環境URL: ${globalCtx.getClientUrl()}\n`;
      info += `ユーザー名: ${user.userName}\n`;
      info += `ユーザーID: ${user.userId}\n`;

      setDataverseInfo(info);

      // ✅ proto_test1 データ取得（作成者 = ユーザーID）
      const entityName = 'proto_test1s';
      const query = `?$select=proto_test1id,proto_name&$filter=_createdby_value eq ${userId}`;

      console.log('🧩 Dataverse Fetch Query:', query);

      xrm.WebApi.retrieveMultipleRecords(entityName, query)
        .then((result: any) => {
          console.log('✅ proto_test1 データ取得成功:', result);

          const woList = result.entities.map((item: any) => ({
            id: item.proto_test1id,
            name: item.proto_name || '(名称未設定)',
          }));

          setWorkOrders(woList);

          setDataverseInfo((prev) =>
            prev + `\n✅ proto_test1: ${woList.length} 件取得`
          );
        })
        .catch((error: any) => {
          console.error('❌ proto_test1 データ取得失敗:', error);
          setDataverseInfo('❌ proto_test1 データの取得に失敗しました。詳細はコンソールを確認してください。');
        });
    } catch (err) {
      console.error('⚠️ Dataverse 処理エラー:', err);
    }
  }, []);

  // ========= ✅ proto_test1 → proto_test2 の関連データを取得 ========= //
  useEffect(() => {
    const xrm = getXrm();
    if (!xrm) return;

    try {
      const userId = xrm.Utility.getGlobalContext().userSettings.userId.replace(/[{}]/g, '');
      const entityName = 'proto_workorder';
      const navigationName = 'proto_timeentry_wonumber_proto_workorder';

      const query =
        `?$select=proto_workorderid,createdon,_createdby_value` +
        `&$filter=_createdby_value eq ${userId}` +
        `&$expand=${navigationName}(` +
        `$select=proto_timeentryid,proto_startdatetime,proto_enddatetime,createdon,proto_name)`;

      console.log('🧩 Dataverse Fetch Query:', query);

      xrm.WebApi.retrieveMultipleRecords(entityName, query)
        .then((result: any) => {
          console.log('✅ proto_test2 データ取得成功:', result);

          const formattedEvents = result.entities.flatMap((p: any) =>
            (p[navigationName] || []).map((child: any) => ({
              id: child.proto_timeentryid,
              title: child.proto_name || '関連レコード',
              start: child.proto_startdatetime,
              end: child.proto_enddatetime,
            }))
          );

          setEvents(formattedEvents);

          setDataverseInfo((prev) =>
            prev + `\n✅ proto_test2: ${formattedEvents.length} 件のイベントを読み込みました。`
          );
        })
        .catch((error: any) => {
          console.error('❌ Dataverse データ取得失敗:', error);
          setDataverseInfo('❌ proto_test2 データの取得に失敗しました。');
        });
    } catch (err) {
      console.error('⚠️ Dataverse クエリ実行時エラー:', err);
    }
  }, []);

  // ========= カレンダー制御 ========= //
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

  // ========= 日付クリック（新規作成） ========= //
  const handleDateClick = (range: { start: Date; end: Date }) => {
    setSelectedEvent(null);
    setSelectedDateTime(range);
    setIsModalOpen(true);
  };

  // ========= イベントクリック（編集） ========= //
  const handleEventClick = (eventData: any) => {
    setSelectedEvent(eventData);
    setSelectedDateTime(null);
    setIsModalOpen(true);
  };

  // ========= 新しいタイムエントリ作成 ========= //
  const handleOpenNewEntry = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = minutes < 30 ? 0 : 30;

    const start = new Date(now);
    start.setMinutes(roundedMinutes, 0, 0);

    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    setSelectedEvent(null);
    setSelectedDateTime({ start, end });
    setIsModalOpen(true);
  };

  // ========= モーダルで作成・更新押下 ========= //
  const handleModalSubmit = (data: any) => {
    setEvents((prev) => {
      const exists = prev.find((e) => e.id === data.id);
      return exists ? prev.map((e) => (e.id === data.id ? data : e)) : [...prev, data];
    });
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedEvent(null);
      setSelectedDateTime(null);
    }, 300);
  };

  return (
    <div className="app-container">
      {/* ✅ Header に Dataverse の proto_test1 選択情報を渡す */}
      <Header
        workOrders={workOrders}
        selectedWO={selectedWO}
        setSelectedWO={setSelectedWO}
      />

      <main className="main-layout">
        <div className="content-wrapper">
          <ContentHeader
            calendarView={calendarView}
            onCalendarViewChange={setCalendarView}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
            currentDate={currentDate}
            onOpenNewEntry={handleOpenNewEntry}
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
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => {
            setSelectedEvent(null);
            setSelectedDateTime(null);
          }, 300);
        }}
        onSubmit={handleModalSubmit}
        selectedDateTime={selectedDateTime}
        selectedEvent={selectedEvent}
      />

      {/* ✅ お気に入りタスクモーダル */}
      <FavoriteTaskModal
        isOpen={isFavoriteModalOpen}
        onClose={() => setIsFavoriteModalOpen(false)}
        onSave={() => setIsFavoriteModalOpen(false)}
      />

      {/* ✅ ユーザー一覧モーダル */}
      <UserListModal
        isOpen={isUserListModalOpen}
        onClose={() => setIsUserListModalOpen(false)}
        onSave={() => setIsUserListModalOpen(false)}
      />
    </div>
  );
}

export default App;
