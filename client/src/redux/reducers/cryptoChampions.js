import { SET_ELDER_SPIRITS, SET_MAX_ELDER_SPIRITS, SET_NUM_MINTED_ELDER_SPIRITS, SET_PHASE } from '../actions';

const initialState = {
    maxElderSpirits: 0,
    maxNumHeroes: 0,
    numMintedElderSpirits: 0,
    elderSpirits: []
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
        case SET_NUM_MINTED_ELDER_SPIRITS:
            return {
                ...state,
                numMintedElderSpirits: action.numMintedElderSpirits
            };
        case SET_ELDER_SPIRITS:
            return {
                ...state,
                elderSpirits: action.elderSpirits
            };
        default:
            return state;
    }
};
