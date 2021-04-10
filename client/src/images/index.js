import Fire from './fire.png';
import Unavailable from './unavailable.png';

const images = {
    Fire,
    Unavailable
};

export const getImage = (image) => {
    return images[image];
};

export const imageNames = {
    FIRE: 'Fire',
    UNAVAILABLE: 'Unavailable'
};
