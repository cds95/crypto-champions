import { CONTRACTS } from '../constants';
import { loadContract } from './contract';
import { getUserAccount } from './web3';
import BigNumber from 'bignumber.js';

export const challengeToDuel = async (bet, heroId, opponent) => {
    const bigNum = new BigNumber(bet);
    const smallestDenom = bigNum.multipliedBy(10 ** 18);
    const artifact = await loadContract(CONTRACTS.WEATHER_WARS_FACTORY);
    const userAccount = await getUserAccount();

    // TODO: Figure out how to set the bet amount using big nunber
    await artifact.methods.createWeatherWars(10, heroId, opponent).send({
        from: userAccount
    });
};

export const getAllWeatherDuels = async () => {
    const artifact = await loadContract(CONTRACTS.WEATHER_WARS_FACTORY);
    const numDuels = await artifact.methods.getNumGames().call();
    const duels = [];
    for (let i = 0; i < numDuels; i++) {}
    return duels;
};
