import { CONTRACTS } from '../constants';
import { loadContract, getContractInstanceAtAddress } from './contract';
import { getUserAccount } from './web3';
import BigNumber from 'bignumber.js';
import WeatherWars from '../artifacts/contracts/WeatherWars.json';

const loadWeatherWarContract = async (address) => await getContractInstanceAtAddress(WeatherWars, address);

export const challengeToDuel = async (bet, initiatorHeroId, opponent, opponentHeroId) => {
    const bigNum = new BigNumber(bet);
    const smallestDenom = bigNum.multipliedBy(10 ** 18);
    const artifact = await loadContract(CONTRACTS.WEATHER_WARS_FACTORY);
    const userAccount = await getUserAccount();

    // TODO: Figure out how to set the bet amount using big nunber
    await artifact.methods.createWeatherWars(10, initiatorHeroId, opponent, opponentHeroId).send({
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
        const weatherWarObj = {
            address: gameAddress,
            initiator: await weatherWar.methods.initiator().call(),
            opponent: await weatherWar.methods.opponent().call(),
            initiatorHeroId: await weatherWar.methods.initiatorHeroId().call(),
            opponentHeroId: await weatherWar.methods.opponentHeroId().call()
        };
        duels.push(weatherWarObj);
    }
    return duels;
};
