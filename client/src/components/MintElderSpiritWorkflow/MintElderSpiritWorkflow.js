import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { MINT_ELDER_SPIRIT_STEPS } from '../../constants';
import {
    incrementActiveStepAction,
    setActiveStepAction,
    setElderStoneAction,
    setMaxStepsAction
} from '../../redux/actions';
import { StoneSelector } from '../StoneSelector';

export const MintElderSpirintWorkflowComp = ({ currentStep, selectStone, incrementCurrentStep, setMaxSteps }) => {
    useEffect(() => {
        const numSteps = Object.keys(MINT_ELDER_SPIRIT_STEPS).length;
        setMaxSteps(numSteps);
    }, []);
    const handleOnSelectStone = (stone) => {
        selectStone(stone);
        incrementCurrentStep();
    };
    switch (currentStep) {
        case MINT_ELDER_SPIRIT_STEPS.CHOOSE_STONE:
            return <StoneSelector onSelect={handleOnSelectStone} />;
        case MINT_ELDER_SPIRIT_STEPS.CHOOSE_RACE:
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
        incrementCurrentStep: () => {
            dispatch(incrementActiveStepAction);
        }
    };
};

export const MintElderSpirintWorkflow = connect(mapStateToProps, mapDispatchToProps)(MintElderSpirintWorkflowComp);
