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
import { ProgressIndicator } from '../ProgressIndicator';

const text = {
    confirmation: 'Successfully minted elder',
    processing: 'Minting...',
    back: 'Back',
    next: 'Next',
    mintStone: {
        paragraphOne:
            'During Setup, you can only mint Elder Spirits.  To summon an Elder Spirit, you will need to select a Race, Class, and Affinity. Once all Elder Spirits have been minted for this round, Phase 2 will begin and Champions can then be trained.',
        paragraphTwo:
            "Please note: Elder Spirits are ephemeral.  It takes a lot of mystical energies to keep them in this plane of existence.  Therefore, they will disappear at the end of the round.  But don't worry - though you will lose your Elder Spirit, you will keep all royalties gained from training Champions!"
    },
    mintElderSpirit: 'Mint Elder Spirit',
    failedToMint: 'Failed to mint elder spirit'
};

const MINT_ELDER_WORKFLOW_STEPS = [
    {
        id: MINT_ELDER_SPIRIT_STEPS.CHOOSE_STONE,
        label: 'Summon Elder Spirit'
    },
    {
        id: MINT_ELDER_SPIRIT_STEPS.CHOOSE_RACE,
        label: 'Select Race'
    },
    {
        id: MINT_ELDER_SPIRIT_STEPS.CHOOSE_CLASS,
        label: 'Select Class'
    },
    {
        id: MINT_ELDER_SPIRIT_STEPS.MINT,
        label: 'Select Affinity and Mint'
    }
];

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
    setIsMinting,
    isMinting,
    resetMintingElderSpiritWorkflow
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAbleToMint, setIsAbleToMint] = useState(false);
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
        try {
            await mintElderSpirit(raceId, classId, affinity);
            setIsAbleToMint(true);
        } catch (e) {
            setIsAbleToMint(false);
        }
        setIsMinting(false);
    };
    const history = useHistory();
    const handleOnCloseModal = () => {
        if (isAbleToMint) {
            resetMintingElderSpiritWorkflow();
            history.push(routeDefinitions.ROOT);
        } else {
            setIsModalOpen(false);
        }
    };

    let content;
    switch (currentStep) {
        case MINT_ELDER_SPIRIT_STEPS.CHOOSE_STONE:
            content = (
                <StoneSelector
                    maxStones={maxElderSpirits}
                    onSelect={handleOnSelectStone}
                    elderSpirits={elderSpirits}
                    maxElderSpirits={maxElderSpirits}
                    captions={[text.mintStone.paragraphOne, text.mintStone.paragraphTwo]}
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
            const mintedClasses = elderSpirits.map((spirit) => spirit.classId);
            content = (
                <ClassSelector
                    onSelect={handleOnSelectClass}
                    selectedClassId={selectedClass ? selectedClass.id : ''}
                    mintedClasses={mintedClasses}
                />
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

    const isNextButtonDisabled = () => {
        return (
            (currentStep === MINT_ELDER_SPIRIT_STEPS.CHOOSE_RACE && !selectedRace) ||
            (currentStep === MINT_ELDER_SPIRIT_STEPS.CHOOSE_CLASS && !selectedClass) ||
            (currentStep === MINT_ELDER_SPIRIT_STEPS.MINT && !selectedAffinity)
        );
    };

    return (
        <React.Fragment>
            <Confirmation
                isOpen={isModalOpen}
                isLoading={isMinting}
                text={isAbleToMint ? text.confirmation : text.failedToMint}
                loadingText={text.processing}
                onConfirm={handleOnCloseModal}
            />
            <ProgressIndicator
                steps={MINT_ELDER_WORKFLOW_STEPS}
                currentStep={currentStep}
                maxSteps={MINT_ELDER_WORKFLOW_STEPS.length}
            />
            <div className="mint-elder-spirit__content">{content}</div>
            <div className="mint-elder-spirit__actions">
                {currentStep > 0 && (
                    <div className="mint-elder-spirit__nav">
                        <CryptoChampionButton label={text.back} onClick={decrementCurrentStep} />
                    </div>
                )}
                {currentStep >= 1 && (
                    <div className="mint-elder-spirit__nav">
                        <CryptoChampionButton
                            label={currentStep === MINT_ELDER_SPIRIT_STEPS.MINT ? text.mintElderSpirit : text.next}
                            onClick={
                                currentStep === MINT_ELDER_SPIRIT_STEPS.MINT ? handleOnConfirm : incrementCurrentStep
                            }
                            disabled={isNextButtonDisabled()}
                        />
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
