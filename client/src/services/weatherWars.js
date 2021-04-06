import { CONTRACTS, IN_GAME_CURRENCY_ID } from '../constants';
import { loadContract, getContractInstanceAtAddress } from './contract';
import { getUserAccount } from './web3';
import BigNumber from 'bignumber.js';
import WeatherWars from '../artifacts/contracts/WeatherWars.json';
import { isZeroAddress } from '../AppUtils';

const loadWeatherWarContract = async (address) => await getContractInstanceAtAddress(WeatherWars, address);

export const challengeToDuel = async (bet, initiatorHeroId, opponent, opponentHeroId) => {
    const bigNum = new BigNumber(bet);
    const smallestDenom = bigNum.multipliedBy(10 ** 18);
    const artifact = await loadContract(CONTRACTS.WEATHER_WARS_FACTORY);
    const userAccount = await getUserAccount();
    await artifact.methods.createWeatherWars(smallestDenom.toString(), initiatorHeroId, opponent, opponentHeroId).send({
        from: userAccount
    });
};

export const joinDuel = async (duelAddress, bet) => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const userAccount = await getUserAccount();
    await artifact.methods.transferInGameTokens(duelAddress, bet).send({
        from: userAccount
    });
};

export const startWeatherDuel = async (duelAddress) => {
    const artifact = await loadWeatherWarContract(duelAddress);
    const userAccount = await getUserAccount();
    await artifact.methods.startGame().send({
        from: userAccount
    });
};

export const determineWeatherDuelWinner = async (duelAddress) => {
    const artifact = await loadWeatherWarContract(duelAddress);
    const userAccount = await getUserAccount();
    await artifact.methods.determineWinner().send({
        from: userAccount
    });
};

export const getAllWeatherDuels = async () => {
    const artifact = await loadContract(CONTRACTS.WEATHER_WARS_FACTORY);
    const numDuels = await artifact.methods.getNumGames().call();
    const duels = [];
    for (let i = 0; i < numDuels; i++) {
        const gameAddress = await artifact.methods.games(i).call();
        const weatherWar = await loadWeatherWarContract(gameAddress);
        const {
            0: initiator,
            1: opponent,
            2: initiatorHeroId,
            3: opponentHeroId,
            4: phase,
            5: winner,
            6: isDuelAccepted,
            7: bet,
            8: hasBeenPlayed,
            9: isFetchingWeather
        } = await weatherWar.methods.getMetaInformation().call();
        const weatherWarObj = {
            address: gameAddress,
            initiator,
            opponent,
            initiatorHeroId,
            opponentHeroId,
            phase,
            winner: isZeroAddress(winner) ? null : winner,
            isDuelAccepted,
            bet,
            hasBeenPlayed,
            isFetchingWeather
        };
        duels.push(weatherWarObj);
    }
    return duels;
};
