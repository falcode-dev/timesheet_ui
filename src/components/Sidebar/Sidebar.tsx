import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import './Sidebar.css';

interface User {
    id: number;
    name: string;
    number: string;
}

export const Sidebar: React.FC = () => {
    const [searchType, setSearchType] = useState<'name' | 'number'>('name');
    const [query, setQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const mockUsers: User[] = [
        { id: 1, name: '田中 太郎', number: '001' },
        { id: 2, name: '佐藤 花子', number: '002' },
        { id: 3, name: '山田 健', number: '003' },
    ];

    const filtered = mockUsers.filter((u) =>
        searchType === 'name'
            ? u.name.includes(query)
            : u.number.includes(query)
    );

    const toggleUser = (user: User) => {
        const exists = selectedUsers.some((s) => s.id === user.id);
        if (exists) {
            setSelectedUsers(selectedUsers.filter((s) => s.id !== user.id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    return (
        <aside className="sidebar-container">
            <h2 className="sidebar-title">検索</h2>

            {/* ラジオボタン */}
            <div className="sidebar-radios">
                <label>
                    <input
                        type="radio"
                        name="searchType"
                        value="name"
                        checked={searchType === 'name'}
                        onChange={() => setSearchType('name')}
                    />
                    ユーザー名
                </label>
                <label>
                    <input
                        type="radio"
                        name="searchType"
                        value="number"
                        checked={searchType === 'number'}
                        onChange={() => setSearchType('number')}
                    />
                    社員番号
                </label>
            </div>

            {/* 検索欄 */}
            <input
                type="text"
                className="sidebar-search"
                placeholder="検索ワードを入力"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {/* 自分情報 */}
            <div className="sidebar-self-top">
                <input type="checkbox" checked readOnly className="sidebar-self-checkbox" />
                <div className="sidebar-self-text">
                    <span className="sidebar-self-number">社員番号（自分）</span>
                    <span className="sidebar-self-roman">TARO TANAKA</span>
                </div>
            </div>

            <div className="sidebar-self-divider">
                <FaIcons.FaChevronDown className="sidebar-self-icon" />
                <span className="sidebar-self-label">ユーザー名</span>
                <FaIcons.FaTasks className="sidebar-self-icon" />
            </div>
        </aside>
    );
};
