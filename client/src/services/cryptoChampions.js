import { CONTRACTS } from '../constants';
import { loadContract } from './contract';
import { getUserAccount } from './web3';

export const getMaxElderSpirits = async () => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const maxElderSpirits = await artifact.methods.MAX_NUMBER_OF_ELDERS().call();
    return parseInt(maxElderSpirits);
};

export const getAffinities = async (maxElders) => {
    const affinities = [];
    let currIdx = 0;
    let affinity = await getAffinity(currIdx);
    do {
        affinities.push(affinity);
        currIdx++;
        affinity = await getAffinity(currIdx);
    } while (!!affinity);
    return affinities;
};

const getAffinity = async (affinityIdx) => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    try {
        return await artifact.methods.affinities(affinityIdx).call();
    } catch (e) {
        return null;
    }
};

export const getNumMintedElderSpirits = async () => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const numElderSpirits = await artifact.methods.getNumEldersInGame().call();
    return parseInt(numElderSpirits);
};

export const getPhase = async () => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const currentPhase = await artifact.methods.currentPhase().call();
    return parseInt(currentPhase);
};

export const mintElderSpirit = async (raceId, classId, affinity) => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const price = await getElderSpiritPrice();
    const account = await getUserAccount();
    await artifact.methods.mintElderSpirit(raceId, classId, affinity).send({
        from: account,
        value: price
    });
};

export const getElderSpirits = async (numElderSpirits) => {
    const elderSpirits = [];
    for (let id = 1; id <= numElderSpirits; id++) {
        const spirit = await getElderSpirit(id);
        elderSpirits.push(spirit);
    }
    return elderSpirits;
};

export const getElderSpirit = async (elderSpiritId) => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const elderSpirit = await artifact.methods.getElderSpirit(elderSpiritId).call();
    return {
        id: elderSpiritId,
        valid: elderSpirit[0],
        raceId: parseInt(elderSpirit[1]),
        classId: parseInt(elderSpirit[2]),
        affinity: elderSpirit[3],
        affinityPrice: parseInt(elderSpirit[4])
    };
};

export const mintHero = async (elderSpiritId, heroName) => {
    console.log(elderSpiritId);
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const userAccount = await getUserAccount();
    const price = await getHeroPrice(elderSpiritId);
    console.log(price);
    await artifact.methods.mintHero(elderSpiritId, heroName).send({
        from: userAccount,
        value: price
    });
};

export const getElderSpiritPrice = async () => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    return await artifact.methods.elderMintPrice().call();
};

export const getHeroPrice = async (elderId) => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const currentRound = await getCurrentRound();
    return await artifact.methods.getHeroMintPrice(currentRound, elderId).call();
};

export const getCurrentRound = async () => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const currentRound = await artifact.methods.currentRound().call();
    return parseInt(currentRound);
};
