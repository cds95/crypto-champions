import { Typography } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { getRaceClassLabel } from '../../AppUtils';
import { getRaceImage } from '../../images/races';
import { getHero } from '../../redux/selectors';
import { ItemGridTile } from '../ItemGridTile/ItemGridTile';
import './WeatherDuelTile.css';

const text = {
    accept: 'Accept Challenge',
    begin: 'Begin Challenge',
    victory: 'Victory',
    defeat: 'Defeat'
};

export const WeatherDuelTileComp = ({ duel, opponentHero, userAccount }) => {
    const { isDuelAccepted, opponent, initiator, winner } = duel;
    const itemImage = getRaceImage(opponentHero.raceId);
    const itemLabel = getRaceClassLabel(opponentHero.raceId, opponentHero.classId);
    let actions;
    if (winner) {
        if (winner == userAccount) {
            actions = (
                <Typography className="weather-duel-tile__action" variant="body1">
                    {text.victory}
                </Typography>
            );
        } else {
            actions = (
                <Typography className="weather-duel-tile__action" variant="body1">
                    {text.defeat}
                </Typography>
            );
        }
    } else {
        if (opponent == userAccount && !isDuelAccepted) {
            actions = (
                <Typography className="weather-duel-tile__action" variant="body1">
                    {text.accept}
                </Typography>
            );
        } else if (initiator == userAccount && isDuelAccepted) {
            actions = (
                <Typography className="weather-duel-tile__action" variant="body1">
                    {text.begin}
                </Typography>
            );
        }
    }
    return (
        <div className="weather-duel-tile">
            <ItemGridTile itemImage={itemImage} itemLabel={itemLabel} />
            <div className="weather-duel-tile__actions">{actions}</div>
        </div>
    );
};

const mapStateToProps = (state, { duel }) => {
    return {
        opponentHero: getHero(state, duel.opponentHeroId),
        userAccount: state.cryptoChampions.userAccount
    };
};

export const WeatherDuelTile = connect(mapStateToProps)(WeatherDuelTileComp);
