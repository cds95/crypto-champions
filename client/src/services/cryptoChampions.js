import { CONTRACTS } from '../constants';
import { loadContract } from './contract';
import getWeb3, { getUserAccount } from './web3';

export const getMaxElderSpirits = async () => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const maxElderSpirits = await artifact.methods.MAX_NUMBER_OF_ELDERS().call();
    return parseInt(maxElderSpirits);
};

export const getMaxNumHeroes = async () => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const maxHeroes = await artifact.methods.MAX_NUMBER_OF_HEROES().call();
    return parseInt(maxHeroes);
};

export const getPhase = async () => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const currentPhase = await artifact.methods.currentPhase().call();
    return parseInt(currentPhase);
};

export const mintElderSpirit = async (raceId, classId, affinity) => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const account = await getUserAccount();
    await artifact.methods.mintElderSpirit(raceId, classId, affinity).send({
        from: account
    });
};
