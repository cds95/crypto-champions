import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { MINT_ELDER_SPIRIT_STEPS } from '../../constants';
import {
    incrementActiveStepAction,
    setActiveStepAction,
    setElderRaceAction,
    setElderStoneAction,
    setMaxStepsAction,
    setElderClassAction,
    setAffinityAction
} from '../../redux/actions';
import { ClassSelector } from '../ClassSelector';
import { MintElderConfirmation } from '../MintElderConfirmation';
import { RaceSelector } from '../RaceSelector';
import { StoneSelector } from '../StoneSelector';

export const MintElderSpirintWorkflowComp = ({
    currentStep,
    selectStone,
    incrementCurrentStep,
    setMaxSteps,
    selectRace,
    selectAffinity,
    selectElderClass,
    selectedClass,
    selectedRace,
    selectedAffinity,
    selectedStone
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
    const handleOnSelectClass = (elderClass) => {
        selectElderClass(elderClass);
        incrementCurrentStep();
    };
    const handleOnSelectAffinity = (affinity) => selectAffinity(affinity);
    const handleOnConfirm = () => {};
    switch (currentStep) {
        case MINT_ELDER_SPIRIT_STEPS.CHOOSE_STONE:
            return <StoneSelector onSelect={handleOnSelectStone} />;
        case MINT_ELDER_SPIRIT_STEPS.CHOOSE_RACE:
            return <RaceSelector onSelect={handleOnSelectRace} />;
        case MINT_ELDER_SPIRIT_STEPS.CHOOSE_CLASS:
            return <ClassSelector onSelect={handleOnSelectClass} />;
        case MINT_ELDER_SPIRIT_STEPS.MINT:
            return (
                <MintElderConfirmation
                    selectedAffinity={selectedAffinity}
                    race={selectedRace}
                    elderClass={selectedClass}
                    onSelectAffinity={handleOnSelectAffinity}
                    onConfirm={handleOnConfirm}
                />
            );
        default:
            return <></>;
    }
};

const mapStateToProps = (state) => {
    const {
        workflow: { currentStep, maxSteps },
        mintElderSpiritWorkflow: { race, elderClass, stone, affinity }
    } = state;
    return {
        currentStep,
        maxSteps,
        selectedRace: race,
        selectedClass: elderClass,
        selectedStone: stone,
        selectedAffinity: affinity
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
        selectElderClass: (elderClass) => {
            dispatch(setElderClassAction(elderClass));
        },
        selectAffinity: (affinity) => {
            dispatch(setAffinityAction(affinity));
        },
        incrementCurrentStep: () => {
            dispatch(incrementActiveStepAction);
        }
    };
};

export const MintElderSpirintWorkflow = connect(mapStateToProps, mapDispatchToProps)(MintElderSpirintWorkflowComp);
