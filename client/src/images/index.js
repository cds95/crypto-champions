import Fire from './fire.png';
import Unavailable from './unavailable.png';
import Battle from './battle.png';

const images = {
    Fire,
    Unavailable,
    Battle
};

export const getImage = (image) => {
    return images[image];
};

export const imageNames = {
    FIRE: 'Fire',
    UNAVAILABLE: 'Unavailable',
    BATTLE: 'Battle'
};
