import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { DuelModalConfirmStep } from './DuelModalConfirmStep';
import { DuelModalTransferStep } from './DuelModalTransferStep';
import './DuelModal.css';
import { getHero, getUserOwnedHeros } from '../../redux/selectors';
import { resetDuelAction, setDuelBetAmountAction, setDuelInitiatorHeroAction } from '../../redux/actions';
import { DuelForm } from './DuelForm';
import { CryptoChampionButton } from '../CryptoChampionButton';

const text = {
    confirmOpponentTitle: 'Confirm your opponent',
    selectYourChampionTitle: 'Select your champion',
    next: 'Next',
    back: 'Back',
    cancel: 'Cancel'
};

const MODAL_STEPS = {
    CONFIRM_OPPONENT: 0,
    FORM: 1,
    TRANSFER: 2
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
    resetDuel
}) => {
    const [currentStep, setCurrentStep] = useState(MODAL_STEPS.CONFIRM_OPPONENT);
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
        case MODAL_STEPS.FORM:
            title = text.selectYourChampionTitle;
            content = (
                <DuelForm
                    userHeroes={userHeroes}
                    onSelectUserHero={selectUserHero}
                    selectedUserHeroId={initiatorHeroId}
                />
            );
            actions = (
                <React.Fragment>
                    <CryptoChampionButton label={text.back} onClick={goToPreviousStep} />
                    <CryptoChampionButton label={text.next} onClick={goToNextStep} disabled={!initiatorHeroId} />
                </React.Fragment>
            );
            break;
        case MODAL_STEPS.TRANSFER:
            content = <DuelModalTransferStep />;
            break;
        default:
            throw new Error(`${currentStep} is invalid`);
    }

    return (
        <Dialog className="duel-modal" open={isOpen} onClose={handleOnClose}>
            <DialogTitle className="duel-modal__title">{title}</DialogTitle>
            <DialogContent className="duel-modal__content">{content}</DialogContent>
            <DialogActions>
                <CryptoChampionButton label={text.cancel} onClick={handleOnClose} />
                {actions}
            </DialogActions>
        </Dialog>
    );
};

const mapStateToProps = (state) => {
    const {
        duel: { opponentHeroId, bet, initiatorHeroId }
    } = state;
    return {
        opponentHero: getHero(state, opponentHeroId),
        userHeroes: getUserOwnedHeros(state),
        bet,
        initiatorHeroId
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
