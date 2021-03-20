export const SET_MAX_ELDER_SPIRITS = 'SET_MAX_ELDER_SPIRITS';
export const setMaxElderSpiritsAction = (maxElderSpirits) => {
    return {
        type: SET_MAX_ELDER_SPIRITS,
        maxElderSpirits
    };
};

export const SET_MAX_NUM_HEROES = 'SET_MAX_NUM_HEROES';
export const setMaxNumHeroesAction = (maxNumHeroes) => {
    return {
        type: SET_MAX_NUM_HEROES,
        maxNumHeroes
    };
};

export const SET_PHASE = 'SET_PHASE';
export const setPhaseAction = (phase) => {
    return {
        type: SET_PHASE,
        phase
    };
};

export const INCREMENT_ACTIVE_STEP = 'INCREMENT_ACTIVE_STEP';
export const incrementActiveStepAction = {
    type: INCREMENT_ACTIVE_STEP
};

export const DECREMENT_ACTIVE_STEP = 'DECREMENT_ACTIVE_STEP';
export const decrementActiveStepAction = {
    type: DECREMENT_ACTIVE_STEP
};

export const SET_ACTIVE_STEP = 'SET_ACTIVE_STEP';
export const setActiveStepAction = (activeStep) => {
    return {
        type: SET_ACTIVE_STEP,
        activeStep
    };
};

export const SET_MAX_STEPS = 'SET_MAX_STEPS';
export const setMaxStepsAction = (maxSteps) => {
    return {
        type: SET_MAX_STEPS,
        maxSteps
    };
};

export const SET_ELDER_STONE = 'SET_ELDER_STONE';
export const setElderStoneAction = (stone) => {
    return {
        type: SET_ELDER_STONE,
        stone
    };
};

export const SET_ELDER_RACE = 'SET_ELDER_RACE';
export const setElderRaceAction = (race) => {
    return {
        type: SET_ELDER_RACE,
        race
    };
};

export const SET_ELDER_CLASS = 'SET_ELDER_CLASS';
export const setElderClassAction = (elderClass) => {
    return {
        type: SET_ELDER_CLASS,
        elderClass
    };
};
