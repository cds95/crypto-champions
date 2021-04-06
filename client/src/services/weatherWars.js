import { CONTRACTS } from '../constants';
import { loadContract } from './contract';
import { getUserAccount } from './web3';
import BigNumber from 'bignumber.js';

export const challengeToDuel = async (bet, heroId, opponent) => {
    const bigNum = new BigNumber(bet);
    const smallestDenom = bigNum.multipliedBy(10 ** 18);
    const artifact = await loadContract(CONTRACTS.WEATHER_WARS_FACTORY);
    const userAccount = await getUserAccount();
    await artifact.methods.createWeatherWars(10, heroId, opponent).send({
        from: userAccount
    });
};
