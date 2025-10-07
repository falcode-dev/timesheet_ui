import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import './FavoriteTaskModal.css'; // ✅ 共通デザインを利用

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

    // ▼ 仮データ
    const employeeNumbers = ['1001', '1002', '1003', '1004', '1005'];
    const users = ['田中 太郎', '佐藤 花子', '鈴木 次郎', '高橋 美咲', '山本 健'];

    const [searchResults, setSearchResults] = useState<string[]>(users);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [checkedResults, setCheckedResults] = useState<string[]>([]);
    const [checkedSelected, setCheckedSelected] = useState<string[]>([]);

    // ========================
    // ▼ セレクト開閉制御
    // ========================
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleMenu = (key: string) => {
        setOpenMenu((prev) => (prev === key ? null : key));
    };

    const handleSelect = (key: string, value: string) => {
        if (key === 'employeeNumber') {
            setEmployeeNumber(value);
        } else if (key === 'userName') {
            setUserName(value);
        }
        setOpenMenu(null);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const openSelect = document.querySelector('.modal-select.open');
            if (openSelect && openSelect.contains(event.target as Node)) return;
            setOpenMenu(null);
        };
        if (openMenu) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenu]);

    // ========================
    // ▼ モーダルフェードアニメーション
    // ========================
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

    // ========================
    // ▼ 検索・選択系操作
    // ========================
    const handleSearch = () => {
        const filtered = users.filter(
            (u) =>
                (!employeeNumber || u.includes(employeeNumber)) &&
                (!userName || u.includes(userName))
        );
        setSearchResults(filtered);
    };

    const toggleCheck = (user: string) => {
        setCheckedResults((prev) =>
            prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
        );
    };

    const moveToSelected = () => {
        const newSelected = [...selectedUsers];
        checkedResults.forEach((user) => {
            if (!newSelected.includes(user)) newSelected.push(user);
        });
        setSelectedUsers(newSelected);
        setCheckedResults([]);
    };

    const toggleSelectedCheck = (user: string) => {
        setCheckedSelected((prev) =>
            prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
        );
    };

    const removeCheckedSelected = () => {
        setSelectedUsers((prev) => prev.filter((u) => !checkedSelected.includes(u)));
        setCheckedSelected([]);
    };

    const removeUser = (user: string) => {
        setSelectedUsers((prev) => prev.filter((u) => u !== user));
        setCheckedSelected((prev) => prev.filter((u) => u !== user));
    };

    // ========================
    // ▼ JSX
    // ========================
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
                        社員番号またはユーザー名で検索し、右側に追加してください。
                    </p>

                    {/* 上部検索グリッド */}
                    <div className="modal-grid">
                        {/* 左：社員番号 */}
                        <div className="grid-left">
                            <label className="modal-label">社員番号</label>
                            <div className={`modal-select ${openMenu === 'employeeNumber' ? 'open' : ''}`}>
                                <div
                                    className="modal-select-display"
                                    onClick={() => toggleMenu('employeeNumber')}
                                >
                                    <span
                                        className={`modal-select-text ${!employeeNumber ? 'placeholder' : ''}`}
                                    >
                                        {employeeNumber || '社員番号を選択'}
                                    </span>
                                    <FaIcons.FaChevronDown className="icon" />
                                </div>
                                {openMenu === 'employeeNumber' && (
                                    <div className="modal-option-list">
                                        {employeeNumbers.map((num) => (
                                            <div
                                                key={num}
                                                className={`modal-option ${num === employeeNumber ? 'selected' : ''}`}
                                                onClick={() => handleSelect('employeeNumber', num)}
                                            >
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="right-align">
                                <button className="btn-clear" onClick={() => setEmployeeNumber('')}>
                                    クリア
                                </button>
                            </div>
                        </div>

                        {/* 右：ユーザー名 */}
                        <div className="grid-right">
                            <label className="modal-label">ユーザー名</label>
                            <div className={`modal-select ${openMenu === 'userName' ? 'open' : ''}`}>
                                <div
                                    className="modal-select-display"
                                    onClick={() => toggleMenu('userName')}
                                >
                                    <span
                                        className={`modal-select-text ${!userName ? 'placeholder' : ''}`}
                                    >
                                        {userName || 'ユーザー名を選択'}
                                    </span>
                                    <FaIcons.FaChevronDown className="icon" />
                                </div>
                                {openMenu === 'userName' && (
                                    <div className="modal-option-list">
                                        {users.map((u) => (
                                            <div
                                                key={u}
                                                className={`modal-option ${u === userName ? 'selected' : ''}`}
                                                onClick={() => handleSelect('userName', u)}
                                            >
                                                {u}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="left-align">
                                <button className="btn-search" onClick={handleSearch}>
                                    検索
                                </button>
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

                        {/* 中央：移動ボタン */}
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
