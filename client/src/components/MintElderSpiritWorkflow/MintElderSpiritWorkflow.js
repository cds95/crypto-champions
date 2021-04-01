import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { MINT_ELDER_SPIRIT_STEPS } from '../../constants';
import {
    incrementActiveStepAction,
    setActiveStepAction,
    setElderRaceAction,
    setElderStoneAction,
    setMaxStepsAction,
    setElderClassAction,
    setAffinityAction,
    setIsMintingElderSpiritAction,
    resetMintingElderSpiritWorkflowAction,
    decrementActiveStepAction
} from '../../redux/actions';
import { getAllowedAffinities } from '../../redux/selectors';
import { mintElderSpirit } from '../../services/cryptoChampions';
import { ClassSelector } from '../ClassSelector';
import { Confirmation } from '../Confirmation';
import { MintElderConfirmation } from '../MintElderConfirmation';
import { RaceSelector } from '../RaceSelector';
import { StoneSelector } from '../StoneSelector';
import { useHistory } from 'react-router-dom';
import { routeDefinitions } from '../../routeDefinitions';
import { CryptoChampionButton } from '../CryptoChampionButton';

const text = {
    confirmation: 'Successfully purchased elder',
    processing: 'Processing...',
    back: 'Back',
    next: 'Next'
};

export const MintElderSpirintWorkflowComp = ({
    affinities,
    currentStep,
    selectStone,
    elderSpirits,
    incrementCurrentStep,
    decrementCurrentStep,
    maxElderSpirits,
    setMaxSteps,
    selectRace,
    selectAffinity,
    selectElderClass,
    selectedClass,
    selectedRace,
    selectedAffinity,
    selectedStone,
    setIsMinting,
    isMinting,
    resetMintingElderSpiritWorkflow
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
    };
    const handleOnSelectClass = (elderClass) => {
        selectElderClass(elderClass);
    };
    const handleOnSelectAffinity = (affinity) => selectAffinity(affinity);
    const handleOnConfirm = async () => {
        setIsModalOpen(true);
        const raceId = selectedRace.id;
        const classId = selectedClass.id;
        const affinity = selectedAffinity;
        setIsMinting(true);
        await mintElderSpirit(raceId, classId, affinity);
        setIsMinting(false);
    };
    const history = useHistory();
    const handleOnCloseModal = () => {
        history.push(routeDefinitions.ROOT);
        resetMintingElderSpiritWorkflow();
    };

    let content;
    switch (currentStep) {
        case MINT_ELDER_SPIRIT_STEPS.CHOOSE_STONE:
            content = (
                <StoneSelector
                    maxStones={maxElderSpirits}
                    onSelect={handleOnSelectStone}
                    selectedStoneId={selectedStone ? selectedStone.id : ''}
                    elderSpirits={elderSpirits}
                    maxElderSpirits={maxElderSpirits}
                />
            );
            break;
        case MINT_ELDER_SPIRIT_STEPS.CHOOSE_RACE:
            const mintedRaces = elderSpirits.map((spirit) => spirit.raceId);
            content = (
                <RaceSelector
                    onSelect={handleOnSelectRace}
                    selectedRaceId={selectedRace ? selectedRace.id : ''}
                    mintedRaces={mintedRaces}
                />
            );
            break;
        case MINT_ELDER_SPIRIT_STEPS.CHOOSE_CLASS:
            content = (
                <ClassSelector onSelect={handleOnSelectClass} selectedClassId={selectedClass ? selectedClass.id : ''} />
            );
            break;
        case MINT_ELDER_SPIRIT_STEPS.MINT:
            content = (
                <MintElderConfirmation
                    affinities={affinities}
                    selectedAffinity={selectedAffinity}
                    race={selectedRace}
                    elderClass={selectedClass}
                    onSelectAffinity={handleOnSelectAffinity}
                    onConfirm={handleOnConfirm}
                />
            );
            break;
        default:
            content = <></>;
    }
    return (
        <React.Fragment>
            <Confirmation
                isOpen={isModalOpen}
                isLoading={isMinting}
                text={text.confirmation}
                loadingText={text.processing}
                onConfirm={handleOnCloseModal}
            />
            {content}
            <div className="mint-elder-spirit__actions">
                {currentStep > 0 && (
                    <div className="mint-elder-spirit__nav">
                        <CryptoChampionButton label={text.back} onClick={decrementCurrentStep} />
                    </div>
                )}
                {currentStep >= 1 && currentStep < Object.keys(MINT_ELDER_SPIRIT_STEPS).length - 1 && (
                    <div className="mint-elder-spirit__nav">
                        <CryptoChampionButton label={text.next} onClick={incrementCurrentStep} />
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    const {
        workflow: { currentStep, maxSteps },
        mintElderSpiritWorkflow: { race, elderClass, stone, affinity, isMinting },
        cryptoChampions: { maxElderSpirits, elderSpirits }
    } = state;
    return {
        currentStep,
        maxSteps,
        selectedRace: race,
        selectedClass: elderClass,
        selectedStone: stone,
        selectedAffinity: affinity,
        maxElderSpirits,
        elderSpirits,
        affinities: getAllowedAffinities(state),
        isMinting
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetMintingElderSpiritWorkflow: () => {
            dispatch(resetMintingElderSpiritWorkflowAction());
        },
        setIsMinting: (isMinting) => {
            dispatch(setIsMintingElderSpiritAction(isMinting));
        },
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
        },
        decrementCurrentStep: () => {
            dispatch(decrementActiveStepAction);
        }
    };
};

export const MintElderSpirintWorkflow = connect(mapStateToProps, mapDispatchToProps)(MintElderSpirintWorkflowComp);
