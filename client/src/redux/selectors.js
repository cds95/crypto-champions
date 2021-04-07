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
            ({ winner, initiatorHeroId, opponentHeroId }) =>
                !winner && (initiatorHeroId == hero.id || opponentHeroId == hero.id)
        );
        const isNotInvolvedInADuel = !duel;
        return isNotInvolvedInADuel && hero.owner !== userAccount;
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
        (duel) => duel.winner && (duel.opponent == userAccount || duel.initiator == userAccount)
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
        (duel) => !duel.winner && (duel.opponent == userAccount || duel.initiator == userAccount)
    );
};
