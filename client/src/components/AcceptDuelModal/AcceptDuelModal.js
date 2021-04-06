import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import React, { useState } from 'react';
import { acceptDuel, joinDuel } from '../../services/weatherWars';
import { CryptoChampionButton } from '../CryptoChampionButton';
import { AcceptDuelModalContent } from './AcceptDuelModalContent';

export const AcceptDuelModal = ({ isOpen, onClose, bet, duelAddress }) => {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <AcceptDuelModalContent onClose={onClose} bet={bet} duelAddress={duelAddress} />
        </Dialog>
    );
};
