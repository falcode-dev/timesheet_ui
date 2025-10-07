import React, { useState, useEffect, useRef } from 'react';
import * as FaIcons from 'react-icons/fa';
import './TimeEntryModal.css';

interface ProtoItem {
    id: string;
    name: string;
}

interface TimeEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    onDelete?: (id: string) => void;
    selectedDateTime?: { start: Date; end: Date } | null;
    selectedEvent?: any | null;
}

export const TimeEntryModal: React.FC<TimeEntryModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    onDelete,
    selectedDateTime,
    selectedEvent,
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const maxLength = 2000;

    const [startDate, setStartDate] = useState('');
    const [startHour, setStartHour] = useState('');
    const [startMinute, setStartMinute] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endHour, setEndHour] = useState('');
    const [endMinute, setEndMinute] = useState('');

    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);

    // ========================
    // ▼ proto_test1 から WO データを取得
    // ========================
    const [workOrders, setWorkOrders] = useState<ProtoItem[]>([]);
    const [loadingWO, setLoadingWO] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const fetchWO = async () => {
            try {
                setLoadingWO(true);
                const res = await fetch('/api/proto_test1');
                if (!res.ok) throw new Error('データ取得に失敗しました');
                const data: ProtoItem[] = await res.json();
                setWorkOrders(data);
            } catch (err) {
                console.error('proto_test1 fetch error:', err);
            } finally {
                setLoadingWO(false);
            }
        };
        fetchWO();
    }, [isOpen]);

    // ========================
    // ▼ 他の固定セレクト
    // ========================
    const endUsers = ['株式会社サンプル', 'ABC商事', 'XYZソリューション'];
    const locations = ['東京', '大阪', '名古屋'];
    const timeCategories = ['通常勤務', '残業', '休日出勤'];
    const categories = ['開発', '会議', 'レビュー'];
    const tasks = ['資料作成', 'プログラミング', 'テスト'];

    // ========================
    // ▼ 選択状態
    // ========================
    const [selectedWO, setSelectedWO] = useState('');
    const [selectedEndUser, setSelectedEndUser] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedTimeCategory, setSelectedTimeCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTask, setSelectedTask] = useState('');

    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // ========================
    // ▼ 外部クリックで閉じる（全セレクト対応）
    // ========================
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // 開いている場合のみ判定する
            if (!openMenu) return;

            // クリック対象が「現在開いているセレクトボックス」内か確認
            const openSelect = document.querySelector(`.modal-select.open`);
            if (openSelect && openSelect.contains(event.target as Node)) {
                return; // → 内側クリックなので閉じない
            }

            // 外側クリック → 閉じる
            setOpenMenu(null);
        };

        if (openMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // ✅ クリーンアップ
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenu]);

    // ========================
    // ▼ メニュー開閉処理（HeaderSearchと同じ）
    // ========================
    const toggleMenu = (key: string) => {
        setOpenMenu((prev) => (prev === key ? null : key));
    };


    const handleSelect = (key: string, value: string) => {
        switch (key) {
            case 'wo':
                setSelectedWO(value);
                break;
            case 'endUser':
                setSelectedEndUser(value);
                break;
            case 'location':
                setSelectedLocation(value);
                break;
            case 'timeCategory':
                setSelectedTimeCategory(value);
                break;
            case 'category':
                setSelectedCategory(value);
                break;
            case 'task':
                setSelectedTask(value);
                break;
        }
        setOpenMenu(null);
    };

    // ========================
    // ▼ 日付フォーマット＆初期化
    // ========================
    const formatLocalDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    useEffect(() => {
        if (!isOpen) return;

        if (selectedEvent) {
            const start = new Date(selectedEvent.start);
            const end = new Date(selectedEvent.end);
            setTitle(selectedEvent.title || '');
            setComment(selectedEvent.extendedProps?.comment || '');
            setStartDate(formatLocalDate(start));
            setStartHour(start.getHours().toString().padStart(2, '0'));
            setStartMinute(start.getMinutes().toString().padStart(2, '0'));
            setEndDate(formatLocalDate(end));
            setEndHour(end.getHours().toString().padStart(2, '0'));
            setEndMinute(end.getMinutes().toString().padStart(2, '0'));
        } else if (selectedDateTime) {
            const { start, end } = selectedDateTime;
            setTitle('');
            setComment('');
            setStartDate(formatLocalDate(start));
            setStartHour(start.getHours().toString().padStart(2, '0'));
            setStartMinute(start.getMinutes().toString().padStart(2, '0'));
            setEndDate(formatLocalDate(end));
            setEndHour(end.getHours().toString().padStart(2, '0'));
            setEndMinute(end.getMinutes().toString().padStart(2, '0'));
        } else {
            const now = new Date();
            const minutes = now.getMinutes();
            const roundedMinutes = minutes < 30 ? 0 : 30;
            const roundedStart = new Date(now);
            roundedStart.setMinutes(roundedMinutes, 0, 0);
            const roundedEnd = new Date(roundedStart);
            roundedEnd.setHours(roundedEnd.getHours() + 1);
            setTitle('');
            setComment('');
            setStartDate(formatLocalDate(roundedStart));
            setStartHour(roundedStart.getHours().toString().padStart(2, '0'));
            setStartMinute(roundedStart.getMinutes().toString().padStart(2, '0'));
            setEndDate(formatLocalDate(roundedEnd));
            setEndHour(roundedEnd.getHours().toString().padStart(2, '0'));
            setEndMinute(roundedEnd.getMinutes().toString().padStart(2, '0'));
        }
    }, [isOpen, selectedEvent, selectedDateTime]);

    // ========================
    // ▼ モーダル開閉アニメーション
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

    const handleSave = () => {
        const start = new Date(`${startDate}T${startHour}:${startMinute}`);
        const end = new Date(`${endDate}T${endHour}:${endMinute}`);
        const data = {
            id: selectedEvent?.id || Date.now().toString(),
            title: title || '無題のイベント',
            start,
            end,
            extendedProps: {
                comment,
                selectedWO,
                selectedEndUser,
                selectedLocation,
                selectedTimeCategory,
                selectedCategory,
                selectedTask,
            },
        };
        onSubmit(data);
        onClose();
    };

    const handleDelete = () => {
        if (selectedEvent && onDelete) {
            if (window.confirm(`「${selectedEvent.title}」を削除しますか？`)) {
                onDelete(selectedEvent.id);
                onClose();
            }
        }
    };

    // ========================
    // ▼ JSX
    // ========================
    return (
        <div className={`modal-overlay ${isVisible ? 'fade-in' : 'fade-out'}`}>
            <div ref={menuRef} className={`modal-content ${isVisible ? 'fade-in' : 'fade-out'}`}>
                {/* ヘッダー */}
                <div className="modal-header">
                    <h3 className="modal-title">
                        {selectedEvent ? 'タイムエントリをを編集' : '新しいタイムエントリを作成'}
                    </h3>
                </div>

                {/* 本文 */}
                <div className="modal-body">
                    <p className="modal-description">
                        {selectedEvent
                            ? 'Time Entry の基本情報を入力して更新を押してください。'
                            : 'Time Entry の基本情報を入力して作成を押してください。'}
                    </p>

                    {/* タイトル */}
                    {/* <label className="modal-label">タイトル</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="タイトルを入力"
                    /> */}

                    {/* ✅ WO番号（proto_test1から取得） */}
                    <label className="modal-label">WO番号</label>
                    <div className={`modal-select ${openMenu === 'wo' ? 'open' : ''}`}>
                        <div className="modal-select-display" onClick={() => toggleMenu('wo')}>
                            <span className={`modal-select-text ${!selectedWO ? 'placeholder' : ''}`}>
                                {selectedWO || (loadingWO ? '読み込み中...' : 'WOを選択')}
                            </span>
                            <FaIcons.FaChevronDown className="icon" />
                        </div>
                        {openMenu === 'wo' && (
                            <div className="modal-option-list">
                                {workOrders.length > 0 ? (
                                    workOrders.map((wo) => (
                                        <div
                                            key={wo.id}
                                            className={`modal-option ${wo.name === selectedWO ? 'selected' : ''}`}
                                            onClick={() => handleSelect('wo', wo.name)}
                                        >
                                            {wo.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="modal-option empty">データがありません</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="modal-grid">
                        {/* 左カラム */}
                        <div className="grid-left">
                            {/* 開始日 */}
                            <label className="modal-label">スケジュール開始日</label>
                            <div className="datetime-row">
                                <div className="date-input">
                                    <input
                                        ref={startDateRef}
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <FaIcons.FaRegCalendarAlt
                                        className="icon clickable"
                                        onClick={() => startDateRef.current?.showPicker?.()}
                                    />
                                </div>
                                <div className="time-input">
                                    <input
                                        type="number"
                                        min="0"
                                        max="23"
                                        value={startHour}
                                        onChange={(e) => setStartHour(e.target.value)}
                                    />
                                </div>
                                <span>：</span>
                                <div className="minute-input">
                                    <input
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={startMinute}
                                        onChange={(e) => setStartMinute(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* 終了日 */}
                            <label className="modal-label">スケジュール終了日</label>
                            <div className="datetime-row">
                                <div className="date-input">
                                    <input
                                        ref={endDateRef}
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                    <FaIcons.FaRegCalendarAlt
                                        className="icon clickable"
                                        onClick={() => endDateRef.current?.showPicker?.()}
                                    />
                                </div>
                                <div className="time-input">
                                    <input
                                        type="number"
                                        min="0"
                                        max="23"
                                        value={endHour}
                                        onChange={(e) => setEndHour(e.target.value)}
                                    />
                                </div>
                                <span>：</span>
                                <div className="minute-input">
                                    <input
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={endMinute}
                                        onChange={(e) => setEndMinute(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* EndUser */}
                            <label className="modal-label">EndUser</label>
                            <div className={`modal-select ${openMenu === 'endUser' ? 'open' : ''}`}>
                                <div className="modal-select-display" onClick={() => toggleMenu('endUser')}>
                                    <span className={`modal-select-text ${!selectedEndUser ? 'placeholder' : ''}`}>
                                        {selectedEndUser || 'エンドユーザーを選択'}
                                    </span>
                                    <FaIcons.FaChevronDown className="icon" />
                                </div>
                                {openMenu === 'endUser' && (
                                    <div className="modal-option-list">
                                        {endUsers.map((user) => (
                                            <div
                                                key={user}
                                                className={`modal-option ${user === selectedEndUser ? 'selected' : ''}`}
                                                onClick={() => handleSelect('endUser', user)}
                                            >
                                                {user}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Location */}
                            <label className="modal-label">Location</label>
                            <div className={`modal-select ${openMenu === 'location' ? 'open' : ''}`}>
                                <div className="modal-select-display" onClick={() => toggleMenu('location')}>
                                    <span className={`modal-select-text ${!selectedLocation ? 'placeholder' : ''}`}>
                                        {selectedLocation || '場所を選択'}
                                    </span>
                                    <FaIcons.FaChevronDown className="icon" />
                                </div>
                                {openMenu === 'location' && (
                                    <div className="modal-option-list">
                                        {locations.map((loc) => (
                                            <div
                                                key={loc}
                                                className={`modal-option ${loc === selectedLocation ? 'selected' : ''}`}
                                                onClick={() => handleSelect('location', loc)}
                                            >
                                                {loc}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* リソース */}
                            <div className="resource-header">
                                <label className="modal-label">リソース</label>
                                <a href="#" className="resource-link">
                                    リソース選択
                                </a>
                            </div>
                            <textarea placeholder="リソースの詳細を入力" rows={4}></textarea>
                        </div>

                        {/* 右カラム */}
                        <div className="grid-right">
                            {/* タイムカテゴリ */}
                            <label className="modal-label">タイムカテゴリ</label>
                            <div className={`modal-select ${openMenu === 'timeCategory' ? 'open' : ''}`}>
                                <div className="modal-select-display" onClick={() => toggleMenu('timeCategory')}>
                                    <span
                                        className={`modal-select-text ${!selectedTimeCategory ? 'placeholder' : ''}`}
                                    >
                                        {selectedTimeCategory || '選択してください'}
                                    </span>
                                    <FaIcons.FaChevronDown className="icon" />
                                </div>
                                {openMenu === 'timeCategory' && (
                                    <div className="modal-option-list">
                                        {timeCategories.map((item) => (
                                            <div
                                                key={item}
                                                className={`modal-option ${item === selectedTimeCategory ? 'selected' : ''}`}
                                                onClick={() => handleSelect('timeCategory', item)}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* カテゴリ */}
                            <label className="modal-label">カテゴリ</label>
                            <div className={`modal-select ${openMenu === 'category' ? 'open' : ''}`}>
                                <div className="modal-select-display" onClick={() => toggleMenu('category')}>
                                    <span className={`modal-select-text ${!selectedCategory ? 'placeholder' : ''}`}>
                                        {selectedCategory || '選択してください'}
                                    </span>
                                    <FaIcons.FaChevronDown className="icon" />
                                </div>
                                {openMenu === 'category' && (
                                    <div className="modal-option-list">
                                        {categories.map((item) => (
                                            <div
                                                key={item}
                                                className={`modal-option ${item === selectedCategory ? 'selected' : ''}`}
                                                onClick={() => handleSelect('category', item)}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* ペイメントタイプ */}
                            <label className="modal-label">ペイメントタイプ</label>
                            <div className="modal-select disabled">
                                <input type="text" placeholder="自動設定" readOnly />
                            </div>

                            {/* サブカテゴリ */}
                            <label className="modal-label">サブカテゴリ</label>
                            <div className="modal-select disabled">
                                <input type="text" placeholder="自動設定" readOnly />
                            </div>

                            {/* タスク */}
                            <label className="modal-label">タスク</label>
                            <div className={`modal-select ${openMenu === 'task' ? 'open' : ''}`}>
                                <div className="modal-select-display" onClick={() => toggleMenu('task')}>
                                    <span className={`modal-select-text ${!selectedTask ? 'placeholder' : ''}`}>
                                        {selectedTask || '選択してください'}
                                    </span>
                                    <FaIcons.FaChevronDown className="icon" />
                                </div>
                                {openMenu === 'task' && (
                                    <div className="modal-option-list">
                                        {tasks.map((item) => (
                                            <div
                                                key={item}
                                                className={`modal-option ${item === selectedTask ? 'selected' : ''}`}
                                                onClick={() => handleSelect('task', item)}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* コメント */}
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

                {/* フッター */}
                <div className="modal-footer">
                    <div className="footer-right">
                        {/* {selectedEvent && (
                            <button className="btn-cancel" onClick={handleDelete}>
                                削除
                            </button>
                        )} */}
                        <button className="btn-cancel" onClick={onClose}>
                            キャンセル
                        </button>
                        <button className="btn-create" onClick={handleSave}>
                            {selectedEvent ? '更新' : '作成'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
