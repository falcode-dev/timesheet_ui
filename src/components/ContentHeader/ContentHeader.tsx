import React from 'react';
import * as FaIcons from 'react-icons/fa';
import './ContentHeader.css';

interface ContentHeaderProps {
    viewMode: '1日' | '3日' | '週';
    onViewChange: (mode: '1日' | '3日' | '週') => void;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
    currentDate: Date;
    onOpenNewEntry: () => void; // ✅ 追加
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
    viewMode,
    onViewChange,
    onPrev,
    onNext,
    onToday,
    onOpenNewEntry,
}) => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

    return (
        <div className="content-header">
            <div className="content-left">
                <div className="content-tabs">
                    <button
                        className={`tab ${viewMode === '週' ? 'active' : ''}`}
                        onClick={() => onViewChange('週')}
                    >
                        ユーザー一覧
                    </button>
                    <button
                        className={`tab ${viewMode === '3日' ? 'active' : ''}`}
                        onClick={() => onViewChange('3日')}
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

                <div className="view-tabs">
                    {['1日', '3日', '週'].map((v) => (
                        <button
                            key={v}
                            className={`view-tab ${viewMode === v ? 'active' : ''}`}
                            onClick={() => onViewChange(v as '1日' | '3日' | '週')}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
