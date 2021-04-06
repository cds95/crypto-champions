import { GAME_PHASE } from '../constants';

export const getAllowedAffinities = (state) => {
    const {
        cryptoChampions: { affinities, mintedAffinities }
    } = state;
    return affinities.filter((a) => !mintedAffinities.includes(a));
};

export const getUserOwnedHeros = (state) => {
    const {
        heroes: { heroes },
        cryptoChampions: { userAccount }
    } = state;
    return heroes.filter(({ owner }) => owner === userAccount);
};

export const getNonUserOwnedHeros = (state) => {
    const {
        heroes: { heroes },
        cryptoChampions: { userAccount }
    } = state;
    if (!userAccount) {
        return [];
    }
    return heroes.filter(({ owner }) => owner !== userAccount);
};

export const getHero = (state, heroId) => {
    const {
        heroes: { heroes }
    } = state;
    return heroes.find(({ id }) => id == heroId);
};

export const getUserInitiatedWeatherGames = (state) => {
    const {
        duel: { weatherDuels = [] },
        cryptoChampions: { userAccount }
    } = state;
    if (!userAccount) {
        return [];
    }
    return weatherDuels.filter((duel) => duel.initiator == userAccount);
};

export const getUserChallengedWeatherGames = (state) => {
    const {
        duel: { weatherDuels = [] },
        cryptoChampions: { userAccount }
    } = state;
    if (!userAccount) {
        return [];
    }
    return weatherDuels.filter((duel) => duel.opponent == userAccount);
};

export const getHerosUserCanChallenge = (state) => {
    const {
        duel: { weatherDuels = [] },
        cryptoChampions: { userAccount },
        heroes: { heroes }
    } = state;
    if (!userAccount) {
        return [];
    }
    return heroes.filter((hero) => {
        const duel = weatherDuels.find(
            ({ phase, initiatorHeroId, opponentHeroId }) =>
                phase == GAME_PHASE.OPEN && initiatorHeroId != hero.id && opponentHeroId != hero.id
        );
        return !duel && hero.owner !== userAccount;
    });
};

export const getPastUserDuels = (state) => {
    const {
        duel: { weatherDuels = [] },
        cryptoChampions: { userAccount }
    } = state;
    if (!userAccount) {
        return [];
    }
    return weatherDuels.filter(
        (duel) => duel.phase == GAME_PHASE.CLOSED && (duel.opponent == userAccount || duel.initiator == userAccount)
    );
};

export const getOpenUserDuels = (state) => {
    const {
        duel: { weatherDuels = [] },
        cryptoChampions: { userAccount }
    } = state;
    if (!userAccount) {
        return [];
    }
    return weatherDuels.filter(
        (duel) => duel.phase == GAME_PHASE.OPEN && (duel.opponent == userAccount || duel.initiator == userAccount)
    );
};
