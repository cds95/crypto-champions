import {
    SET_AFFINITIES,
    SET_ELDER_SPIRITS,
    SET_MAX_ELDER_SPIRITS,
    SET_NUM_MINTED_ELDER_SPIRITS,
    SET_PHASE,
    SET_USER_ACCOUNT
} from '../actions';

const initialState = {
    maxElderSpirits: 0,
    maxNumHeroes: 0,
    numMintedElderSpirits: 0,
    elderSpirits: [],
    affinities: [],
    mintedAffinities: [],
    userAccount: null
};

export const cryptoChampions = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_ACCOUNT:
            return {
                ...state,
                userAccount: action.account
            };
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
            const mintedAffinities = action.elderSpirits.map((spirit) => spirit.affinity);
            return {
                ...state,
                elderSpirits: action.elderSpirits,
                mintedAffinities
            };
        case SET_AFFINITIES:
            return {
                ...state,
                affinities: action.affinities
            };
        default:
            return state;
    }
};
