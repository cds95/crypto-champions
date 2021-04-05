import humanMale from './C01_human_male.jpg';
import humanFemale from './C02_human_female.jpg';
import elfMale from './C03_elf_male.jpg';
import elfFemale from './C04_elf_female.jpg';
import bear from './C05_bear.jpg';
import bull from './C06_bull.jpg';
import frog from './C07_frog.jpg';
import robot from './C08_robot.jpg';

// TODO:  We need to move thes to IPFS and we should record these in the CryptoChampions contract
const images = [humanMale, humanFemale, elfMale, elfFemale, bear, bull, frog, robot];

export const getRaceImage = (id) => {
    return images[id];
};
