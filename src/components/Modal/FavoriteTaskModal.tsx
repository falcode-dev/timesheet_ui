import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import './FavoriteTaskModal.css';

interface FavoriteTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedTasks: string[]) => void;
}

export const FavoriteTaskModal: React.FC<FavoriteTaskModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // ========================
    // ▼ 選択状態
    // ========================
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTask, setSelectedTask] = useState('');

    // 選択肢（サンプル）
    const categories = ['業務改善', '品質向上', '教育・育成'];
    const tasks = ['資料整理', '会議準備', 'テスト計画', 'レビュー対応', '定例会参加'];

    const [searchResults, setSearchResults] = useState<string[]>(tasks);
    const [favoriteTasks, setFavoriteTasks] = useState<string[]>([]);
    const [checkedResults, setCheckedResults] = useState<string[]>([]);
    const [checkedFavorites, setCheckedFavorites] = useState<string[]>([]);

    // ========================
    // ▼ 開閉制御
    // ========================
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleMenu = (key: string) => {
        setOpenMenu((prev) => (prev === key ? null : key));
    };

    const handleSelect = (key: string, value: string) => {
        if (key === 'category') {
            setSelectedCategory(value);
        } else if (key === 'task') {
            setSelectedTask(value);
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
    // ▼ フェードアニメーション制御
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
    // ▼ リスト操作
    // ========================
    const toggleCheck = (task: string) => {
        setCheckedResults((prev) =>
            prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]
        );
    };

    const moveToFavorite = () => {
        const newFavorites = [...favoriteTasks];
        checkedResults.forEach((task) => {
            if (!newFavorites.includes(task)) newFavorites.push(task);
        });
        setFavoriteTasks(newFavorites);
        setCheckedResults([]);
    };

    const toggleFavoriteCheck = (task: string) => {
        setCheckedFavorites((prev) =>
            prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]
        );
    };

    const removeSelectedFavorites = () => {
        setFavoriteTasks((prev) => prev.filter((t) => !checkedFavorites.includes(t)));
        setCheckedFavorites([]);
    };

    const removeFavorite = (task: string) => {
        setFavoriteTasks((prev) => prev.filter((t) => t !== task));
        setCheckedFavorites((prev) => prev.filter((t) => t !== task));
    };

    // ========================
    // ▼ JSX
    // ========================
    return (
        <div className={`modal-overlay ${isVisible ? 'fade-in' : 'fade-out'}`}>
            <div className={`modal-content ${isVisible ? 'fade-in' : 'fade-out'}`}>
                {/* ヘッダー */}
                <div className="modal-header">
                    <h3 className="modal-title">お気に入り間接タスク設定</h3>
                </div>

                {/* 本文 */}
                <div className="modal-body">
                    <p className="modal-description">
                        間接タスクの絞り込み情報を設定し保存してください。
                    </p>

                    {/* 上部フィルタグリッド */}
                    <div className="modal-grid">
                        {/* 左グリッド */}
                        <div className="grid-left">
                            <label className="modal-label">サブカテゴリ</label>
                            <div className={`modal-select ${openMenu === 'category' ? 'open' : ''}`}>
                                <div
                                    className="modal-select-display"
                                    onClick={() => toggleMenu('category')}
                                >
                                    <span
                                        className={`modal-select-text ${!selectedCategory ? 'placeholder' : ''}`}
                                    >
                                        {selectedCategory || 'サブカテゴリを選択'}
                                    </span>
                                    <FaIcons.FaChevronDown className="icon" />
                                </div>
                                {openMenu === 'category' && (
                                    <div className="modal-option-list">
                                        {categories.map((c) => (
                                            <div
                                                key={c}
                                                className={`modal-option ${c === selectedCategory ? 'selected' : ''}`}
                                                onClick={() => handleSelect('category', c)}
                                            >
                                                {c}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="right-align">
                                <button
                                    className="btn-clear"
                                    onClick={() => setSelectedCategory('')}
                                >
                                    クリア
                                </button>
                            </div>
                        </div>

                        {/* 右グリッド */}
                        <div className="grid-right">
                            <label className="modal-label">タスク名</label>
                            <div className={`modal-select ${openMenu === 'task' ? 'open' : ''}`}>
                                <div
                                    className="modal-select-display"
                                    onClick={() => toggleMenu('task')}
                                >
                                    <span
                                        className={`modal-select-text ${!selectedTask ? 'placeholder' : ''}`}
                                    >
                                        {selectedTask || 'タスク名を選択'}
                                    </span>
                                    <FaIcons.FaChevronDown className="icon" />
                                </div>
                                {openMenu === 'task' && (
                                    <div className="modal-option-list">
                                        {tasks.map((t) => (
                                            <div
                                                key={t}
                                                className={`modal-option ${t === selectedTask ? 'selected' : ''}`}
                                                onClick={() => handleSelect('task', t)}
                                            >
                                                {t}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="left-align">
                                <button
                                    className="btn-search"
                                    onClick={() => {
                                        // 検索条件に応じて絞り込み
                                        const filtered = tasks.filter(
                                            (t) =>
                                                (!selectedCategory || t.includes(selectedCategory)) &&
                                                (!selectedTask || t.includes(selectedTask))
                                        );
                                        setSearchResults(filtered);
                                    }}
                                >
                                    検索
                                </button>
                            </div>
                        </div>
                    </div>

                    <hr className="divider" />

                    <p className="modal-description">
                        検索結果の項目を選択して追加し保存を押してください。
                    </p>

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
                                    <span className="label-text">サブカテゴリ</span>
                                    <FaIcons.FaTasks className="task-icon" />
                                </div>
                            </div>

                            <div className="list-box">
                                {searchResults.map((task) => {
                                    const isFavorited = favoriteTasks.includes(task);
                                    return (
                                        <label
                                            key={task}
                                            className={`list-item-2line ${isFavorited ? 'disabled-item' : ''
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                disabled={isFavorited}
                                                checked={checkedResults.includes(task)}
                                                onChange={() => toggleCheck(task)}
                                            />
                                            <div className="list-text">
                                                <div className="category-name">
                                                    {selectedCategory || '業務改善'}
                                                </div>
                                                <div className="task-name">{task}</div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 中央：移動ボタン */}
                        <div className="move-button-container">
                            <button className="btn-move" onClick={moveToFavorite}>
                                &gt;
                            </button>
                        </div>

                        {/* 右：お気に入り */}
                        <div className="task-list">
                            <div className="list-header">
                                <span className="modal-label">お気に入り間接タスク項目</span>
                                <span className="count">{favoriteTasks.length}件</span>
                            </div>

                            <div className="list-subheader">
                                <div className="list-subheader-left">
                                    <FaIcons.FaCheckSquare className="check-icon" />
                                    <FaIcons.FaChevronDown className="list-subheader-right" />
                                    <span className="label-text">サブカテゴリ</span>
                                    <FaIcons.FaTasks className="task-icon" />
                                </div>
                                {favoriteTasks.length > 0 && (
                                    <button
                                        className="btn-delete-all"
                                        onClick={removeSelectedFavorites}
                                        title="選択した項目を削除"
                                    >
                                        <FaIcons.FaTrash />
                                    </button>
                                )}
                            </div>

                            <div className="list-box">
                                {favoriteTasks.map((task) => (
                                    <div key={task} className="list-item-favorite">
                                        <input
                                            type="checkbox"
                                            checked={checkedFavorites.includes(task)}
                                            onChange={() => toggleFavoriteCheck(task)}
                                        />
                                        <div className="list-text">
                                            <div className="category-name">
                                                {selectedCategory || '業務改善'}
                                            </div>
                                            <div className="task-name">{task}</div>
                                        </div>
                                        <button
                                            className="btn-delete"
                                            onClick={() => removeFavorite(task)}
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
                    <button className="btn-create" onClick={() => onSave(favoriteTasks)}>
                        保存
                    </button>
                </div>
            </div>
        </div>
    );
};
