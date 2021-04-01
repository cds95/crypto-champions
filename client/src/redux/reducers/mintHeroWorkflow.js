import { RESET_MINTING_HERO_WORKFLOW, SET_ELDER_SPIRIT_FOR_HERO, SET_HERO_NAME, SET_IS_MINTING_HERO } from '../actions';

const initialState = {
    elderSpirit: null,
    heroName: '',
    isMinting: false
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
        case SET_IS_MINTING_HERO:
            return {
                ...state,
                isMinting: action.isMinting
            };
        case RESET_MINTING_HERO_WORKFLOW:
            return initialState;
        default:
            return state;
    }
};
