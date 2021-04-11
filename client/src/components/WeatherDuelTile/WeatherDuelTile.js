import { CircularProgress, Dialog, DialogActions, DialogContent, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { getRaceImage } from '../../images/races';
import { getHero } from '../../redux/selectors';
import { AcceptDuelModal } from '../AcceptDuelModal';
import './WeatherDuelTile.css';
import { determineWeatherDuelWinner, startWeatherDuel } from '../../services/weatherWars';
import { CITIES, GAME_PHASE, OPENWEATHER_CITY_IDS } from '../../constants';
import { CryptoChampionButton } from '../CryptoChampionButton';
import { getImage, imageNames } from '../../images';

const text = {
    ok: 'Ok',
    accept: 'Accept Challenge',
    begin: 'Start Duel',
    challenged: 'Challenged',
    victory: 'You won!',
    defeat: 'You lost!',
    waitingForResponse: 'Waiting for challenger to accept',
    waitForResult: 'Waiting for initiator to start the duel',
    determineWinner: 'Reveal Winner',
    fetchingWeatherInformation: 'Is Fetching weather information',
    yourHero: 'Your Champion',
    winnerRevealed: 'The winner of the duel will be revealed soon.  Check back in a few minutes.',
    duelStarted: 'The duel has been started.  Come back in a few minutes to reveal the winner.'
};

export const WeatherDuelTileComp = ({ duel, initiatorHero, opponentHero, userAccount }) => {
    const {
        isDuelAccepted,
        initiator,
        winner,
        address,
        bet,
        phase,
        hasBeenPlayed,
        isFetchingWeather,
        city,
        cityWeather
    } = duel;
    const isInitiator = userAccount == initiator;

    const [isAcceptModalOpen, setIsSetAcceptModalOpen] = useState(false);
    const [hasDuelBeenStarted, setHasDuelBeenStarted] = useState(false);
    const [hasWinnerBeenRevealed, setHasWinnerBeenRevealed] = useState(false);
    const [isWaitModalOpen, setIsWaitModalOpen] = useState(false);
    const [isWaitingForContractResponse, setIsWaitingForContractResponse] = useState(false);
    const isLoading = !initiatorHero || !opponentHero;

    const startDuel = async () => {
        setIsWaitModalOpen(true);
        setIsWaitingForContractResponse(true);
        await startWeatherDuel(address);
        setHasDuelBeenStarted(true);
        setIsWaitingForContractResponse(false);
    };
    const determineWinner = async () => {
        setIsWaitModalOpen(true);
        setIsWaitingForContractResponse(true);
        await determineWeatherDuelWinner(address);
        setHasWinnerBeenRevealed(true);
        setIsWaitingForContractResponse(false);
    };

    let resultText;
    if (winner == userAccount) {
        resultText = (
            <Typography className="weather-duel-tile__action weather-duel-tile__action--green" variant="body1">
                {text.victory}
            </Typography>
        );
    } else if (winner) {
        resultText = (
            <Typography className="weather-duel-tile__action weather-duel-tile__action--red" variant="body1">
                {text.defeat}
            </Typography>
        );
    }

    let actions;
    if (winner) {
        actions = (
            <React.Fragment>
                <Typography className="weather-duel-tile__action" variant="body1">
                    <strong>Arena: </strong>
                    {OPENWEATHER_CITY_IDS[`${city}`]}
                </Typography>
                <Typography className="weather-duel-tile__action" variant="body1">
                    <strong>Weather: </strong>
                    {cityWeather}
                </Typography>
            </React.Fragment>
        );
    } else {
        if (phase == GAME_PHASE.CLOSED && hasBeenPlayed) {
            actions = (
                <CryptoChampionButton
                    label={text.determineWinner}
                    className="weather-duel-tile__action"
                    onClick={determineWinner}
                    disabled={hasWinnerBeenRevealed}
                    variant="small"
                />
            );
        } else if (phase == GAME_PHASE.OPEN && isDuelAccepted && !hasBeenPlayed) {
            actions = (
                <CryptoChampionButton
                    label={text.begin}
                    className="weather-duel-tile__action"
                    disabled={hasDuelBeenStarted}
                    onClick={startDuel}
                    variant="small"
                />
            );
        } else if (phase == GAME_PHASE.OPEN && isFetchingWeather) {
            actions = (
                <CryptoChampionButton
                    label={text.fetchingWeatherInformation}
                    className="weather-duel-tile__action"
                    variant="small"
                />
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
                        variant="small"
                        onClick={() => setIsSetAcceptModalOpen(true)}
                    />
                </React.Fragment>
            );
        }
    }

    const closeModal = () => setIsWaitModalOpen(false);
    return (
        <React.Fragment>
            <Dialog open={isWaitModalOpen} onClose={closeModal}>
                <DialogContent className="weather-duel-tile__modal">
                    {isWaitingForContractResponse ? (
                        <CircularProgress />
                    ) : hasWinnerBeenRevealed ? (
                        text.winnerRevealed
                    ) : (
                        text.duelStarted
                    )}
                </DialogContent>
                <DialogActions>
                    <CryptoChampionButton label={text.ok} onClick={closeModal} />
                </DialogActions>
            </Dialog>
            <div className="weather-duel-tile">
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <React.Fragment>
                        <div className="weather-duel-tile__players">
                            <div className="weather-duel-tile__participant">
                                <img
                                    className="weather-duel__image"
                                    src={getRaceImage(initiatorHero.raceId, initiatorHero.appearance)}
                                />
                                <Typography className="weather-duel-tile__hero-name">
                                    {initiatorHero.heroName}
                                </Typography>
                            </div>
                            <div className="weather-duel__center">
                                {resultText}
                                <img className="weather-duel__battle-image" src={getImage(imageNames.BATTLE)} />
                                {actions && <div className="weather-duel__actions">{actions}</div>}
                            </div>
                            <div className="weather-duel-tile__participant">
                                <img
                                    className="weather-duel__image"
                                    src={getRaceImage(opponentHero.raceId, opponentHero.appearance)}
                                />
                                <Typography className="weather-duel-tile__hero-name">
                                    {opponentHero.heroName}
                                </Typography>
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </div>
        </React.Fragment>
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
