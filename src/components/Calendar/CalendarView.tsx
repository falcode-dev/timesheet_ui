import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './CalendarView.css';

export const CalendarView: React.FC<{
    viewMode: '1日' | '3日' | '週';
    currentDate: Date;
    onDateChange: (newDate: Date) => void;
}> = ({ viewMode, currentDate }) => {
    const calendarRef = useRef<FullCalendar>(null);
    const [events, setEvents] = useState<any[]>([]);

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        const title = prompt('タイムエントリ名を入力してください:');
        if (title) {
            setEvents((prev) => [
                ...prev,
                {
                    id: String(Date.now()),
                    title,
                    start: selectInfo.startStr,
                    end: selectInfo.endStr,
                },
            ]);
        }
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        if (window.confirm(`「${clickInfo.event.title}」を削除しますか？`)) {
            setEvents((prev) => prev.filter((e) => e.id !== clickInfo.event.id));
        }
    };

    useEffect(() => {
        const api = calendarRef.current?.getApi();
        if (!api) return;

        api.gotoDate(currentDate);

        switch (viewMode) {
            case '1日':
                api.changeView('timeGridDay');
                break;
            case '3日':
                api.changeView('timeGridThreeDay'); // ✅ durationはここで定義したviewを使用
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
                select={handleDateSelect}
                eventClick={handleEventClick}
                events={events}
                headerToolbar={false}
                allDaySlot={false}
                slotDuration="00:30:00"
                height="100%"
                nowIndicator={true}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                locale="ja"
                /* ✅ ここで3日ビューを定義 */
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
