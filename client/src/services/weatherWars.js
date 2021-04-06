import { CONTRACTS } from '../constants';
import { loadContract } from './contract';
import { getUserAccount } from './web3';

export const challengeToDuel = async (bid, heroId, opponent) => {
    const artifact = await loadContract(CONTRACTS.WEATHER_WARS_FACTORY);
    const userAccount = await getUserAccount();
    await artifact.methods.createWeatherWars(bid, heroId, opponent).send({
        from: userAccount
    });
};
