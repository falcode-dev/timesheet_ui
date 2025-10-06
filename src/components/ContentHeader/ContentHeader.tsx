import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import './ContentHeader.css';

interface ContentHeaderProps {
    calendarView: '1日' | '3日' | '週';
    onCalendarViewChange: (mode: '1日' | '3日' | '週') => void;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
    currentDate: Date;
    onOpenNewEntry: () => void;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
    calendarView,
    onCalendarViewChange,
    onPrev,
    onNext,
    onToday,
    onOpenNewEntry,
}) => {
    // ✅ 独立したメインタブの状態
    const [mainTab, setMainTab] = useState<'ユーザー一覧' | '間接タスク'>('ユーザー一覧');

    const today = new Date();
    const todayStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

    return (
        <div className="content-header">
            <div className="content-left">
                {/* ✅ メインタブ：独立管理 */}
                <div className="content-tabs">
                    <button
                        className={`tab ${mainTab === 'ユーザー一覧' ? 'active' : ''}`}
                        onClick={() => setMainTab('ユーザー一覧')}
                    >
                        ユーザー一覧
                    </button>
                    <button
                        className={`tab ${mainTab === '間接タスク' ? 'active' : ''}`}
                        onClick={() => setMainTab('間接タスク')}
                    >
                        間接タスク
                    </button>
                </div>

                {/* ✅ 新しいタイムエントリ */}
                <button className="add-entry-button" onClick={onOpenNewEntry}>
                    <FaIcons.FaPlus className="icon" />
                    新しいタイムエントリを作成
                </button>
            </div>

            <div className="content-right">
                <button className="today-button" onClick={onToday}>
                    <FaIcons.FaCalendarAlt className="icon" /> 今日
                </button>

                <button className="arrow-button" onClick={onPrev}>
                    {'<'}
                </button>

                <button className="arrow-button" onClick={onNext}>
                    {'>'}
                </button>

                <div className="date-display">
                    {todayStr}
                    <FaIcons.FaRegCalendarAlt className="date-icon" />
                </div>

                {/* ✅ ビュー切り替えは別 state */}
                <div className="view-tabs">
                    {['1日', '3日', '週'].map((v) => (
                        <button
                            key={v}
                            className={`view-tab ${calendarView === v ? 'active' : ''}`}
                            onClick={() => onCalendarViewChange(v as '1日' | '3日' | '週')}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
