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

            {/* チェックボックス：自分 */}
            <div className="sidebar-self">
                <label>
                    <input type="checkbox" defaultChecked />
                    社員番号（自分）
                </label>
                <div className="sidebar-self-name">社員名 XXX XXX</div>
            </div>

            <div className="sidebar-divider">
                <FaIcons.FaChevronDown className="sidebar-icon" />
            </div>

            {/* 検索結果 */}
            <div className="sidebar-results">
                {filtered.map((u) => (
                    <div key={u.id} className="sidebar-user">
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedUsers.some((s) => s.id === u.id)}
                                onChange={() => toggleUser(u)}
                            />
                            {searchType === 'name'
                                ? `${u.name}（${u.number}）`
                                : `${u.number}：${u.name}`}
                        </label>
                    </div>
                ))}
            </div>

            {/* 選択済みユーザー */}
            <div className="sidebar-favorites">
                <div className="sidebar-fav-header">
                    <FaIcons.FaStar className="sidebar-icon-star" /> 選択済みユーザー
                </div>
                <ul>
                    {selectedUsers.map((u) => (
                        <li key={u.id} className="sidebar-fav-item">
                            {u.name}（{u.number}）
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};
