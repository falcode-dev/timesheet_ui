import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import './FavoriteTaskModal.css'; // 既存のCSSを再利用（同じデザイン）

interface UserListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedUsers: string[]) => void;
}

export const UserListModal: React.FC<UserListModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [userName, setUserName] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([
        '田中 太郎',
        '佐藤 花子',
        '鈴木 次郎',
        '高橋 美咲',
        '山本 健',
    ]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [checkedResults, setCheckedResults] = useState<string[]>([]);

    // 🧩 フェードアニメーション制御
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

    // ✅ チェックボックス制御
    const toggleCheck = (user: string) => {
        setCheckedResults((prev) =>
            prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
        );
    };

    // ✅ 「＞」ボタンで右側に追加
    const moveToSelected = () => {
        const newSelected = [...selectedUsers];
        checkedResults.forEach((user) => {
            if (!newSelected.includes(user)) newSelected.push(user);
        });
        setSelectedUsers(newSelected);
        setCheckedResults([]);
    };

    // ✅ 「×」で削除
    const removeUser = (user: string) => {
        setSelectedUsers((prev) => prev.filter((u) => u !== user));
    };

    return (
        <div className={`modal-overlay ${isVisible ? 'fade-in' : 'fade-out'}`}>
            <div className={`modal-content ${isVisible ? 'fade-in' : 'fade-out'}`}>
                {/* ヘッダー */}
                <div className="modal-header">
                    <h3 className="modal-title">ユーザー 一覧設定</h3>
                </div>

                {/* 本文 */}
                <div className="modal-body">
                    <p className="modal-description">
                        追加したいユーザーを検索してください。
                    </p>

                    {/* 上部検索グリッド */}
                    <div className="modal-grid">
                        {/* 左グリッド */}
                        <div className="grid-left">
                            <label className="modal-label">社員番号</label>
                            <div className="modal-select">
                                <input
                                    type="text"
                                    placeholder="社員番号を入力"
                                    value={employeeNumber}
                                    onChange={(e) => setEmployeeNumber(e.target.value)}
                                />
                                <FaIcons.FaChevronDown className="icon" />
                            </div>
                            <div className="right-align">
                                <button className="btn-clear" onClick={() => setEmployeeNumber('')}>
                                    クリア
                                </button>
                            </div>
                        </div>

                        {/* 右グリッド */}
                        <div className="grid-right">
                            <label className="modal-label">ユーザー名</label>
                            <div className="modal-select">
                                <input
                                    type="text"
                                    placeholder="ユーザー名を入力"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                                <FaIcons.FaChevronDown className="icon" />
                            </div>
                            <div className="left-align">
                                <button className="btn-search">検索</button>
                            </div>
                        </div>
                    </div>

                    <hr className="divider" />

                    <p className="modal-description">
                        検索結果の項目を選択して追加し保存を押してください。
                    </p>

                    {/* 下部リストエリア */}
                    <div className="task-grid">
                        {/* 左：検索結果 */}
                        <div className="task-list">
                            <div className="list-header">
                                <span className="modal-label">検索結果</span>
                                <span className="count">{searchResults.length}件</span>
                            </div>
                            <div className="list-subheader">
                                <FaIcons.FaCheckSquare className="icon" />
                                <FaIcons.FaChevronDown className="icon" />
                                <span>ユーザー名</span>
                            </div>
                            <div
                                className={`list-box ${searchResults.length === 0 ? 'empty' : ''
                                    }`}
                            >
                                {searchResults.map((user) => (
                                    <label key={user} className="list-item">
                                        <input
                                            type="checkbox"
                                            checked={checkedResults.includes(user)}
                                            onChange={() => toggleCheck(user)}
                                        />
                                        <span>{user}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 中央：移動ボタン */}
                        <div className="move-button-container">
                            <button className="btn-move" onClick={moveToSelected}>
                                &gt;
                            </button>
                        </div>

                        {/* 右：設定済ユーザー */}
                        <div className="task-list">
                            <div className="list-header">
                                <span className="modal-label">設定済ユーザー</span>
                                <span className="count">{selectedUsers.length}件</span>
                            </div>
                            <div className="list-subheader">
                                <FaIcons.FaCheckSquare className="icon" />
                                <FaIcons.FaChevronDown className="icon" />
                                <span>ユーザー名</span>
                            </div>
                            <div
                                className={`list-box ${selectedUsers.length === 0 ? 'empty' : ''
                                    }`}
                            >
                                {selectedUsers.map((user) => (
                                    <div key={user} className="list-item">
                                        <span>{user}</span>
                                        <button
                                            className="btn-delete"
                                            onClick={() => removeUser(user)}
                                        >
                                            <FaIcons.FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* フッター */}
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>
                        キャンセル
                    </button>
                    <button className="btn-create" onClick={() => onSave(selectedUsers)}>
                        保存
                    </button>
                </div>
            </div>
        </div>
    );
};
