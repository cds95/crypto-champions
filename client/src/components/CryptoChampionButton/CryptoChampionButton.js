import { Button } from '@material-ui/core';
import React from 'react';
import './CryptoChampionButton.css';

export const CryptoChampionButton = ({ label, size = 'large', ...props }) => {
    return (
        <Button size={size} className="crypto-champion-button" {...props} variant="contained" color="primary">
            {label}
        </Button>
    );
};
