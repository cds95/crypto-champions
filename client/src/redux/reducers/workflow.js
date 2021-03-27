import { DECREMENT_ACTIVE_STEP, INCREMENT_ACTIVE_STEP, SET_ACTIVE_STEP, SET_MAX_STEPS } from '../actions';

const initialState = {
    currentStep: 0,
    maxSteps: 0
};

export const workflow = (state = initialState, action) => {
    switch (action.type) {
        case INCREMENT_ACTIVE_STEP: {
            return {
                ...state,
                currentStep: Math.min(state.maxSteps, state.currentStep + 1)
            };
        }
        case DECREMENT_ACTIVE_STEP: {
            return {
                ...state,
                currentStep: Math.max(0, state.currentStep - 1)
            };
        }
        case SET_ACTIVE_STEP:
            return {
                ...state,
                currentStep: action.activeStep
            };
        case SET_MAX_STEPS:
            return {
                ...state,
                maxSteps: action.maxSteps
            };
        default:
            return state;
    }
};
