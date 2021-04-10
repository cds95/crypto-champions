import warrior from './warrior.png';
import mage from './mage.png';
import druid from './druid.png';
import paladin from './paladin.png';
import bard from './bard.png';
import necromancer from './necromancer.png';
import priest from './priest.png';
import rogue from './rogue.png';

// TODO:  We need to move thes to IPFS and we should record these in the CryptoChampions contract
const images = [warrior, mage, druid, paladin, bard, necromancer, priest, rogue];

export const getClassImage = (id) => {
    return images[id];
};
