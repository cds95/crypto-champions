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
