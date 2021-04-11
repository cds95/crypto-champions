import {
    SET_DUEL_INITIATOR_HERO,
    SET_DUEL_OPPONENT_HERO,
    SET_DUEL_BET_AMOUNT,
    RESET_DUEL,
    SET_WEATHER_DUELS,
    SET_DUEL_WORKFLOW_STEP
} from '../actions';
import { DUEL_WORKFLOW_STEPS_MAP } from '../../constants';

const initialState = {
    opponentAddress: '',
    opponentHeroId: null,
    initiatorHeroId: null,
    bet: null,
    weatherDuels: [],
    currentStep: 0
};

export const duel = (state = initialState, action) => {
    switch (action.type) {
        case SET_DUEL_WORKFLOW_STEP:
            return {
                ...state,
                currentStep: action.step
            };
        case SET_DUEL_INITIATOR_HERO:
            return {
                ...state,
                initiatorHeroId: action.heroId
            };
        case SET_DUEL_OPPONENT_HERO:
            return {
                ...state,
                opponentHeroId: action.heroId,
                opponentAddress: action.opponentAddress,
                currentStep: DUEL_WORKFLOW_STEPS_MAP.WAGER
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
