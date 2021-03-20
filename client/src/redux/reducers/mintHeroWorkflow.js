import { SET_ELDER_SPIRIT_FOR_HERO, SET_HERO_NAME } from '../actions';

const initialState = {
    elderSpirit: null,
    heroName: ''
};

export const mintHeroWorkflow = (state = initialState, action) => {
    switch (action.type) {
        case SET_ELDER_SPIRIT_FOR_HERO:
            return {
                ...state,
                elderSpirit: action.elderSpirit
            };
        case SET_HERO_NAME:
            return {
                ...state,
                heroName: action.heroName
            };
        default:
            return state;
    }
};
