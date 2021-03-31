import { TextField } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { getClass, getElderSpiritImage, getElderSpiritLabel, getRace } from '../../AppUtils';
import { setElderSpiritForHeroAction, setHeroNameAction } from '../../redux/actions';
import { mintHero } from '../../services/cryptoChampions';
import { CryptoChampionButton } from '../CryptoChampionButton';
import { ElderSelector } from '../ElderSelector/ElderSelector';
import './MintHeroWorkflow.css';

const text = {
    fieldLabel: "Enter your Hero's name",
    mintHero: 'Train with elder spirit and mint your champion'
};
export const MintHeroWorkflowComp = ({
    elderSpirits,
    setElderSpiritForHero,
    selectedElderSpirit,
    setHeroName,
    heroName
}) => {
    if (!elderSpirits) {
        return <div>Loading...</div>;
    }
    const items = elderSpirits
        .filter(({ valid }) => valid)
        .map((elder) => {
            return {
                id: elder.id,
                label: getElderSpiritLabel(elder),
                subLabel: elder.affinity,
                image: getElderSpiritImage(elder),
                isSelectable: true
            };
        });
    const handleOnHeroNameChange = (e) => setHeroName(e.target.value);
    const handleOnSubmit = () => {
        mintHero(selectedElderSpirit.id, heroName);
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
        </div>
    );
};

const mapStateToProps = (state) => {
    const {
        cryptoChampions: { elderSpirits },
        mintHeroWorkflow: { heroName, elderSpirit }
    } = state;
    return {
        maxElderSpirits: state.cryptoChampions.maxElderSpirits,
        selectedElderSpirit: elderSpirit,
        heroName,
        elderSpirits
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setElderSpiritForHero: (elderSpiritId) => {
            dispatch(setElderSpiritForHeroAction(elderSpiritId));
        },
        setHeroName: (heroName) => {
            dispatch(setHeroNameAction(heroName));
        }
    };
};

export const MintHeroWorkflow = connect(mapStateToProps, mapDispatchToProps)(MintHeroWorkflowComp);
