import { CircularProgress, Dialog, DialogActions, DialogContent, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { PHASES } from '../../constants';
import { refreshPhase } from '../../services/cryptoChampions';
import { CryptoChampionButton } from '../CryptoChampionButton';

const text = {
    refreshToSetup: 'Transition to setup phase',
    refreshToAction: 'Transition to action phase',
    refreshing: 'Refreshing phase...',
    failedToRefresh: 'Failed to advance phase',
    finishedAdvancing: 'Succesfully advanced phase',
    ok: 'Ok'
};

export const RefreshPhaseButton = ({ currentPhase }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasRefreshed, setHasRefresehd] = useState(false);
    const [failedToRefresh, setFailedToRefresh] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const tryRefreshPhase = async () => {
        openModal();
        setIsRefreshing(true);
        try {
            await refreshPhase();
            setHasRefresehd(true);
        } catch (e) {
            setFailedToRefresh(true);
        }
        setIsRefreshing(false);
    };

    let modalText;
    if (isRefreshing) {
        modalText = text.refreshing;
    } else if (hasRefreshed) {
        modalText = text.finishedAdvancing;
    } else if (failedToRefresh) {
        modalText = text.failedToRefresh;
    }
    return (
        <React.Fragment>
            <CryptoChampionButton
                label={currentPhase === PHASES.ACTION ? text.refreshToSetup : text.refreshToAction}
                onClick={tryRefreshPhase}
            />
            <Dialog open={isModalOpen}>
                <DialogContent>
                    <Typography className="refresh-button__modal">
                        {isRefreshing ? (
                            <React.Fragment>
                                <Typography>{text.refreshing}</Typography>
                                <CircularProgress />
                            </React.Fragment>
                        ) : (
                            modalText
                        )}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <CryptoChampionButton isSecondary={true} label={text.ok} onClick={closeModal} />
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};
