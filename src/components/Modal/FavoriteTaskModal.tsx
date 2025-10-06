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
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTask, setSelectedTask] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([
        '資料整理',
        '会議準備',
        'テスト計画',
        'レビュー対応',
        '定例会参加',
    ]);
    const [favoriteTasks, setFavoriteTasks] = useState<string[]>([]);
    const [checkedResults, setCheckedResults] = useState<string[]>([]);
    const [checkedFavorites, setCheckedFavorites] = useState<string[]>([]);

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

    // ✅ 左リストチェック制御
    const toggleCheck = (task: string) => {
        setCheckedResults((prev) =>
            prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]
        );
    };

    // ✅ 「＞」ボタンで右へ移動
    const moveToFavorite = () => {
        const newFavorites = [...favoriteTasks];
        checkedResults.forEach((task) => {
            if (!newFavorites.includes(task)) newFavorites.push(task);
        });
        setFavoriteTasks(newFavorites);
        setCheckedResults([]);
    };

    // ✅ 右リストチェック制御
    const toggleFavoriteCheck = (task: string) => {
        setCheckedFavorites((prev) =>
            prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]
        );
    };

    // ✅ 一括削除
    const removeSelectedFavorites = () => {
        setFavoriteTasks((prev) => prev.filter((t) => !checkedFavorites.includes(t)));
        setCheckedFavorites([]);
    };

    // ✅ 単体削除
    const removeFavorite = (task: string) => {
        setFavoriteTasks((prev) => prev.filter((t) => t !== task));
        setCheckedFavorites((prev) => prev.filter((t) => t !== task));
    };

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
                            <div className="modal-select">
                                <input
                                    type="text"
                                    placeholder="サブカテゴリを選択"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                />
                                <FaIcons.FaChevronDown className="icon" />
                            </div>
                            <div className="right-align">
                                <button className="btn-clear">クリア</button>
                            </div>
                        </div>

                        {/* 右グリッド */}
                        <div className="grid-right">
                            <label className="modal-label">タスク名</label>
                            <div className="modal-select">
                                <input
                                    type="text"
                                    placeholder="タスク名を選択"
                                    value={selectedTask}
                                    onChange={(e) => setSelectedTask(e.target.value)}
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
                                                <div className="category-name">業務改善</div>
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
                                            <div className="category-name">業務改善</div>
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
