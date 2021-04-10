import { TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { getRaceClassLabel } from '../../AppUtils';
import { getRaceGif } from '../../images/alternateRaces';
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
import './MintHeroWorkflow.css';

const text = {
    fieldLabel: "Enter your Hero's name",
    mintHero: 'Train with elder spirit and mint your champion',
    processing: 'Processing...',
    confirmation: 'Successfully purchased character'
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
                subLabel: elder.affinity,
                image: getRaceGif(elder.raceId),
                isSelectable: true
            };
        });
    const handleOnHeroNameChange = (e) => setHeroName(e.target.value);
    const handleOnSubmit = async () => {
        setIsMinting(true);
        setIsModalOpen(true);
        await mintHero(selectedElderSpirit.id, heroName);
        setIsMinting(false);
    };
    const handleOnClose = () => {
        history.push(routeDefinitions.ROOT);
        resetWorkflow();
    };
    return (
        <div className="mint-hero-workflow">
            <ElderSelector
                items={items}
                onSelect={setElderSpiritForHero}
                selectedElderId={selectedElderSpirit ? selectedElderSpirit.id : ''}
            />
            <div className="mint-hero-workflow__bottom">
                <TextField
                    value={heroName}
                    label={text.fieldLabel}
                    onChange={handleOnHeroNameChange}
                    className="mint-hero-workflow__name"
                />
                <CryptoChampionButton onClick={handleOnSubmit} label={text.mintHero} />
            </div>
            <Confirmation
                isOpen={isModalOpen}
                text={text.confirmation}
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
