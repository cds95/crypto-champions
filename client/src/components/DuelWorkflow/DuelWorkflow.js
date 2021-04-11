import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
    setDuelBetAmountAction,
    setDuelOpponentHeroAction,
    setDuelWorkflowStepAction,
    setDuelInitiatorHeroAction
} from '../../redux/actions';
import { getHero, getHerosUserCanChallenge, getUserOwnedHeroes } from '../../redux/selectors';
import { CryptoChampionButton } from '../CryptoChampionButton';
import { HorizontalHeroCard } from '../HorizontalHeroCard/HorizontalHeroCard';
import { ProgressIndicator } from '../ProgressIndicator';
import { DUEL_WORKFLOW_STEPS_MAP } from '../../constants';
import './DuelWorkflow.css';
import { CircularProgress, Dialog, DialogActions, DialogContent, TextField, Typography } from '@material-ui/core';
import { allowWeatherWarToTransferBet } from '../../services/cryptoChampions';
import { challengeToDuel } from '../../services/weatherWars';
import { HeroCard } from '../HeroCard';

const text = {
    authorize: 'Authorize',
    challenge: 'Challenge',
    next: 'Next',
    back: 'Back',
    wager: 'How much do you wish do wager?',
    authorizeText: (bet) => `You need to authorize the transfer of ${bet} CC to continue.`,
    cancel: 'Cancel',
    proceed: 'Proceed',
    hasAuthorized: 'Successfully authorized.  Click proceed to continue',
    select: 'Select',
    selectHeroLabel: 'Which Champion do you want to duel with?',
    createDuel: 'Confirm',
    hasCreatedDuel: 'Duel Successfully created.'
};

const DUEL_WORKFLOW_STEPS = [
    {
        id: DUEL_WORKFLOW_STEPS_MAP.SELECT_OPPONENT,
        label: 'Select Opponent'
    },
    {
        id: DUEL_WORKFLOW_STEPS_MAP.WAGER,
        label: 'Confirm wager'
    },
    {
        id: DUEL_WORKFLOW_STEPS_MAP.CONFIRM,
        label: 'Confirm duel'
    }
];

