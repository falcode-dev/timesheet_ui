import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import './FavoriteTaskModal.css'; // ✅ デザイン統一CSSを再利用

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
    const [checkedSelected, setCheckedSelected] = useState<string[]>([]);

    // 🧩 モーダル表示アニメーション
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

    // ✅ 検索結果チェック制御
    const toggleCheck = (user: string) => {
        setCheckedResults((prev) =>
            prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
        );
    };

    // ✅ 「＞」で右側へ追加
    const moveToSelected = () => {
        const newSelected = [...selectedUsers];
        checkedResults.forEach((user) => {
            if (!newSelected.includes(user)) newSelected.push(user);
        });
        setSelectedUsers(newSelected);
        setCheckedResults([]);
    };

    // ✅ 右側チェック制御
    const toggleSelectedCheck = (user: string) => {
        setCheckedSelected((prev) =>
            prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
        );
    };

    // ✅ 一括削除
    const removeCheckedSelected = () => {
        setSelectedUsers((prev) => prev.filter((u) => !checkedSelected.includes(u)));
        setCheckedSelected([]);
    };

    // ✅ 単体削除
    const removeUser = (user: string) => {
        setSelectedUsers((prev) => prev.filter((u) => u !== user));
        setCheckedSelected((prev) => prev.filter((u) => u !== user));
    };

    return (
        <div className={`modal-overlay ${isVisible ? 'fade-in' : 'fade-out'}`}>
            <div className={`modal-content ${isVisible ? 'fade-in' : 'fade-out'}`}>
                {/* ヘッダー */}
                <div className="modal-header">
                    <h3 className="modal-title">ユーザー一覧設定</h3>
                </div>

                {/* 本文 */}
                <div className="modal-body">
                    <p className="modal-description">
                        追加したいユーザーを検索し、右側に追加してください。
                    </p>

                    {/* 検索フォーム */}
                    <div className="modal-grid">
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

                    {/* 下部リスト */}
                    <div className="task-grid">
                        {/* 左：検索結果 */}
                        <div className="task-list">
                            <div className="list-header">
                                <span className="modal-label">検索結果</span>
                                <span className="count">{searchResults.length}件</span>
                            </div>

                            <div className="list-subheader">
                                <div className="list-subheader-left">
                                    <FaIcons.FaCheckSquare className="check-icon" />
                                    <FaIcons.FaChevronDown className="list-subheader-right" />
                                    <span className="label-text">ユーザー名</span>
                                    <FaIcons.FaUser className="task-icon" />
                                </div>
                            </div>

                            <div className="list-box">
                                {searchResults.map((user) => {
                                    const isSelected = selectedUsers.includes(user);
                                    return (
                                        <label
                                            key={user}
                                            className={`list-item-2line ${isSelected ? 'disabled-item' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                disabled={isSelected}
                                                checked={checkedResults.includes(user)}
                                                onChange={() => toggleCheck(user)}
                                            />
                                            <div className="list-text">
                                                <div className="category-name">社員</div>
                                                <div className="task-name">{user}</div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 中央移動ボタン */}
                        <div className="move-button-container">
                            <button className="btn-move" onClick={moveToSelected}>
                                &gt;
                            </button>
                        </div>

                        {/* 右：選択済みユーザー */}
                        <div className="task-list">
                            <div className="list-header">
                                <span className="modal-label">設定済みユーザー</span>
                                <span className="count">{selectedUsers.length}件</span>
                            </div>

                            <div className="list-subheader">
                                <div className="list-subheader-left">
                                    <FaIcons.FaCheckSquare className="check-icon" />
                                    <FaIcons.FaChevronDown className="list-subheader-right" />
                                    <span className="label-text">ユーザー名</span>
                                    <FaIcons.FaUser className="task-icon" />
                                </div>
                                {selectedUsers.length > 0 && (
                                    <button
                                        className="btn-delete-all"
                                        onClick={removeCheckedSelected}
                                        title="選択したユーザーを削除"
                                    >
                                        <FaIcons.FaTrash />
                                    </button>
                                )}
                            </div>

                            <div className="list-box">
                                {selectedUsers.map((user) => (
                                    <div key={user} className="list-item-favorite">
                                        <input
                                            type="checkbox"
                                            checked={checkedSelected.includes(user)}
                                            onChange={() => toggleSelectedCheck(user)}
                                        />
                                        <div className="list-text">
                                            <div className="category-name">社員</div>
                                            <div className="task-name">{user}</div>
                                        </div>
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
