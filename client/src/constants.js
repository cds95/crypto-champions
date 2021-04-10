export const GITHUB_LINK = 'https://github.com/cds95/crypto-champions';
export const TWITTER_LINK = '';

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
        label: 'Cat'
    },
    {
        id: 2,
        label: 'Elf'
    },
    {
        id: 3,
        label: 'Frog'
    },
    {
        id: 4,
        label: 'Bear'
    },
    {
        id: 5,
        label: 'Bull'
    },
    {
        id: 6,
        label: 'Robot'
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
