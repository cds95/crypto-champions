import { CHAINS, RACES, CLASSES } from './constants';
import { getRaceImage } from './images/races';

export const getChain = () => {
    return CHAINS.DEV;
};

// TODO:  Replace once images are on IPFS
export const getElderSpiritImage = (elderSpirit) => getRaceImage(elderSpirit.raceId);

export const getRace = (raceId) => RACES[raceId];

export const getClass = (classId) => CLASSES[classId];
