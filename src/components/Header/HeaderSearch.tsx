import React from 'react';
import * as FaIcons from 'react-icons/fa';
import './Header.css';

export const HeaderSearch: React.FC = () => {
    return (
        <div className="header-search">
            <input
                type="text"
                placeholder="対象WOを選択"
                className="header-input"
            />
            <FaIcons.FaChevronDown className="header-icon" />
        </div>
    );
};
