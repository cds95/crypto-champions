import { CONTRACTS, IN_GAME_CURRENCY_ID, NUM_AFFINITIES } from '../constants';
import { loadContract } from './contract';
import { getUserAccount } from './web3';

export const getMaxElderSpirits = async () => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const maxElderSpirits = await artifact.methods.MAX_NUMBER_OF_ELDERS().call();
    return parseInt(maxElderSpirits);
};

export const getAffinities = async () => {
    const affinities = [];
    for (let i = 0; i < NUM_AFFINITIES; i++) {
        const affinity = await getAffinity(i);
        affinities.push(affinity);
    }
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
    const currentRound = await getCurrentRound();
    for (let id = 1; id <= numElderSpirits; id++) {
        const spirit = await getElderSpirit(id, currentRound);
        elderSpirits.push(spirit);
    }
    return elderSpirits;
};

const getElderSpirit = async (elderSpiritId, currentRound) => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const elderSpirit = await artifact.methods.getElderSpirit(elderSpiritId).call();
    const canBeMinted = await artifact.methods.getElderSpawnsAmount(currentRound, elderSpiritId).call();
    const owner = await artifact.methods.getElderOwner(elderSpiritId).call();
    const mintPrice = await getHeroPrice(elderSpiritId);
    return {
        id: elderSpiritId,
        valid: elderSpirit[0],
        raceId: parseInt(elderSpirit[1]),
        classId: parseInt(elderSpirit[2]),
        affinity: elderSpirit[3],
        affinityPrice: parseInt(elderSpirit[4]),
        canBeMinted: !!canBeMinted,
        owner,
        mintPrice
    };
};

export const mintHero = async (elderSpiritId, heroName) => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const userAccount = await getUserAccount();
    const price = await getHeroPrice(elderSpiritId);
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

// TODO:  Implement pagination in the future.  For now just fetch all minted heroes
export const getHeroes = async () => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const numMintedHeroes = await artifact.methods.heroesMinted().call();
    const userAccount = await getUserAccount();
    const heroes = [];
    const maxElderSpirits = await getMaxElderSpirits();
    const firstHeroId = maxElderSpirits + 1;
    for (let i = firstHeroId; i < firstHeroId + parseInt(numMintedHeroes); i++) {
        const { 0: heroName, 1: raceId, 2: classId, 3: appearance } = await artifact.methods.getHeroVisuals(i).call();
        const { 0: isValid, 1: affinity, 3: roundMinted } = await artifact.methods.getHeroGameData(i).call();
        const {
            0: strength,
            1: dexterity,
            2: constitution,
            3: intelligence,
            4: wisdom,
            5: charisma
        } = await artifact.methods.getHeroStats(i).call();
        const { 0: alignment, 2: hometown, 3: weather } = await artifact.methods.getHeroLore(i).call();
        const owner = await artifact.methods.getHeroOwner(i).call();
        if (isValid) {
            heroes.push({
                id: i,
                heroName,
                raceId,
                classId,
                affinity,
                owner,
                roundMinted: parseInt(roundMinted),
                hasRoundReward: owner === userAccount && (await hasRoundReward(i)),
                appearance,
                strength,
                dexterity,
                constitution,
                intelligence,
                wisdom,
                charisma,
                hometown,
                weather,
                alignment
            });
        }
    }
    return heroes;
};

const hasRoundReward = async (heroId) => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    try {
        return await artifact.methods.hasRoundReward(heroId).call();
    } catch (e) {
        console.log(e);
        return false;
    }
};

export const allowWeatherWarToTransferBet = async () => {
    const ccArtifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const wwfArtifact = await loadContract(CONTRACTS.WEATHER_WARS_FACTORY);
    const userAccount = await getUserAccount();
    return await ccArtifact.methods.setApprovalForAll(wwfArtifact._address, true).send({
        from: userAccount
    });
};

export const getUserTokenBalance = async () => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const userAccount = await getUserAccount();
    return await artifact.methods.balanceOf(userAccount, IN_GAME_CURRENCY_ID).call();
};

export const getRoundWinningAffinity = async () => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const currentRound = await artifact.methods.currentRound().call();
    return await artifact.methods.winningAffinitiesByRound(currentRound).call();
};

export const claimRoundReward = async (heroId) => {
    const artifact = await loadContract(CONTRACTS.CRYPTO_CHAMPIONS);
    const userAccount = await getUserAccount();
    await artifact.methods.claimReward(heroId).send({
        from: userAccount
    });
};