export const DuelWorkflowComp = ({
    heroesUserCanChallenge,
    setDuelOpponentHero,
    currentStep,
    opponent,
    setDuelBet,
    setDuelStep,
    bet,
    initiatorHeroId,
    opponentAddress,
    userHeroes,
    setDuelInitiatorHero
}) => {
    const [isAuthorizeModalOpen, setIsAuthorizeModalOpen] = useState(false);
    const [isAuthorizing, setIsAuthorizing] = useState(false);
    const [hasAuthorized, setHasAuthorized] = useState(false);
    const openAuthorizeModal = () => setIsAuthorizeModalOpen(true);
    const closeAuthorizeModal = () => setIsAuthorizeModalOpen(false);

    const [isCreateDuelModalOpen, setIsCreateDuelModalOpen] = useState(false);
    const [isCreatingDuel, setIsCreatingDuel] = useState(false);
    const [hasCreatedDuel, setHasCreatedDuel] = useState(false);
    const openCreateDuelModal = () => setIsCreateDuelModalOpen(true);
    const closeCreateDuelModal = () => setIsCreateDuelModalOpen(false);

    const authorizeTransfer = async () => {
        setIsAuthorizing(true);
        try {
            await allowWeatherWarToTransferBet();
        } catch (e) {
            console.error(e);
        }
        setIsAuthorizing(false);
        setHasAuthorized(true);
    };
    const createDuel = async () => {
        setIsCreatingDuel(true);
        await challengeToDuel(bet, initiatorHeroId, opponentAddress, opponent.id);
        setIsCreatingDuel(false);
        closeCreateDuelModal();
    };
    const goToNextStep = () => setDuelStep(currentStep + 1);
    let content;
    switch (currentStep) {
        case DUEL_WORKFLOW_STEPS_MAP.SELECT_OPPONENT:
            content = (
                <React.Fragment>
                    {heroesUserCanChallenge.map((hero) => (
                        <div className="duel-workflow__card">
                            <HorizontalHeroCard
                                hero={hero}
                                action={
                                    <CryptoChampionButton
                                        label={text.challenge}
                                        onClick={() => setDuelOpponentHero(hero.id, hero.owner)}
                                        size="small"
                                    />
                                }
                            />
                        </div>
                    ))}
                </React.Fragment>
            );
            break;
        case DUEL_WORKFLOW_STEPS_MAP.WAGER:
            const changeBet = (e) => setDuelBet(e.target.value);
            content = (
                <React.Fragment>
                    <HorizontalHeroCard hero={opponent} />
                    <Dialog
                        className="duel-workflow__authorize"
                        open={isAuthorizeModalOpen}
                        onClose={closeAuthorizeModal}
                    >
                        <DialogContent className="duel-workflow__modal-content">
                            {isAuthorizing ? (
                                <CircularProgress />
                            ) : hasAuthorized ? (
                                text.hasAuthorized
                            ) : (
                                text.authorizeText(bet)
                            )}
                        </DialogContent>
                        <DialogActions>
                            <CryptoChampionButton label={text.cancel} onClick={closeAuthorizeModal} />
                            <CryptoChampionButton
                                label={hasAuthorized ? text.proceed : text.authorize}
                                onClick={
                                    hasAuthorized ? () => goToNextStep() && closeAuthorizeModal() : authorizeTransfer
                                }
                            />
                        </DialogActions>
                    </Dialog>
                    <div className="duel-workflow__wager-form">
                        <Typography className="duel-workflow__wager-label">{text.wager}</Typography>
                        <TextField
                            className="duel-worfklow__bet"
                            label={text.betField}
                            value={bet || ''}
                            onChange={changeBet}
                            type="number"
                        />
                    </div>
                </React.Fragment>
            );
            break;
        default:
            content = (
                <React.Fragment>
                    <HorizontalHeroCard hero={opponent} />
                    <Typography className="duel-workflow__select-hero-label">{text.selectHeroLabel}</Typography>
                    <Dialog
                        className="duel-workflow__creating-duel"
                        open={isCreateDuelModalOpen}
                        onClose={closeCreateDuelModal}
                    >
                        <DialogContent className="duel-workflow__modal-content">
                            {isCreatingDuel ? <CircularProgress /> : hasCreatedDuel ? text.hasCreatedDuel : ''}
                        </DialogContent>
                        <DialogActions>
                            <CryptoChampionButton label={text.cancel} onClick={closeCreateDuelModal} />
                            <CryptoChampionButton
                                label={hasAuthorized ? text.proceed : text.authorize}
                                onClick={closeCreateDuelModal}
                            />
                        </DialogActions>
                    </Dialog>
                    <div className="duel-worfklow__select-hero">
                        {userHeroes.map((hero) => (
                            <div className="duel-workflow__select-hero-item">
                                <HeroCard
                                    shouldOnlyShowImage={true}
                                    hero={hero}
                                    isSelected={hero.id === initiatorHeroId}
                                    action={
                                        <CryptoChampionButton
                                            label={text.select}
                                            onClick={() => setDuelInitiatorHero(hero.id)}
                                            size="small"
                                        />
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </React.Fragment>
            );
            break;
    }
    const isNextButtonDisabled = () => {
        return (
            (currentStep === DUEL_WORKFLOW_STEPS_MAP.WAGER && !bet) ||
            (currentStep === DUEL_WORKFLOW_STEPS_MAP.CONFIRM && !initiatorHeroId)
        );
    };
    const handleNext = async () => {
        if (currentStep == DUEL_WORKFLOW_STEPS_MAP.SELECT_OPPONENT) {
            setDuelStep(currentStep + 1);
        } else if (currentStep == DUEL_WORKFLOW_STEPS_MAP.WAGER) {
            if (hasAuthorized) {
                setDuelStep(currentStep + 1);
            } else {
                openAuthorizeModal();
            }
        } else {
            openCreateDuelModal();
            await createDuel();
        }
    };

    return (
        <div className="duel-workflow">
            <div className="duel-workflow__progress">
                <ProgressIndicator
                    steps={DUEL_WORKFLOW_STEPS}
                    currentStep={currentStep}
                    maxSteps={DUEL_WORKFLOW_STEPS.length}
                />
            </div>
            <div className="duel-workflow__content">{content}</div>
            <div className="duel-workflow__actions">
                {currentStep > 0 && (
                    <div className="duel-workflow__nav">
                        <CryptoChampionButton label={text.back} onClick={() => setDuelStep(currentStep - 1)} />
                    </div>
                )}
                {currentStep >= 1 && (
                    <div className="duel-workflow__nav">
                        <CryptoChampionButton
                            label={currentStep === DUEL_WORKFLOW_STEPS_MAP.CONFIRM ? text.createDuel : text.next}
                            onClick={() => handleNext()}
                            disabled={isNextButtonDisabled()}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    const {
        duel: { currentStep, opponentHeroId, bet, opponentAddress, initiatorHeroId }
    } = state;
    return {
        heroesUserCanChallenge: getHerosUserCanChallenge(state),
        currentStep,
        opponent: getHero(state, opponentHeroId),
        bet,
        initiatorHeroId,
        opponentAddress,
        userHeroes: getUserOwnedHeroes(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setDuelOpponentHero: (heroId, opponentAddress) => {
            dispatch(setDuelOpponentHeroAction(heroId, opponentAddress));
        },
        setDuelBet: (bet) => {
            dispatch(setDuelBetAmountAction(bet));
        },
        setDuelStep: (currentStep) => {
            dispatch(setDuelWorkflowStepAction(currentStep));
        },
        setDuelInitiatorHero: (heroId) => {
            dispatch(setDuelInitiatorHeroAction(heroId));
        }
    };
};

export const DuelWorkflow = connect(mapStateToProps, mapDispatchToProps)(DuelWorkflowComp);
