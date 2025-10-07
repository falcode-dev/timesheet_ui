import React, { useState, useEffect, useRef } from 'react';
import * as FaIcons from 'react-icons/fa';
import './Header.css';

interface HeaderSearchProps {
    workOrders: { id: string; name: string }[];
    selectedWO: string;
    onChangeWO: (id: string) => void;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
    workOrders,
    selectedWO,
    onChangeWO,
}) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    // ✅ 外部クリックで閉じる
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // クリーンアップ
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    // ✅ 選択処理
    const handleSelect = (id: string) => {
        onChangeWO(id);
        setOpen(false);
    };

    const selectedLabel =
        workOrders.find((wo) => wo.id === selectedWO)?.name || '対象WOを選択';

    return (
        <div ref={wrapperRef} className={`header-select-wrapper ${open ? 'open' : ''}`}>
            <div
                className="header-search"
                onClick={() => setOpen((prev) => !prev)}
            >
                <span
                    className={`header-input-text ${!selectedWO ? 'placeholder' : ''
                        }`}
                >
                    {selectedLabel}
                </span>
                <FaIcons.FaChevronDown className="header-icon" />
            </div>

            {open && (
                <div className="header-option-list">
                    {workOrders.length === 0 ? (
                        <div className="header-option empty">データがありません</div>
                    ) : (
                        workOrders.map((wo) => (
                            <div
                                key={wo.id}
                                className={`header-option ${wo.id === selectedWO ? 'selected' : ''
                                    }`}
                                onClick={() => handleSelect(wo.id)}
                            >
                                {wo.name}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
