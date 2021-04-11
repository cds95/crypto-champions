import {
    RESET_MINTING_ELDER_SPIRIT_WORKFLOW,
    SET_AFFINITY,
    SET_ELDER_CLASS,
    SET_ELDER_RACE,
    SET_ELDER_STONE,
    SET_IS_MINTING_ELDER_SPIRIT,
    SET_MINT_ELDER_SPIRIT_PRICE
} from '../actions';

const initialState = {
    stone: null,
    race: null,
    elderClass: null,
    affinity: null,
    isMinting: false,
    mintPrice: 0
};

export const mintElderSpiritWorkflow = (state = initialState, action) => {
    switch (action.type) {
        case SET_MINT_ELDER_SPIRIT_PRICE:
            return {
                ...state,
                mintPrice: action.price
            };
        case SET_ELDER_STONE:
            return {
                ...state,
                stone: action.stone
            };
        case SET_ELDER_RACE:
            return {
                ...state,
                race: action.race
            };
        case SET_ELDER_CLASS:
            return {
                ...state,
                elderClass: action.elderClass
            };
        case SET_AFFINITY:
            return {
                ...state,
                affinity: action.affinity
            };
        case SET_IS_MINTING_ELDER_SPIRIT:
            return {
                ...state,
                isMinting: action.isMinting
            };
        case RESET_MINTING_ELDER_SPIRIT_WORKFLOW:
            return initialState;
        default:
            return state;
    }
};
