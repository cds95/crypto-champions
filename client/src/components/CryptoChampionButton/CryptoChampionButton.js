import { Button } from '@material-ui/core';
import React from 'react';
import './CryptoChampionButton.css';

export const CryptoChampionButton = ({ label, ...props }) => {
    return (
        <Button className="crypto-champion-button" {...props} variant="contained" color="primary">
            {label}
        </Button>
    );
};
