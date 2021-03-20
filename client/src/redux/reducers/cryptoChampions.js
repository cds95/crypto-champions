import { SET_MAX_ELDER_SPIRITS } from '../actions';

export const cryptoChampions = (state = {}, action) => {
    switch (action.type) {
        case SET_MAX_ELDER_SPIRITS:
            return {
                ...state,
                maxElderSpirits: action.maxElderSpirits
            };
        default:
            return state;
    }
};
