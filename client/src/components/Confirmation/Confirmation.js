import { CircularProgress, Dialog, DialogActions, DialogContent, Modal } from '@material-ui/core';
import React from 'react';
import { CryptoChampionButton } from '../CryptoChampionButton';

export const Confirmation = ({ isOpen, text, isLoading, actionText = 'ok', onConfirm, loadingText }) => {
    return (
        <Dialog open={isOpen}>
            <DialogContent className="confirmation__content">
                {isLoading ? (
                    <React.Fragment>
                        {loadingText}
                        <CircularProgress />
                    </React.Fragment>
                ) : (
                    text
                )}
            </DialogContent>
            <DialogActions>
                <CryptoChampionButton label={actionText} onClick={onConfirm} />
            </DialogActions>
        </Dialog>
    );
};
