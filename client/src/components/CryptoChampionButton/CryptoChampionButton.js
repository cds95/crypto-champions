import { Button } from '@material-ui/core';
import React from 'react';
import './CryptoChampionButton.css';
import clsx from 'clsx';

export const CryptoChampionButton = ({ label, isSecondary, size = 'large', ...props }) => {
    const className = clsx('crypto-champion-button', {
        'crypto-champion-button--secondary': isSecondary
    });
    return (
        <Button size={size} className={className} {...props} variant="contained" color="primary">
            {label}
        </Button>
    );
};
