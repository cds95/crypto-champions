import { Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { displayToken, getRaceClassLabel } from '../../AppUtils';
import { getRaceImage } from '../../images/races';
import { getHero } from '../../redux/selectors';
import { AcceptDuelModal } from '../AcceptDuelModal';
import { ItemGridTile } from '../ItemGridTile/ItemGridTile';
import './WeatherDuelTile.css';

const text = {
    accept: 'Accept Challenge',
    begin: 'Begin Challenge',
    victory: 'Victory',
    defeat: 'Defeat',
    waitingForResponse: 'Waiting for challenger to accept',
    waitForResult: 'Waiting for initiator to start the duel'
};

export const WeatherDuelTileComp = ({ duel, initiatorHero, opponentHero, userAccount }) => {
    const { isDuelAccepted, initiator, winner, address, bet } = duel;
    const isInitiator = userAccount == initiator;
    const displayedHero = isInitiator ? opponentHero : initiatorHero;
    const itemImage = getRaceImage(displayedHero.raceId);
    const itemLabel = displayedHero.heroName;
    const itemSublabel = getRaceClassLabel(displayedHero.raceId, opponentHero.classId) + ` - ${displayedHero.affinity}`;
    const [isAcceptModalOpen, setIsSetAcceptModalOpen] = useState(false);
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
        if (!isInitiator && !isDuelAccepted) {
            actions = (
                <React.Fragment>
                    <AcceptDuelModal
                        duelAddress={address}
                        bet={bet}
                        onClose={() => setIsSetAcceptModalOpen(false)}
                        isOpen={isAcceptModalOpen}
                    />
                    <Typography
                        className="weather-duel-tile__action"
                        variant="body1"
                        onClick={() => setIsSetAcceptModalOpen(address)}
                    >
                        {text.accept}
                    </Typography>
                </React.Fragment>
            );
        } else if (!isInitiator && isDuelAccepted) {
            actions = (
                <Typography className="weather-duel-tile__action" variant="body1">
                    {text.waitForResult}
                </Typography>
            );
        } else if (isInitiator && isDuelAccepted) {
            actions = (
                <Typography className="weather-duel-tile__action" variant="body1">
                    {text.begin}
                </Typography>
            );
        } else if (isInitiator && !isDuelAccepted) {
            actions = (
                <Typography className="weather-duel-tile__action" variant="body1">
                    {text.waitingForResponse}
                </Typography>
            );
        }
    }
    return (
        <div className="weather-duel-tile">
            <ItemGridTile itemImage={itemImage} itemLabel={itemLabel} itemSublabel={itemSublabel} />
            <div className="weather-duel-tile__actions">
                <div>{actions}</div>
                <div>
                    <Typography className="weather-duel-tile__action" variant="body1">
                        {`${displayToken(bet)} CC`}
                    </Typography>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state, { duel }) => {
    return {
        initiatorHero: getHero(state, duel.initiatorHeroId),
        opponentHero: getHero(state, duel.opponentHeroId),
        userAccount: state.cryptoChampions.userAccount
    };
};

export const WeatherDuelTile = connect(mapStateToProps)(WeatherDuelTileComp);
