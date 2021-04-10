import { SET_SELECTED_COLLECTION_HERO } from '../actions';

const initialState = {
    selectedHeroId: null
};

export const collection = (state = initialState, action) => {
    switch (action.type) {
        case SET_SELECTED_COLLECTION_HERO:
            return {
                ...state,
                selectedHeroId: action.heroId
            };
        default:
            return state;
    }
};
