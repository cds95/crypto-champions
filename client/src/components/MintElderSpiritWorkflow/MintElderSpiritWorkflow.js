import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { MINT_ELDER_SPIRIT_STEPS } from '../../constants';
import {
    incrementActiveStepAction,
    setActiveStepAction,
    setElderRaceAction,
    setElderStoneAction,
    setMaxStepsAction
} from '../../redux/actions';
import { RaceSelector } from '../RaceSelector';
import { StoneSelector } from '../StoneSelector';

export const MintElderSpirintWorkflowComp = ({
    currentStep,
    selectStone,
    incrementCurrentStep,
    setMaxSteps,
    selectRace
}) => {
    useEffect(() => {
        const numSteps = Object.keys(MINT_ELDER_SPIRIT_STEPS).length;
        setMaxSteps(numSteps);
    }, []);
    const handleOnSelectStone = (stone) => {
        selectStone(stone);
        incrementCurrentStep();
    };
    const handleOnSelectRace = (race) => {
        selectRace(race);
        incrementCurrentStep();
    };
    switch (currentStep) {
        case MINT_ELDER_SPIRIT_STEPS.CHOOSE_STONE:
            return <StoneSelector onSelect={handleOnSelectStone} />;
        case MINT_ELDER_SPIRIT_STEPS.CHOOSE_RACE:
            return <RaceSelector onSelect={handleOnSelectRace} />;
        case MINT_ELDER_SPIRIT_STEPS.CHOOSE_CLASS:
        case MINT_ELDER_SPIRIT_STEPS.MINT:
        default:
            return <></>;
    }
};

const mapStateToProps = (state) => {
    const {
        workflow: { currentStep, maxSteps }
    } = state;
    return {
        currentStep,
        maxSteps
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setMaxSteps: (maxSteps) => {
            dispatch(setMaxStepsAction(maxSteps));
        },
        setCurrentStep: (currentStep) => {
            dispatch(setActiveStepAction(currentStep));
        },
        selectStone: (stone) => {
            dispatch(setElderStoneAction(stone));
        },
        selectRace: (race) => {
            dispatch(setElderRaceAction(race));
        },
        incrementCurrentStep: () => {
            dispatch(incrementActiveStepAction);
        }
    };
};

export const MintElderSpirintWorkflow = connect(mapStateToProps, mapDispatchToProps)(MintElderSpirintWorkflowComp);
