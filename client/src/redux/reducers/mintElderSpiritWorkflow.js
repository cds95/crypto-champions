import { SET_ELDER_RACE, SET_ELDER_STONE } from '../actions';

const initialState = {
    stone: null,
    race: null,
    class: null
};

export const mintElderSpiritWorkflow = (state = initialState, action) => {
    switch (action.type) {
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
        default:
            return state;
    }
};
