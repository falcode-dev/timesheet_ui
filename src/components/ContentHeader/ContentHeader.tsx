import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import './ContentHeader.css';
import { TimeEntryModal } from '../Modal/TimeEntryModal';

interface ContentHeaderProps {
    viewMode: '1日' | '3日' | '週';
    onViewChange: (mode: '1日' | '3日' | '週') => void;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
    currentDate: Date;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
    viewMode,
    onViewChange,
    onPrev,
    onNext,
    onToday,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ✅ 常に今日の日付を表示（固定）
    const today = new Date();
    const todayStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(
        today.getDate()
    ).padStart(2, '0')}`;

    const handleCreateEntry = (data: any) => {
        console.log('作成データ:', data);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="content-header">
                {/* 左エリア */}
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

                    {/* 新しいタイムエントリボタン */}
                    <button
                        className="add-entry-button"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FaIcons.FaPlus className="icon" />
                        新しいタイムエントリを作成
                    </button>
                </div>

                {/* 右エリア */}
                <div className="content-right">
                    <button className="today-button" onClick={onToday}>
                        <FaIcons.FaCalendarAlt className="icon" />
                        今日
                    </button>

                    <button className="arrow-button" onClick={onPrev}>
                        {'<'}
                    </button>

                    <button className="arrow-button" onClick={onNext}>
                        {'>'}
                    </button>

                    {/* ✅ 検索欄風の日付表示 */}
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

            {/* モーダル */}
            <TimeEntryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateEntry}
            />
        </>
    );
};
