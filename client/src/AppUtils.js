import { CHAINS, RACES, CLASSES, ZERO_ADDRESS, CITIES, ALIGNMENTS } from './constants';
import { getRaceImage } from './images/races';
import getWeb3 from './services/web3';
import map from './artifacts/deployments/map.json';
import BigNumber from 'bignumber.js';

export const getChain = async () => {
    const web3 = await getWeb3();
    const networkId = await web3.eth.net.getId();
    if (Object.keys(map).indexOf(`${networkId}`) === -1) {
        return CHAINS.DEV;
    }
    return networkId;
};

export const getRace = (raceId) => RACES[raceId];

export const getClass = (classId) => CLASSES[classId];

export const getRaceClassLabel = (raceId, classId) => {
    const race = getRace(raceId);
    const elderClass = getClass(classId);
    return `${race.label} ${elderClass.label}`;
};

export const isZeroAddress = (address) => address && address === ZERO_ADDRESS;

export const displayToken = (tokenInSmallestDenom) => {
    const bigNum = new BigNumber(tokenInSmallestDenom);
    const smallerDenom = bigNum.dividedBy(10 ** 18);
    return smallerDenom.toString();
};

export const getHometown = (hometownId) => {
    return CITIES[hometownId];
};

export const getAlignment = (alignment) => {
    return ALIGNMENTS[Math.max(1, alignment)];
};
