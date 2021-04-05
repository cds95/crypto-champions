import { CHAINS, RACES, CLASSES } from './constants';
import { getRaceImage } from './images/races';
import getWeb3 from './services/web3';
import map from './artifacts/deployments/map.json';

export const getChain = async () => {
    const web3 = await getWeb3();
    const networkId = await web3.eth.net.getId();
    if (Object.keys(map).indexOf(networkId) === -1) {
        return CHAINS.DEV;
    }
    return networkId;
};

// TODO:  Replace once images are on IPFS
export const getElderSpiritImage = (elderSpirit) => getRaceImage(elderSpirit.raceId);

export const getRace = (raceId) => RACES[raceId];

export const getClass = (classId) => CLASSES[classId];

export const getElderSpiritLabel = (elder) => {
    const race = getRace(elder.raceId);
    const elderClass = getClass(elder.classId);
    return `${race.label} - ${elderClass.label}`;
};
