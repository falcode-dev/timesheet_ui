import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import './TimeEntryModal.css';

interface TimeEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export const TimeEntryModal: React.FC<TimeEntryModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out' | null>(null);
    const [comment, setComment] = useState('');
    const maxLength = 2000;

    useEffect(() => {
        if (isOpen) {
            setFadeState('fade-in');
        } else if (!isOpen && fadeState === 'fade-in') {
            setFadeState('fade-out');
            const timer = setTimeout(() => setFadeState(null), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && fadeState !== 'fade-out') return null;

    return (
        <div className={`modal-overlay ${fadeState}`}>
            <div className={`modal-content ${fadeState}`}>
                {/* モーダルヘッダー */}
                <div className="modal-header">
                    <h3 className="modal-title">新しいタイムエントリを作成</h3>
                </div>

                {/* モーダル本文 */}
                <div className="modal-body">
                    <p className="modal-description">
                        Time Entry の基本情報を入力して作成を押してください。
                    </p>

                    {/* WO番号 */}
                    <label className="modal-label">WO番号</label>
                    <div className="modal-select">
                        <input type="text" placeholder="WOを選択" readOnly />
                        <FaIcons.FaChevronDown className="icon" />
                    </div>

                    <div className="modal-grid">
                        {/* 左グリッド */}
                        <div className="grid-left">
                            {/* 開始日 */}
                            <label className="modal-label">スケジュール開始日</label>
                            <div className="date-row">
                                <div className="date-input">
                                    <input type="text" placeholder="yyyy/mm/dd" />
                                    <FaIcons.FaRegCalendarAlt className="icon" />
                                </div>
                                <div className="time-select">
                                    <input type="text" placeholder="時間" />
                                    <FaIcons.FaChevronDown className="icon" />
                                </div>
                                <span>：</span>
                                <div className="minute-select">
                                    <input type="text" placeholder="分" />
                                    <FaIcons.FaChevronDown className="icon" />
                                </div>
                            </div>

                            {/* 終了日 */}
                            <label className="modal-label">スケジュール終了日</label>
                            <div className="date-row">
                                <div className="date-input">
                                    <input type="text" placeholder="yyyy/mm/dd" />
                                    <FaIcons.FaRegCalendarAlt className="icon" />
                                </div>
                                <div className="time-select">
                                    <input type="text" placeholder="時間" />
                                    <FaIcons.FaChevronDown className="icon" />
                                </div>
                                <span>：</span>
                                <div className="minute-select">
                                    <input type="text" placeholder="分" />
                                    <FaIcons.FaChevronDown className="icon" />
                                </div>
                            </div>

                            {/* EndUser */}
                            <label className="modal-label">EndUser</label>
                            <div className="enduser-row">
                                <input type="text" placeholder="エンドユーザーを入力" />
                                <div className="enduser-select">
                                    <FaIcons.FaChevronDown />
                                </div>
                            </div>

                            {/* リソース */}
                            <div className="resource-header">
                                <label className="modal-label">リソース</label>
                                <a href="#" className="resource-link">リソース選択</a>
                            </div>
                            <textarea placeholder="リソースの詳細を入力" rows={4}></textarea>
                        </div>

                        {/* 右グリッド */}
                        <div className="grid-right">
                            <label className="modal-label">タイムカテゴリ</label>
                            <div className="modal-select">
                                <input type="text" placeholder="選択してください" readOnly />
                                <FaIcons.FaChevronDown className="icon" />
                            </div>

                            <label className="modal-label">カテゴリ</label>
                            <div className="modal-select">
                                <input type="text" placeholder="選択してください" readOnly />
                                <FaIcons.FaChevronDown className="icon" />
                            </div>

                            <label className="modal-label">ペイメントタイプ</label>
                            <div className="modal-select disabled">
                                <input type="text" placeholder="自動設定" readOnly />
                            </div>

                            <label className="modal-label">サブカテゴリ</label>
                            <div className="modal-select disabled">
                                <input type="text" placeholder="自動設定" readOnly />
                            </div>

                            <label className="modal-label">タスク</label>
                            <div className="modal-select">
                                <input type="text" placeholder="選択してください" readOnly />
                                <FaIcons.FaChevronDown className="icon" />
                            </div>

                            <label className="modal-label">コメント</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                maxLength={maxLength}
                                placeholder="コメントを入力"
                                rows={4}
                            />
                            <div className="char-count">
                                {comment.length}/{maxLength}
                            </div>
                        </div>
                    </div>
                </div>

                {/* モーダルフッター */}
                <div className="modal-footer">
                    <div className="footer-right">
                        <button className="btn-cancel" onClick={onClose}>
                            キャンセル
                        </button>
                        <button className="btn-create" onClick={() => onSubmit({ comment })}>
                            作成
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
