export const SET_MAX_ELDER_SPIRITS = 'SET_MAX_ELDER_SPIRITS';
export const setMaxElderSpiritsAction = (maxElderSpirits) => {
    return {
        type: SET_MAX_ELDER_SPIRITS,
        maxElderSpirits
    };
};

export const SET_NUM_MINTED_ELDER_SPIRITS = 'SET_NUM_MINTED_ELDER_SPIRITS';
export const setNumMintedElderSpiritsAction = (numMintedElderSpirits) => {
    return {
        type: SET_NUM_MINTED_ELDER_SPIRITS,
        numMintedElderSpirits
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

export const SET_AFFINITY = 'SET_AFFINITY';
export const setAffinityAction = (affinity) => {
    return {
        type: SET_AFFINITY,
        affinity
    };
};

export const SET_ELDER_SPIRIT_FOR_HERO = 'SET_ELDER_SPIRIT_FOR_HERO';
export const setElderSpiritForHeroAction = (elderSpirit) => {
    return {
        type: SET_ELDER_SPIRIT_FOR_HERO,
        elderSpirit
    };
};

export const SET_HERO_NAME = 'SET_HERO_NAME';
export const setHeroNameAction = (heroName) => {
    return {
        type: SET_HERO_NAME,
        heroName
    };
};

export const SET_ELDER_SPIRITS = 'SET_ELDER_SPIRITS';
export const setElderSpiritsAction = (elderSpirits) => {
    return {
        type: SET_ELDER_SPIRITS,
        elderSpirits
    };
};

export const SET_AFFINITIES = 'SET_AFFINITIES';
export const setAffinitiesAction = (affinities) => {
    return {
        type: SET_AFFINITIES,
        affinities
    };
};
