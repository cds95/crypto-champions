import { TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { displayToken, getRaceClassLabel } from '../../AppUtils';
import { PHASES } from '../../constants';
import { getRaceGif } from '../../images/alternateRaces';
import { getCoinLogo } from '../../images/cryptoIcons';
import {
    resetMintingHeroWorkflowAction,
    setElderSpiritForHeroAction,
    setHeroNameAction,
    setIsMintingHeroAction
} from '../../redux/actions';
import { routeDefinitions } from '../../routeDefinitions';
import { mintHero } from '../../services/cryptoChampions';
import { Confirmation } from '../Confirmation';
import { CryptoChampionButton } from '../CryptoChampionButton';
import { ElderSelector } from '../ElderSelector/ElderSelector';
import { RefreshPhaseButton } from '../RefreshPhaseButton';
import './MintHeroWorkflow.css';

const text = {
    fieldLabel: "What will your champion's name be?",
    mintHero: 'Mint and train champion',
    processing: 'Minting...',
    confirmation: 'Successfully minted champion',
    select: 'Select',
    full: 'Full',
    failedToMint: 'Failed to mint champion'
};

export const MintHeroWorkflowComp = ({
    elderSpirits,
    setElderSpiritForHero,
    selectedElderSpirit,
    setHeroName,
    heroName,
    resetWorkflow,
    setIsMinting,
    isMinting
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasFailedToMint, setHasFailedToMint] = useState(false);
    const history = useHistory();
    if (!elderSpirits) {
        return <></>;
    }
    const items = elderSpirits
        .filter(({ valid }) => valid)
        .map((elder) => {
            return {
                id: elder.id,
                label: getRaceClassLabel(elder.raceId, elder.classId),
                sublabelImage: getCoinLogo(elder.affinity),
                sublabelTwo: `Price: ${displayToken(elder.mintPrice)} ETH`,
                image: getRaceGif(elder.raceId),
                isSelectable: true,
                actionButton: (
                    <CryptoChampionButton
                        disabled={!elder.canBeMinted}
                        label={elder.canBeMinted ? text.select : text.full}
                        onClick={() => setElderSpiritForHero(elder)}
                    />
                )
            };
        });
    const handleOnHeroNameChange = (e) => setHeroName(e.target.value);
    const handleOnSubmit = async () => {
        setIsMinting(true);
        setIsModalOpen(true);
        try {
            await mintHero(selectedElderSpirit.id, heroName);
            setHasFailedToMint(false);
        } catch (e) {
            setHasFailedToMint(true);
        }
        setIsMinting(false);
    };
    const handleOnClose = () => {
        if (hasFailedToMint) {
            setIsModalOpen(false);
        } else {
            history.push(routeDefinitions.ROOT);
            resetWorkflow();
        }
    };
    return (
        <div className="mint-hero-workflow">
            <ElderSelector
                items={items}
                onSelect={setElderSpiritForHero}
                selectedElderId={selectedElderSpirit ? selectedElderSpirit.id : ''}
                action={<RefreshPhaseButton currentPhase={PHASES.ACTION} />}
            />
            <div className="mint-hero-workflow__bottom">
                <Typography className="mint-hero-workflow__name-label">{text.fieldLabel}</Typography>
                <TextField value={heroName} onChange={handleOnHeroNameChange} className="mint-hero-workflow__name" />
                <CryptoChampionButton
                    onClick={handleOnSubmit}
                    label={text.mintHero}
                    disabled={!selectedElderSpirit || !heroName}
                />
            </div>
            <Confirmation
                isOpen={isModalOpen}
                text={hasFailedToMint ? text.failedToMint : text.confirmation}
                isLoading={isMinting}
                loadingText={text.processing}
                onConfirm={handleOnClose}
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    const {
        cryptoChampions: { elderSpirits },
        mintHeroWorkflow: { heroName, elderSpirit, isMinting }
    } = state;
    return {
        maxElderSpirits: state.cryptoChampions.maxElderSpirits,
        selectedElderSpirit: elderSpirit,
        heroName,
        elderSpirits,
        isMinting
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setElderSpiritForHero: (elderSpiritId) => {
            dispatch(setElderSpiritForHeroAction(elderSpiritId));
        },
        setHeroName: (heroName) => {
            dispatch(setHeroNameAction(heroName));
        },
        setIsMinting: (isMinting) => {
            dispatch(setIsMintingHeroAction(isMinting));
        },
        resetWorkflow: () => {
            dispatch(resetMintingHeroWorkflowAction());
        }
    };
};

export const MintHeroWorkflow = connect(mapStateToProps, mapDispatchToProps)(MintHeroWorkflowComp);
