import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import './CalendarView.css';

interface CalendarViewProps {
    viewMode: '1日' | '3日' | '週';
    currentDate: Date;
    onDateChange: (newDate: Date) => void;
    onDateClick?: (date: Date) => void; // ✅ カレンダークリック通知
}

export const CalendarView: React.FC<CalendarViewProps> = ({
    viewMode,
    currentDate,
    onDateChange,
    onDateClick,
}) => {
    const calendarRef = useRef<FullCalendar>(null);
    const [events, setEvents] = useState<any[]>([]);

    /** ✅ 範囲選択 or クリックで App に通知 */
    const handleDateSelect = (selectInfo: DateSelectArg) => {
        onDateClick?.(selectInfo.start); // ✅ モーダルは App 側で開く
    };

    /** ✅ イベントクリックで削除確認 */
    const handleEventClick = (clickInfo: EventClickArg) => {
        if (window.confirm(`「${clickInfo.event.title}」を削除しますか？`)) {
            setEvents((prev) => prev.filter((e) => e.id !== clickInfo.event.id));
        }
    };

    /** ✅ ビュー切り替え処理 */
    useEffect(() => {
        const api = calendarRef.current?.getApi();
        if (!api) return;

        api.gotoDate(currentDate);

        switch (viewMode) {
            case '1日':
                api.changeView('timeGridDay');
                break;
            case '3日':
                api.changeView('timeGridThreeDay');
                break;
            case '週':
            default:
                api.changeView('timeGridWeek');
                break;
        }
    }, [viewMode, currentDate]);

    return (
        <div className="calendar-wrapper">
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                selectable={true}
                selectMirror={true}
                select={handleDateSelect} // ✅ 通知のみ
                eventClick={handleEventClick}
                events={events}
                headerToolbar={false}
                allDaySlot={false}
                slotDuration="00:30:00"
                height="100%"
                nowIndicator={true}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                locale={jaLocale}
                views={{
                    timeGridThreeDay: {
                        type: 'timeGrid',
                        duration: { days: 3 },
                        buttonText: '3日',
                    },
                }}
            />
        </div>
    );
};
