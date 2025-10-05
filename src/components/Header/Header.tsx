import React from 'react';
import './Header.css';
import { HeaderSearch } from './HeaderSearch';
import { UploadButton } from './UploadButton';

export const Header: React.FC = () => {
    return (
        <header className="header-container">
            <div className="header-left">
                <h1 className="header-title">Time Sheet</h1>
            </div>

            <div className="header-right">
                <span className="header-label">対象WO</span>
                <HeaderSearch />
                <UploadButton />
            </div>
        </header>
    );
};
