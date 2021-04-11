import humanMale from './Human_A.png';
import humanFemale from './Human_B.png';
import catMale from './Cat_A.png';
import catFemale from './Cat_B.png';
import elfMale from './Elf_A.png';
import elfFemale from './Elf_B.png';
import frogMale from './Pepe_A.png';
import frogFemale from './Pepe_B.png';
import bearMale from './Bear_A.png';
import bearFemale from './Bear_B.png';
import bullMale from './Bull_A.png';
import bullFemale from './Bull_B.png';
import robotMale from './Robot_A.png';
import robotFemale from './Robot_B.png';

export const images = [
    [humanMale, humanFemale],
    [catMale, catFemale],
    [elfMale, elfFemale],
    [frogMale, frogFemale],
    [bearMale, bearFemale],
    [bullMale, bullFemale],
    [robotMale, robotFemale]
];

export const getRaceImage = (id, appearance) => {
    appearance = Math.max(0, appearance - 1); // Appearance is always 0 when using dummy data.  Also appearance is 1 based in the contract
    return images[id][appearance];
};
