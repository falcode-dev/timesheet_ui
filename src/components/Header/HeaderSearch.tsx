import React from 'react';
import './Header.css';

export const HeaderSearch: React.FC = () => {
    return (
        <div className="header-search">
            <input
                type="text"
                placeholder="対象WOを選択"
                className="header-input"
            />
            <span className="header-icon">▾</span>
        </div>
    );
};
