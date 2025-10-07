import React from 'react';
import './Header.css';
import { HeaderSearch } from './HeaderSearch';
import { UploadButton } from './UploadButton';

interface HeaderProps {
    workOrders: { id: string; name: string }[];
    selectedWO: string;
    setSelectedWO: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
    workOrders,
    selectedWO,
    setSelectedWO,
}) => {
    return (
        <header className="header-container">
            <div className="header-left">
                <h1 className="header-title">Time Sheet</h1>
            </div>

            <div className="header-right">
                <span className="header-label">対象WO</span>
                <HeaderSearch
                    workOrders={workOrders}
                    selectedWO={selectedWO}
                    onChangeWO={setSelectedWO}
                />
                <UploadButton />
            </div>
        </header>
    );
};
