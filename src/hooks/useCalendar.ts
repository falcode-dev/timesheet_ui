import { useState } from 'react';

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
}

interface CalendarHook {
    events: CalendarEvent[];
    selectedEvent: CalendarEvent | null;
    selectedDateTime: { start: Date; end: Date } | null;
    isModalOpen: boolean;
    openNewEntry: () => void;
    handleDateClick: (range: { start: Date; end: Date }) => void;
    handleEventClick: (event: CalendarEvent) => void;
    handleModalSubmit: (data: CalendarEvent) => void;
    closeModal: () => void;
}

export const useCalendar = (): CalendarHook => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [selectedDateTime, setSelectedDateTime] = useState<{ start: Date; end: Date } | null>(null);

    // ✅ 新規作成ボタン
    const openNewEntry = () => {
        const now = new Date();
        const roundedMinutes = now.getMinutes() < 30 ? 0 : 30;
        const start = new Date(now);
        start.setMinutes(roundedMinutes, 0, 0);
        const end = new Date(start);
        end.setHours(end.getHours() + 1);

        setSelectedEvent(null);
        setSelectedDateTime({ start, end });
        setIsModalOpen(true);
    };

    // ✅ カレンダー日付クリック
    const handleDateClick = (range: { start: Date; end: Date }) => {
        setSelectedEvent(null);
        setSelectedDateTime(range);
        setIsModalOpen(true);
    };

    // ✅ イベントクリック（編集）
    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setSelectedDateTime(null);
        setIsModalOpen(true);
    };

    // ✅ モーダル保存処理
    const handleModalSubmit = (data: CalendarEvent) => {
        setEvents((prev) => {
            const exists = prev.find((e) => e.id === data.id);
            return exists ? prev.map((e) => (e.id === data.id ? data : e)) : [...prev, data];
        });
        closeModal();
    };

    // ✅ モーダル閉じる
    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setSelectedEvent(null);
            setSelectedDateTime(null);
        }, 300);
    };

    return {
        events,
        selectedEvent,
        selectedDateTime,
        isModalOpen,
        openNewEntry,
        handleDateClick,
        handleEventClick,
        handleModalSubmit,
        closeModal,
    };
};
