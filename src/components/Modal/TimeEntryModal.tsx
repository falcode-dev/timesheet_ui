import React, { useState, useEffect, useRef } from 'react';
import * as FaIcons from 'react-icons/fa';
import './TimeEntryModal.css';

interface TimeEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    onDelete?: (id: string) => void;
    selectedDateTime?: { start: Date; end: Date } | null;
    selectedEvent?: any | null;
}

export const TimeEntryModal: React.FC<TimeEntryModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    onDelete,
    selectedDateTime,
    selectedEvent,
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const maxLength = 2000;

    const [startDate, setStartDate] = useState('');
    const [startHour, setStartHour] = useState('');
    const [startMinute, setStartMinute] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endHour, setEndHour] = useState('');
    const [endMinute, setEndMinute] = useState('');

    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);

    // ✅ ローカル日付を YYYY-MM-DD 形式でフォーマット（日本時間対応）
    const formatLocalDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // ✅ 初期化（イベント or 新規）
    useEffect(() => {
        if (!isOpen) return;

        // ✅ 1. 編集モード（イベントクリック時）
        if (selectedEvent) {
            const start = new Date(selectedEvent.start);
            const end = new Date(selectedEvent.end);

            setTitle(selectedEvent.title || '');
            setComment(selectedEvent.extendedProps?.comment || '');
            setStartDate(formatLocalDate(start));
            setStartHour(start.getHours().toString().padStart(2, '0'));
            setStartMinute(start.getMinutes().toString().padStart(2, '0'));
            setEndDate(formatLocalDate(end));
            setEndHour(end.getHours().toString().padStart(2, '0'));
            setEndMinute(end.getMinutes().toString().padStart(2, '0'));
        }

        // ✅ 2. カレンダークリック時（クリックした時間帯を反映）
        else if (selectedDateTime) {
            const { start, end } = selectedDateTime;
            setTitle('');
            setComment('');
            setStartDate(formatLocalDate(start));
            setStartHour(start.getHours().toString().padStart(2, '0'));
            setStartMinute(start.getMinutes().toString().padStart(2, '0'));
            setEndDate(formatLocalDate(end));
            setEndHour(end.getHours().toString().padStart(2, '0'));
            setEndMinute(end.getMinutes().toString().padStart(2, '0'));
        }

        // ✅ 3. 新規作成ボタン（現在時刻を30分単位に丸め）
        else {
            const now = new Date();
            const minutes = now.getMinutes();
            const roundedMinutes = minutes < 30 ? 0 : 30;

            const roundedStart = new Date(now);
            roundedStart.setMinutes(roundedMinutes, 0, 0);

            const roundedEnd = new Date(roundedStart);
            roundedEnd.setHours(roundedEnd.getHours() + 1);

            setTitle('');
            setComment('');
            setStartDate(formatLocalDate(roundedStart));
            setStartHour(roundedStart.getHours().toString().padStart(2, '0'));
            setStartMinute(roundedStart.getMinutes().toString().padStart(2, '0'));
            setEndDate(formatLocalDate(roundedEnd));
            setEndHour(roundedEnd.getHours().toString().padStart(2, '0'));
            setEndMinute(roundedEnd.getMinutes().toString().padStart(2, '0'));
        }
    }, [isOpen, selectedEvent, selectedDateTime]);

    // ✅ モーダル開閉アニメーション
    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else if (!isOpen && isMounted) {
            setIsVisible(false);
            const timer = setTimeout(() => setIsMounted(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, isMounted]);

    if (!isMounted) return null;

    const handleSave = () => {
        const start = new Date(`${startDate}T${startHour}:${startMinute}`);
        const end = new Date(`${endDate}T${endHour}:${endMinute}`);

        const data = {
            id: selectedEvent?.id || Date.now().toString(),
            title: title || '無題のイベント',
            start,
            end,
            extendedProps: { comment },
        };
        onSubmit(data);
        onClose();
    };

    const handleDelete = () => {
        if (selectedEvent && onDelete) {
            if (window.confirm(`「${selectedEvent.title}」を削除しますか？`)) {
                onDelete(selectedEvent.id);
                onClose();
            }
        }
    };

    return (
        <div className={`modal-overlay ${isVisible ? 'fade-in' : 'fade-out'}`}>
            <div className={`modal-content ${isVisible ? 'fade-in' : 'fade-out'}`}>
                {/* ヘッダー */}
                <div className="modal-header">
                    <h3 className="modal-title">
                        {selectedEvent ? 'イベントを編集' : '新しいタイムエントリを作成'}
                    </h3>
                </div>

                {/* 本文 */}
                <div className="modal-body">
                    <p className="modal-description">
                        {selectedEvent
                            ? '選択したイベントを編集できます。'
                            : 'Time Entry の基本情報を入力して作成を押してください。'}
                    </p>

                    {/* ✅ タイトル */}
                    <label className="modal-label">タイトル</label>
                    <div className="modal-select full-width">
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="タイトルを入力"
                        />
                    </div>

                    {/* WO番号 */}
                    <label className="modal-label">WO番号</label>
                    <div className="modal-select full-width">
                        <input type="text" placeholder="WOを選択" readOnly />
                        <FaIcons.FaChevronDown className="icon" />
                    </div>

                    <div className="modal-grid">
                        {/* 左カラム */}
                        <div className="grid-left">
                            {/* 開始日 */}
                            <label className="modal-label">スケジュール開始日</label>
                            <div className="datetime-row">
                                <div className="date-input">
                                    <input
                                        ref={startDateRef}
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <FaIcons.FaRegCalendarAlt
                                        className="icon clickable"
                                        onClick={() => startDateRef.current?.showPicker?.()}
                                    />
                                </div>
                                <div className="time-input">
                                    <input
                                        type="number"
                                        min="0"
                                        max="23"
                                        value={startHour}
                                        onChange={(e) => setStartHour(e.target.value)}
                                    />
                                </div>
                                <span>：</span>
                                <div className="minute-input">
                                    <input
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={startMinute}
                                        onChange={(e) => setStartMinute(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* 終了日 */}
                            <label className="modal-label">スケジュール終了日</label>
                            <div className="datetime-row">
                                <div className="date-input">
                                    <input
                                        ref={endDateRef}
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                    <FaIcons.FaRegCalendarAlt
                                        className="icon clickable"
                                        onClick={() => endDateRef.current?.showPicker?.()}
                                    />
                                </div>
                                <div className="time-input">
                                    <input
                                        type="number"
                                        min="0"
                                        max="23"
                                        value={endHour}
                                        onChange={(e) => setEndHour(e.target.value)}
                                    />
                                </div>
                                <span>：</span>
                                <div className="minute-input">
                                    <input
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={endMinute}
                                        onChange={(e) => setEndMinute(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* EndUser */}
                            <label className="modal-label">EndUser</label>
                            <div className="enduser-combined">
                                <input type="text" placeholder="エンドユーザーを入力" />
                                <FaIcons.FaChevronDown className="enduser-icon" />
                            </div>

                            {/* Location */}
                            <label className="modal-label">Location</label>
                            <div className="modal-select full-width">
                                <input type="text" placeholder="場所を選択" readOnly />
                                <FaIcons.FaChevronDown className="icon" />
                            </div>

                            {/* リソース */}
                            <div className="resource-header">
                                <label className="modal-label">リソース</label>
                                <a href="#" className="resource-link">
                                    リソース選択
                                </a>
                            </div>
                            <textarea placeholder="リソースの詳細を入力" rows={4}></textarea>
                        </div>

                        {/* 右カラム */}
                        <div className="grid-right">
                            <label className="modal-label">タイムカテゴリ</label>
                            <div className="modal-select">
                                <input type="text" placeholder="選択してください" readOnly />
                                <FaIcons.FaChevronDown className="icon" />
                            </div>

                            <label className="modal-label">カテゴリ</label>
                            <div className="modal-select">
                                <input type="text" placeholder="選択してください" readOnly />
                                <FaIcons.FaChevronDown className="icon" />
                            </div>

                            <label className="modal-label">ペイメントタイプ</label>
                            <div className="modal-select disabled">
                                <input type="text" placeholder="自動設定" readOnly />
                            </div>

                            <label className="modal-label">サブカテゴリ</label>
                            <div className="modal-select disabled">
                                <input type="text" placeholder="自動設定" readOnly />
                            </div>

                            <label className="modal-label">タスク</label>
                            <div className="modal-select">
                                <input type="text" placeholder="選択してください" readOnly />
                                <FaIcons.FaChevronDown className="icon" />
                            </div>

                            <label className="modal-label">コメント</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                maxLength={maxLength}
                                placeholder="コメントを入力"
                                rows={4}
                            />
                            <div className="char-count">
                                {comment.length}/{maxLength}
                            </div>
                        </div>
                    </div>
                </div>

                {/* フッター */}
                <div className="modal-footer">
                    <div className="footer-right">
                        <button className="btn-cancel" onClick={onClose}>
                            キャンセル
                        </button>
                        <button className="btn-create" onClick={handleSave}>
                            {selectedEvent ? '更新' : '作成'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
