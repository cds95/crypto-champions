import { Card, CardContent, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { displayToken, getRaceClassLabel } from '../../AppUtils';
import { getRaceImage } from '../../images/races';
import { getHero } from '../../redux/selectors';
import { AcceptDuelModal } from '../AcceptDuelModal';
import { ItemGridTile } from '../ItemGridTile/ItemGridTile';
import './WeatherDuelTile.css';
import { determineWeatherDuelWinner, startWeatherDuel } from '../../services/weatherWars';
import { GAME_PHASE } from '../../constants';
import { CryptoChampionButton } from '../CryptoChampionButton';

const text = {
    accept: 'Accept Challenge',
    begin: 'Start Duel',
    challenged: 'Challenged',
    victory: 'Victory',
    defeat: 'Defeat',
    waitingForResponse: 'Waiting for challenger to accept',
    waitForResult: 'Waiting for initiator to start the duel',
    determineWinner: 'Reveal Winner',
    fetchingWeatherInformation: 'Is Fetching weather information',
    yourHero: 'Your Champion'
};

export const WeatherDuelTileComp = ({ duel, initiatorHero, opponentHero, userAccount }) => {
    const { isDuelAccepted, initiator, winner, address, bet, phase, hasBeenPlayed, isFetchingWeather } = duel;
    const isInitiator = userAccount == initiator;

    const [isAcceptModalOpen, setIsSetAcceptModalOpen] = useState(false);
    const startDuel = async () => await startWeatherDuel(address);
    const determineWinner = async () => await determineWeatherDuelWinner(address);

    let actions;
    if (winner) {
        if (winner == userAccount) {
            actions = (
                <Typography className="weather-duel-tile__action weather-duel-tile__action-green" variant="body1">
                    {text.victory}
                </Typography>
            );
        } else {
            actions = (
                <Typography className="weather-duel-tile__action weather-duel-tile__action--red" variant="body1">
                    {text.defeat}
                </Typography>
            );
        }
    } else {
        if (phase == GAME_PHASE.CLOSED && hasBeenPlayed) {
            actions = (
                <CryptoChampionButton
                    label={text.determineWinner}
                    className="weather-duel-tile__action"
                    onClick={determineWinner}
                />
            );
        } else if (phase == GAME_PHASE.OPEN && isDuelAccepted && !hasBeenPlayed) {
            actions = (
                <CryptoChampionButton label={text.begin} className="weather-duel-tile__action" onClick={startDuel} />
            );
        } else if (phase == GAME_PHASE.OPEN && isFetchingWeather) {
            actions = (
                <CryptoChampionButton label={text.fetchingWeatherInformation} className="weather-duel-tile__action" />
            );
        } else if (!isInitiator && !isDuelAccepted) {
            actions = (
                <React.Fragment>
                    <AcceptDuelModal
                        duelAddress={address}
                        bet={bet}
                        onClose={() => setIsSetAcceptModalOpen(false)}
                        isOpen={isAcceptModalOpen}
                    />
                    <CryptoChampionButton
                        className="weather-duel-tile__action"
                        label={text.accept}
                        onClick={() => setIsSetAcceptModalOpen(address)}
                    />
                </React.Fragment>
            );
        }
    }

    return (
        <Card className="weather-duel-tile">
            <CardContent>
                <div className="weather-duel-tile__players">
                    <ItemGridTile
                        itemImage={getRaceImage(initiatorHero.raceId)}
                        itemLabel={initiatorHero.heroName}
                        itemSublabel={
                            getRaceClassLabel(initiatorHero.raceId, initiatorHero.classId) +
                            ` - ${initiatorHero.affinity}`
                        }
                        isBlackText={true}
                        decorator={isInitiator ? text.yourHero : ''}
                    />
                    <Typography className="weather-duel-tile__challenge" variant="body1">
                        {text.challenged}
                    </Typography>
                    <ItemGridTile
                        itemImage={getRaceImage(opponentHero.raceId)}
                        itemLabel={opponentHero.heroName}
                        itemSublabel={
                            getRaceClassLabel(opponentHero.raceId, opponentHero.classId) + ` - ${opponentHero.affinity}`
                        }
                        isBlackText={true}
                        decorator={!isInitiator ? text.yourHero : ''}
                    />
                </div>
                <div className="weather-duel-tile__actions">
                    <div>{actions}</div>
                    <div>
                        <Typography className="weather-duel-tile__action" variant="body1">
                            {`Minimum bet: ${displayToken(bet)} CC`}
                        </Typography>
                    </div>
                </div>
            </CardContent>
        </Card>
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
