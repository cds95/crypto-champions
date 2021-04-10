import { SET_HEROES, SET_IS_LOADING_HEROES, UPDATE_HERO } from '../actions';

const initialState = {
    heroes: [],
    isLoadingHeroes: false
};

export const heroes = (state = initialState, action) => {
    switch (action.type) {
        case SET_IS_LOADING_HEROES:
            return {
                ...state,
                isLoadingHeroes: action.isLoadingHeroes
            };
        case SET_HEROES:
            return {
                ...state,
                heroes: action.heroes
            };
        case UPDATE_HERO:
            return {
                ...state,
                heroes: state.heroes.map((hero) => {
                    if (hero.id === action.heroId) {
                        return {
                            ...hero,
                            ...action.params
                        };
                    }
                    return hero;
                })
            };
        default:
            return state;
    }
};
