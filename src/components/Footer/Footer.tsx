import React from 'react';
import * as FaIcons from 'react-icons/fa';
import './Footer.css';

export const Footer: React.FC = () => {
    return (
        <footer className="footer-container">
            <div className="footer-right">
                <button className="footer-button">
                    <FaIcons.FaUser className="footer-icon" />
                    ユーザー一覧
                </button>
                <button className="footer-button">
                    <FaIcons.FaTasks className="footer-icon" />
                    お気に入り間接タスク設定
                </button>
            </div>
        </footer>
    );
};
