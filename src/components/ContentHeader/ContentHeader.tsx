import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import './ContentHeader.css';

export const ContentHeader: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'user' | 'task'>('user');
    const [viewMode, setViewMode] = useState<'1日' | '3日' | '週'>('週');

    const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');

    return (
        <div className="content-header">
            {/* 左エリア */}
            <div className="content-left">
                <div className="content-tabs">
                    <button
                        className={`tab ${activeTab === 'user' ? 'active' : ''}`}
                        onClick={() => setActiveTab('user')}
                    >
                        ユーザー一覧
                    </button>
                    <button
                        className={`tab ${activeTab === 'task' ? 'active' : ''}`}
                        onClick={() => setActiveTab('task')}
                    >
                        間接タスク
                    </button>
                </div>

                <button className="add-entry-button">
                    <FaIcons.FaPlus className="icon" />
                    新しいタイムエントリを作成
                </button>
            </div>

            {/* 右エリア */}
            <div className="content-right">
                <button className="today-button">
                    <FaIcons.FaCalendarAlt className="icon" />
                    今日
                </button>

                {/* ← 修正：独立した矢印ボタン */}
                <button className="arrow-button">{'<'}</button>

                <div className="date-display">
                    {today}
                    <FaIcons.FaRegCalendarAlt className="date-icon" />
                </div>

                <button className="arrow-button">{'>'}</button>

                <div className="view-tabs">
                    {['1日', '3日', '週'].map((v) => (
                        <button
                            key={v}
                            className={`view-tab ${viewMode === v ? 'active' : ''}`}
                            onClick={() => setViewMode(v as any)}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
