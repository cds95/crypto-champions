import { Button } from '@material-ui/core';
import React from 'react';
import './CryptoChampionButton.css';
import clsx from 'clsx';

export const CryptoChampionButton = ({ label, isSecondary, size = 'large', className, ...props }) => {
    const buttonClassName = clsx('crypto-champion-button', {
        'crypto-champion-button--secondary': isSecondary,
        [`${className}`]: !!className
    });
    return (
        <Button size={size} className={buttonClassName} {...props} variant="contained" color="primary">
            {label}
        </Button>
    );
};
