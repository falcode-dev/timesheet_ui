import React from 'react';
import { FaUpload } from 'react-icons/fa';
import './Header.css';

export const UploadButton: React.FC = () => {
    return (
        <button className="upload-button">
            <FaUpload className="upload-icon" />
            アップロード
        </button>
    );
};
