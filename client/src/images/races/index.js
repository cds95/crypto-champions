import humanMale from './01-human_male.png';
import humanFemale from './02-human_female.png';
import elfMale from './03-elf_male.png';
import elfFemale from './04-elf_female.png';
import bear from './05-bear.png';
import bull from './06-bull.png';
import frog from './07-frog.png';
import robot from './08-robot.png';

// TODO:  We need to move thes to IPFS and we should record these in the CryptoChampions contract
const images = [humanMale, humanFemale, elfMale, elfFemale, bear, bull, frog, robot];

export const getRaceImage = (id) => {
    return images[id - 1]; // id is 1 based
};
