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

export const SET_IS_MINTING_ELDER_SPIRIT = 'SET_IS_MINTING_ELDER_SPIRIT';
export const setIsMintingElderSpiritAction = (isMinting) => {
    return {
        type: SET_IS_MINTING_ELDER_SPIRIT,
        isMinting
    };
};

export const SET_IS_MINTING_HERO = 'SET_IS_MINTING_HERO';
export const setIsMintingHeroAction = (isMinting) => {
    return {
        type: SET_IS_MINTING_HERO,
        isMinting
    };
};

export const RESET_MINTING_ELDER_SPIRIT_WORKFLOW = 'RESET_MINTING_ELDER_SPIRIT_WORKFLOW';
export const resetMintingElderSpiritWorkflowAction = () => {
    return {
        type: RESET_MINTING_ELDER_SPIRIT_WORKFLOW
    };
};

export const RESET_MINTING_HERO_WORKFLOW = 'RESET_MINTING_HERO_WORKFLOW';
export const resetMintingHeroWorkflowAction = () => {
    return {
        type: RESET_MINTING_HERO_WORKFLOW
    };
};

export const SET_HEROES = 'SET_HEROES';
export const setHeroesAction = (heroes) => {
    return {
        type: SET_HEROES,
        heroes
    };
};

export const SET_IS_LOADING_HEROES = 'SET_IS_LOADING_HEROES';
export const setIsLoadingHeroesAction = (isLoading) => {
    return {
        type: SET_IS_LOADING_HEROES,
        isLoading
    };
};

export const SET_USER_ACCOUNT = 'SET_USER_ACCOUNT';
export const setUserAccountAction = (account) => {
    return {
        type: SET_USER_ACCOUNT,
        account
    };
};

export const SET_DUEL_INITIATOR_HERO = 'SET_DUEL_INITIATOR_HERO';
export const setDuelInitiatorHeroAction = (heroId) => {
    return {
        type: SET_DUEL_INITIATOR_HERO,
        heroId
    };
};

export const SET_DUEL_OPPONENT_HERO = 'SET_DUEL_OPPONENT_HERO';
export const setDuelOpponentHeroAction = (heroId, opponentAddress) => {
    return {
        type: SET_DUEL_OPPONENT_HERO,
        heroId,
        opponentAddress
    };
};

export const SET_DUEL_BET_AMOUNT = 'SET_DUEL_BET_AMOUNT';
export const setDuelBetAmountAction = (bet) => {
    return {
        type: SET_DUEL_BET_AMOUNT,
        bet
    };
};

export const RESET_DUEL = 'RESET_DUEL';
export const resetDuelAction = () => {
    return {
        type: RESET_DUEL
    };
};

export const SET_WEATHER_DUELS = 'SET_WEATHER_DUELS';
export const setWeatherDuelsAction = (weatherDuels) => {
    return {
        type: SET_WEATHER_DUELS,
        weatherDuels
    };
};

export const SET_ROUND_WINNING_AFFINITY = 'SET_ROUND_WINNING_AFFINITY';
export const setRoundWinningAffinity = (winningAffinity) => {
    return {
        type: SET_ROUND_WINNING_AFFINITY,
        winningAffinity
    };
};

export const SET_CURRENT_ROUND = 'SET_CURRENT_ROUND';
export const setCurrentRoundAction = (currentRound) => {
    return {
        type: SET_CURRENT_ROUND,
        currentRound
    };
};

export const SET_SELECTED_COLLECTION_HERO = 'SET_SELECTED_COLLECTION_HERO';
export const setSelectedCollectionHero = (heroId) => {
    return {
        type: SET_SELECTED_COLLECTION_HERO,
        heroId
    };
};
