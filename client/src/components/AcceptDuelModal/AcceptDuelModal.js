import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import React, { useState } from 'react';
import { displayToken } from '../../AppUtils';
import { joinDuel } from '../../services/weatherWars';
import { CryptoChampionButton } from '../CryptoChampionButton';

const text = {
    accept: 'Accept Duel',
    instruction: (minBet) => `You must send ${displayToken(minBet)} CC to accept the challenge`,
    confirm: 'Send',
    cancel: 'Cancel',
    ok: 'ok',
    comeback: 'You have accepted the challenge!  Come back in a while to see when the duel is ready to start.'
};

export const AcceptDuelModal = ({ isOpen, onClose, bet, duelAddress }) => {
    const [isJoiningDuel, setIsJoiningDuel] = useState(false);
    const [hasAccepted, setHasAccepted] = useState(false);
    const acceptChallenge = async () => {
        setIsJoiningDuel(true);
        await joinDuel(duelAddress, bet);
        setIsJoiningDuel(false);
        setHasAccepted(true);
    };

    let content;
    let actions;
    if (hasAccepted) {
        content = text.comeback;
        actions = <CryptoChampionButton onClick={onClose} label={text.ok} />;
    } else {
        content = (
            <DialogContent className="accept-duel-modal__content">
                {isJoiningDuel ? <CircularProgress /> : text.instruction(bet)}
            </DialogContent>
        );
        actions = <CryptoChampionButton onClick={acceptChallenge} label={text.ok} />;
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className="accept-duel-modal">
            <DialogTitle className="accept-duel-modal__title">{text.accept}</DialogTitle>
            <DialogContent className="accept-duel-modal__content">{content}</DialogContent>
            <DialogActions>
                <CryptoChampionButton onClick={onClose} label={text.cancel} />
                {actions}
            </DialogActions>
        </Dialog>
    );
};
