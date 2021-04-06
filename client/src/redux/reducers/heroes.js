import { SET_HEROES, SET_IS_LOADING_HEROES } from '../actions';

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
        default:
            return state;
    }
};
