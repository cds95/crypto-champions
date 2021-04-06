import {
    SET_DUEL_INITIATOR_HERO,
    SET_DUEL_OPPONENT_HERO,
    SET_DUEL_BET_AMOUNT,
    RESET_DUEL,
    SET_WEATHER_DUELS
} from '../actions';

const initialState = {
    opponentAddress: '',
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
                opponentHeroId: action.heroId,
                opponentAddress: action.opponentAddress
            };
        case SET_DUEL_BET_AMOUNT:
            return {
                ...state,
                bet: action.bet
            };
        case SET_WEATHER_DUELS:
            return {
                ...state,
                weatherDuels: action.weatherDuels
            };
        case RESET_DUEL:
            return initialState;
        default:
            return state;
    }
};
