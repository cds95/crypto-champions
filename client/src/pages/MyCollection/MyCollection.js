import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { setSelectedCollectionHero } from '../../redux/actions';
import { getUserOwnedHeros } from '../../redux/selectors';
import './MyCollection.css';

const text = {
    heroes: 'Your Heroes'
};

export const MyCollectionComp = ({ userHeroes, selectedHeroId, setSelectedHero }) => {
    const handleOnSelect = (e) => setSelectedHero(e.target.value);
    return (
        <div className="my-collection">
            <FormControl className="my-collection__selector pronciono">
                <InputLabel>{text.heroes}</InputLabel>
                <Select id="hero-selector" value={selectedHeroId} onChange={handleOnSelect}>
                    {userHeroes.map((hero) => (
                        <MenuItem id={hero.id} value={hero.id}>
                            {hero.heroName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

const mapStateToProps = (state) => {
    const {
        collection: { selectedHeroId }
    } = state;
    return {
        userHeroes: getUserOwnedHeros(state),
        selectedHeroId
    };
};

export const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedHero: (heroId) => {
            dispatch(setSelectedCollectionHero(heroId));
        }
    };
};

export const MyCollection = connect(mapStateToProps, mapDispatchToProps)(MyCollectionComp);
