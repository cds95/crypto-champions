import human from './Human.gif';
import cat from './Cat.gif';
import elf from './Elf.gif';
import frog from './Frog.gif';
import bear from './Bear.gif';
import bull from './Bull.gif';
import robot from './Robot.gif';

const gifs = [human, cat, elf, frog, bear, bull, robot];
export const getRaceGif = (id) => gifs[id];
