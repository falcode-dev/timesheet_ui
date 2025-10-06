import React, { useRef, useEffect } from 'react';
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
    onDateClick?: (range: { start: Date; end: Date }) => void;
    events: any[]; // ✅ 追加
}

export const CalendarView: React.FC<CalendarViewProps> = ({
    viewMode,
    currentDate,
    onDateChange,
    onDateClick,
    events,
}) => {
    const calendarRef = useRef<FullCalendar>(null);

    /** ✅ 範囲選択 or クリック時 */
    const handleDateSelect = (selectInfo: DateSelectArg) => {
        const start = selectInfo.start;
        const end = selectInfo.end ?? new Date(start.getTime() + 60 * 60 * 1000);
        onDateClick?.({ start, end });
    };

    /** ✅ イベント削除 */
    const handleEventClick = (clickInfo: EventClickArg) => {
        if (window.confirm(`「${clickInfo.event.title}」を削除しますか？`)) {
            clickInfo.event.remove();
        }
    };

    /** ✅ ビュー切り替え */
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
            default:
                api.changeView('timeGridWeek');
                break;
        }
    }, [viewMode, currentDate]);

    /** ✅ ResizeObserverで安全に再描画 */
    useEffect(() => {
        const el = document.querySelector('.calendar-wrapper');
        if (!el) return;

        const observer = new ResizeObserver(() => {
            const api = calendarRef.current?.getApi();
            if (api) api.updateSize();
        });
        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="calendar-wrapper">
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                selectable
                selectMirror
                select={handleDateSelect}
                eventClick={handleEventClick}
                events={events} // ✅ ここで表示
                headerToolbar={false}
                allDaySlot={false}
                slotDuration="00:30:00"
                height="100%"
                nowIndicator
                slotMinTime="00:00:00"
                slotMaxTime="24:00:00"
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
