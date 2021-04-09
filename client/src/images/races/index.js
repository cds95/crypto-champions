import humanMale from './FP01-human_male.png';
import humanFemale from './FP02-human_female.png';
import catMale from './FP13-cat_male.png';
import catFemale from './FP14-cat_female.png';
import elfMale from './FP03-elf_male.png';
import elfFemale from './FP04-elf_female.png';
import frogMale from './FP11-frog_male.png';
import frogFemale from './FP12-frog_female.png';
import bearMale from './FP09-bear_male.png';
import bearFemale from './FP10-bear_female.png';
import bullMale from './FP05-bull_male.png';
import bullFemale from './FP06-bull_female.png';
import robotMale from './FP07-robot_male.png';
import robotFemale from './FP08-robot_female.png';

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
