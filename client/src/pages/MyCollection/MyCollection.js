import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Rewards } from '../../components/Rewards/Rewards';
import { GAME_PHASE, PHASES } from '../../constants';
import { setSelectedCollectionHero, updateHeroAction } from '../../redux/actions';
import { getUserOwnedHeroes, getWinningHeroes } from '../../redux/selectors';
import { claimRoundReward } from '../../services/cryptoChampions';
import './MyCollection.css';

const text = {
    heroes: 'Your Heroes'
};

export const MyCollectionComp = ({ userHeroes, selectedHeroId, setSelectedHero, winningHeroes, phase, updateHero }) => {
    const handleOnSelect = (e) => setSelectedHero(e.target.value);
    const claimReward = async (heroId) => {
        await claimRoundReward(heroId);
        updateHero(heroId, {
            hasRoundReward: false
        });
    };
    return (
        <div className="my-collection">
            {phase == PHASES.SETUP && (
                <Rewards className="my-collection__rewards" winningHeroes={winningHeroes} onClaim={claimReward} />
            )}
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
        collection: { selectedHeroId },
        cryptoChampions: { currentRound, phase }
    } = state;
    return {
        userHeroes: getUserOwnedHeroes(state),
        selectedHeroId,
        winningHeroes: getWinningHeroes(state),
        currentRound,
        phase
    };
};

export const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedHero: (heroId) => {
            dispatch(setSelectedCollectionHero(heroId));
        },
        updateHero: (heroId, params = {}) => {
            dispatch(updateHeroAction(heroId, params));
        }
    };
};

export const MyCollection = connect(mapStateToProps, mapDispatchToProps)(MyCollectionComp);
