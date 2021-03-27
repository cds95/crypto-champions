import { SET_MAX_ELDER_SPIRITS, SET_MAX_NUM_HEROES, SET_PHASE } from '../actions';

const initialState = {
    maxElderSpirits: 0,
    maxNumHeroes: 0
};

export const cryptoChampions = (state = initialState, action) => {
    switch (action.type) {
        case SET_MAX_ELDER_SPIRITS:
            return {
                ...state,
                maxElderSpirits: action.maxElderSpirits
            };
        case SET_PHASE:
            return {
                ...state,
                phase: action.phase
            };
        default:
            return state;
    }
};
