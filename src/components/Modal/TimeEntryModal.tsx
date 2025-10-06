import React, { useState, useEffect, useRef } from 'react';
import * as FaIcons from 'react-icons/fa';
import './TimeEntryModal.css';

interface TimeEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    selectedDateTime?: { start: Date; end: Date } | null;
}

export const TimeEntryModal: React.FC<TimeEntryModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    selectedDateTime,
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [comment, setComment] = useState('');
    const maxLength = 2000;

    const [startDate, setStartDate] = useState('');
    const [startHour, setStartHour] = useState('');
    const [startMinute, setStartMinute] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endHour, setEndHour] = useState('');
    const [endMinute, setEndMinute] = useState('');

    // 🔹 date input 参照を保持（アイコンクリックで showPicker() するため）
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);

    // ✅ 初期表示：カレンダー範囲を反映
    useEffect(() => {
        if (selectedDateTime) {
            const { start, end } = selectedDateTime;

            const startYMD = start.toISOString().split('T')[0];
            const endYMD = end.toISOString().split('T')[0];

            setStartDate(startYMD);
            setStartHour(start.getHours().toString().padStart(2, '0'));
            setStartMinute(start.getMinutes().toString().padStart(2, '0'));
            setEndDate(endYMD);
            setEndHour(end.getHours().toString().padStart(2, '0'));
            setEndMinute(end.getMinutes().toString().padStart(2, '0'));
        } else {
            setStartDate('');
            setStartHour('');
            setStartMinute('');
            setEndDate('');
            setEndHour('');
            setEndMinute('');
        }
    }, [selectedDateTime]);

    // ✅ モーダル開閉アニメーション制御
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

    return (
        <div className={`modal-overlay ${isVisible ? 'fade-in' : 'fade-out'}`}>
            <div className={`modal-content ${isVisible ? 'fade-in' : 'fade-out'}`}>
                {/* ヘッダー */}
                <div className="modal-header">
                    <h3 className="modal-title">新しいタイムエントリを作成</h3>
                </div>

                {/* 本文 */}
                <div className="modal-body">
                    <p className="modal-description">
                        Time Entry の基本情報を入力して作成を押してください。
                    </p>

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
                        <button
                            className="btn-create"
                            onClick={() =>
                                onSubmit({
                                    startDate,
                                    startHour,
                                    startMinute,
                                    endDate,
                                    endHour,
                                    endMinute,
                                    comment,
                                })
                            }
                        >
                            作成
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
