import { Button, TextField } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { useGetElderSpirits } from '../../hooks/cryptoChampionsHook';
import { setElderSpiritForHeroAction, setHeroNameAction } from '../../redux/actions';
import { mintHero } from '../../services/cryptoChampions';
import { CharacterSelector } from '../CharacterSelector/CharacterSelector';
import './MintCharacter.css';

const text = {
    fieldLabel: "Enter your Hero's name",
    mintHero: 'Train with elder spirit and mint your champion'
};
export const MintCharacterWorkflowComp = ({
    maxElderSpirits,
    setElderSpiritForHero,
    selectedElderSpirit,
    setHeroName,
    heroName
}) => {
    const { isLoading, elderSpirits } = useGetElderSpirits(maxElderSpirits);
    if (isLoading) {
        return <div>Loading...</div>;
    }
    const items = elderSpirits
        .filter(({ valid }) => valid)
        .map(({ id, attribute }) => ({
            id,
            label: attribute
        }));
    const handleOnHeroNameChange = (e) => setHeroName(e.target.value);
    const handleOnSubmit = () => {
        mintHero(selectedElderSpirit.id, heroName);
    };
    return (
        <div className="mint-character-workflow">
            <CharacterSelector items={items} onSelect={setElderSpiritForHero} />
            <div className="mint-character-workflow__bottom">
                <TextField
                    value={heroName}
                    label={text.fieldLabel}
                    onChange={handleOnHeroNameChange}
                    className="mint-character-workflow__name"
                />
                <Button onClick={handleOnSubmit} variant="contained" color="primary">
                    {text.mintHero}
                </Button>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    const {
        mintHeroWorkflow: { heroName, elderSpirit }
    } = state;
    return {
        maxElderSpirits: state.cryptoChampions.maxElderSpirits,
        selectedElderSpirit: elderSpirit,
        heroName
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

export const MintCharacterWorkflow = connect(mapStateToProps, mapDispatchToProps)(MintCharacterWorkflowComp);
