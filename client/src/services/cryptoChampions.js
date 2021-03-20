import { CONTRACTS } from '../constants';
import { loadContract } from './contract';

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
    // TO BE IMPLEMENTED
    return 0;
};
