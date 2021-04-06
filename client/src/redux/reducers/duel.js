import { SET_DUEL_INITIATOR_HERO, SET_DUEL_OPPONENT_HERO, SET_DUEL_BET_AMOUNT, RESET_DUEL } from '../actions';

const initialState = {
    opponentHeroId: null,
    initiatorHeroId: null,
    bet: null
};

export const duel = (state = initialState, action) => {
    switch (action.type) {
        case SET_DUEL_INITIATOR_HERO:
            return {
                ...state,
                initiatorHeroId: action.heroId
            };
        case SET_DUEL_OPPONENT_HERO:
            return {
                ...state,
                opponentHeroId: action.heroId
            };
        case SET_DUEL_BET_AMOUNT:
            return {
                ...state,
                bet: action.bet
            };
        case RESET_DUEL:
            return initialState;
        default:
            return state;
    }
};
