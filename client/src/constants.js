export const GITHUB_LINK = 'https://github.com/cds95/crypto-champions';
export const TWITTER_LINK = 'https://twitter.com/cryptochampz';

export const CHAINS = {
    DEV: 'dev'
};

export const CONTRACTS = {
    CRYPTO_CHAMPIONS: 'CryptoChampions',
    WEATHER_WARS_FACTORY: 'WeatherWarsFactory'
};

export const PHASES = {
    SETUP: 0,
    ACTION: 1
};

export const MINT_ELDER_SPIRIT_STEPS = {
    CHOOSE_STONE: 0,
    CHOOSE_RACE: 1,
    CHOOSE_CLASS: 2,
    MINT: 3
};

export const GAME_PHASE = {
    OPEN: '0',
    CLOSED: '1'
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const IN_GAME_CURRENCY_ID = 0;

export const RACES = [
    {
        id: 0,
        label: 'Human'
    },
    {
        id: 1,
        label: 'Kittie'
    },
    {
        id: 2,
        label: 'Elf'
    },
    {
        id: 3,
        label: 'Froggen'
    },
    {
        id: 4,
        label: 'Bera'
    },
    {
        id: 5,
        label: 'Bully'
    },
    {
        id: 6,
        label: 'Robo'
    },
    {
        id: 7,
        label: 'Demon'
    }
];

export const CLASSES = [
    {
        id: 0,
        label: 'Warrior'
    },
    {
        id: 1,
        label: 'Mage'
    },
    {
        id: 2,
        label: 'Druid'
    },
    {
        id: 3,
        label: 'Paladin'
    },
    {
        id: 4,
        label: 'Bard'
    },
    {
        id: 5,
        label: 'Necromancer'
    },
    {
        id: 6,
        label: 'Priest'
    },
    {
        id: 7,
        label: 'Rogue'
    }
];

// TODO: Move these to backend.  Note that everything is 1 based in the contract.  That's why there is a DUMMY in index 0
export const WEATHERS = ['DUMMY', 'Clouds', 'Clear', 'Atmosphere', 'Snow', 'Rain', 'Drizzle', 'Thunderstorm'];
export const CITIES = [
    'DUMMY',
    'Vancouver, Canada',
    'Austin, USA',
    'Chicago, USA',
    'Miami, USA',
    'NYC, USA',
    'San Diego, USA',
    'San Francisco, USA',
    'Seattle, USA',
    'Mexico City, Mexico',
    'Buenos Aires, Argentina',
    'Johannesburg, South Africa',
    'Cairo, Egypt',
    'London, UK',
    'Moscow, Russia',
    'Berlin, Germany',
    'Paris, France',
    'Amsterdam, The Netherlands',
    'Stockholm, Sweden',
    'Tokyo, Japan',
    'Mumbai, India',
    'Shanghai, China',
    'Seoul, South Korea',
    'Singapore, Singapore',
    'Melbourne, Australia'
];

export const ALIGNMENTS = [
    'DUMMY',
    'Lawful Good',
    'Neutral Good',
    'Chaotic Good',
    'Lawful Neutral',
    'True Neutral',
    'Chaotic Neutral',
    'Lawful Evil',
    'Neutral Evil',
    'Chaotic Evil'
];

export const NUM_AFFINITIES = 5;

export const RACE_APPEARANCES = [
    ['Human Male', 'Human Female'],
    ['Cat Male', 'Cat Female'],
    ['Elf Male', 'Elf Female'],
    ['Frog Male', 'Frog Female'],
    ['Bear Male', 'Bear Female'],
    ['Bull Male', 'Bull Female'],
    ['Robot Male', 'Robot Female']
];

export const DUEL_WORKFLOW_STEPS_MAP = {
    SELECT_OPPONENT: 0,
    WAGER: 1,
    CONFIRM: 2
};

export const OPENWEATHER_CITY_IDS = {
    6173331: 'Vancouver, Canada',
    4671654: 'Austin, USA',
    4887398: 'Chicago, USA',
    4164138: 'Miami. USA',
    5128581: 'NYC, USA',
    5391811: 'San Diego, USA',
    5391959: 'San Francisco, USA',
    5809844: 'Seattle, USA',
    3530597: 'Mexico City, Mexico',
    3435907: 'Buenos Aires, Argentina',
    993800: 'Johannesburg, South Africa',
    360630: 'Cairo, Egypt',
    2643743: 'London, UK',
    524894: 'Moscow, Russia',
    2950158: 'Berlin, Germany',
    2968815: 'Paris, France',
    2759794: 'Amsterdam, The Netherlands',
    2673722: 'Stockholm, Sweden',
    1850147: 'Tokyo, Japan',
    1275339: 'Mumbai, India',
    1796236: 'Shanhai, China',
    1835847: 'Seoul, South Korea',
    1880252: 'Singapore, Singapore',
    2158177: 'Melbourne, Australia'
};
