export const SET_MAX_ELDER_SPIRITS = 'SET_MAX_ELDER_SPIRITS';
export const setMaxElderSpiritsAction = (maxElderSpirits) => {
    return {
        type: SET_MAX_ELDER_SPIRITS,
        maxElderSpirits
    };
};

export const SET_MAX_NUM_HEROES = 'SET_MAX_NUM_HEROES';
export const setMaxNumHeroesAction = (maxNumHeroes) => {
    return {
        type: SET_MAX_NUM_HEROES,
        maxNumHeroes
    };
};
