import React from 'react';
import * as FaIcons from 'react-icons/fa';
import './Footer.css';

interface FooterProps {
    onOpenFavoriteModal: () => void;
    onOpenUserListModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
    onOpenFavoriteModal,
    onOpenUserListModal,
}) => {
    return (
        <footer className="footer-container">
            <div className="footer-right">
                <button className="footer-button" onClick={onOpenUserListModal}>
                    <FaIcons.FaUser className="footer-icon" />
                    ユーザー一覧設定
                </button>
                <button className="footer-button" onClick={onOpenFavoriteModal}>
                    <FaIcons.FaTasks className="footer-icon" />
                    お気に入り間接タスク設定
                </button>
            </div>
        </footer>
    );
};
