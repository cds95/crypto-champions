import human from './Human.gif';
import cat from './Kittie.gif';
import elf from './Elf.gif';
import frog from './Froggen.gif';
import bear from './Bera.gif';
import bull from './Bully.gif';
import robot from './Robo.gif';

const gifs = [human, cat, elf, frog, bear, bull, robot];
export const getRaceGif = (id) => gifs[id];
