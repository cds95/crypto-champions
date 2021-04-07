import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { DuelModalConfirmStep } from './DuelModalConfirmStep';
import './DuelModal.css';
import { getHero, getUserOwnedHeros } from '../../redux/selectors';
import { resetDuelAction, setDuelBetAmountAction, setDuelInitiatorHeroAction } from '../../redux/actions';
import { DuelForm } from './DuelForm';
import { CryptoChampionButton } from '../CryptoChampionButton';
import { challengeToDuel } from '../../services/weatherWars';
import { allowWeatherWarToTransferBet } from '../../services/cryptoChampions';
import { displayToken } from '../../AppUtils';

const text = {
    confirmOpponentTitle: 'Confirm your opponent',
    selectYourChampionTitle: 'Select your champion',
    allowTransfer: 'Allow Transfer',
    next: 'Next',
    back: 'Back',
    cancel: 'Cancel',
    createDuel: 'Create Duel',
    approve: 'Authorize',
    authorizeText: (bet) => `You need to authorize the transfer of ${bet} CC to start the duel.`
};

const MODAL_STEPS = {
    CONFIRM_OPPONENT: 0,
    ALLOW_TRANSFER: 1,
    FORM: 2
};

export const DuelModalComp = ({
    isOpen,
    onClose,
    opponentHero,
    setDuelBet,
    bet,
    userHeroes,
    initiatorHeroId,
    setDuelInitiatorHero,
    resetDuel,
    opponentAddress
}) => {
    const [currentStep, setCurrentStep] = useState(MODAL_STEPS.CONFIRM_OPPONENT);
    const [isCreatingDuel, setIsCreatingDuel] = useState(false);
    const [isApprovingTransfer, setIsApprovingTransfer] = useState(false);
    let content;
    let actions;
    let title;
    const handleOnBetChange = (e) => setDuelBet(e.target.value);
    const goToNextStep = () => setCurrentStep(currentStep + 1);
    const goToPreviousStep = () => setCurrentStep(currentStep - 1);
    const selectUserHero = (hero) => setDuelInitiatorHero(hero.id);
    const handleOnClose = () => {
        onClose();
        resetDuel();
        setCurrentStep(MODAL_STEPS.CONFIRM_OPPONENT);
    };

    const createDuel = async () => {
        setIsCreatingDuel(true);
        await challengeToDuel(bet, initiatorHeroId, opponentAddress, opponentHero.id);
        setIsCreatingDuel(false);
        onClose();
    };

    const authorizeTransfer = async () => {
        setIsApprovingTransfer(true);
        try {
            await allowWeatherWarToTransferBet();
            goToNextStep();
        } catch (e) {
            console.error(e);
        }
        setIsApprovingTransfer(false);
    };

    switch (currentStep) {
        case MODAL_STEPS.CONFIRM_OPPONENT:
            title = text.confirmOpponentTitle;
            content = <DuelModalConfirmStep opponentHero={opponentHero} onBetChange={handleOnBetChange} bet={bet} />;
            actions = (
                <React.Fragment>
                    <CryptoChampionButton label={text.next} onClick={goToNextStep} disabled={!bet} />
                </React.Fragment>
            );
            break;
        case MODAL_STEPS.ALLOW_TRANSFER:
            title = text.approveTransfer;
            content = isApprovingTransfer ? <CircularProgress /> : text.authorizeText(bet);
            actions = (
                <React.Fragment>
                    <CryptoChampionButton label={text.back} onClick={goToPreviousStep} />
                    <CryptoChampionButton label={text.approve} onClick={authorizeTransfer} />
                </React.Fragment>
            );
            break;
        case MODAL_STEPS.FORM:
            title = text.selectYourChampionTitle;
            content = isCreatingDuel ? (
                <CircularProgress />
            ) : (
                <DuelForm
                    userHeroes={userHeroes}
                    onSelectUserHero={selectUserHero}
                    selectedUserHeroId={initiatorHeroId}
                />
            );
            actions = (
                <React.Fragment>
                    <CryptoChampionButton label={text.back} onClick={goToPreviousStep} />
                    <CryptoChampionButton label={text.createDuel} onClick={createDuel} disabled={!initiatorHeroId} />
                </React.Fragment>
            );
            break;
        default:
            throw new Error(`${currentStep} is invalid`);
    }

    return (
        <Dialog className="duel-modal" open={isOpen} onClose={handleOnClose}>
            <DialogTitle className="duel-modal__title">{title}</DialogTitle>
            <DialogContent className="duel-modal__content pronciono">{content}</DialogContent>
            <DialogActions>
                <CryptoChampionButton label={text.cancel} onClick={handleOnClose} />
                {actions}
            </DialogActions>
        </Dialog>
    );
};

const mapStateToProps = (state) => {
    const {
        duel: { opponentHeroId, bet, initiatorHeroId, opponentAddress }
    } = state;
    return {
        opponentHero: getHero(state, opponentHeroId),
        userHeroes: getUserOwnedHeros(state),
        bet,
        initiatorHeroId,
        opponentAddress
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setDuelBet: (bet) => {
            dispatch(setDuelBetAmountAction(bet));
        },
        setDuelInitiatorHero: (heroId) => {
            dispatch(setDuelInitiatorHeroAction(heroId));
        },
        resetDuel: () => {
            dispatch(resetDuelAction());
        }
    };
};
export const DuelModal = connect(mapStateToProps, mapDispatchToProps)(DuelModalComp);
