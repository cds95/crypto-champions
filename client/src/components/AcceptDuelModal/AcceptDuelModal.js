import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import React, { useState } from 'react';
import { displayToken } from '../../AppUtils';
import { joinDuel } from '../../services/weatherWars';
import { CryptoChampionButton } from '../CryptoChampionButton';

const text = {
    accept: 'Accept Duel',
    instruction: (minBet) => `You must send ${displayToken(minBet)} CC to accept the challenge`,
    confirm: 'Send',
    cancel: 'Cancel'
};

export const AcceptDuelModal = ({ isOpen, onClose, bet, duelAddress }) => {
    const [isJoiningDuel, setIsJoiningDuel] = useState(false);
    const acceptChallenge = async () => {
        setIsJoiningDuel(true);
        await joinDuel(duelAddress, bet);
        setIsJoiningDuel(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="accept-duel-modal">
            <DialogTitle className="accept-duel-modal__title">{text.accept}</DialogTitle>
            <DialogContent className="accept-duel-modal__content">
                {isJoiningDuel ? <CircularProgress /> : text.instruction(bet)}
            </DialogContent>
            <DialogActions>
                <CryptoChampionButton onClick={onClose} label={text.cancel} />
                <CryptoChampionButton onClick={acceptChallenge} label={text.accept} />
            </DialogActions>
        </Dialog>
    );
};
