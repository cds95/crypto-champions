import { combineReducers } from 'redux';
import { cryptoChampions } from './cryptoChampions';
import { workflow } from './workflow';
import { mintElderSpiritWorkflow } from './mintElderSpiritWorkflow';
import { mintHeroWorkflow } from './mintHeroWorkflow';
import { heroes } from './heroes';
import { duel } from './duel';
import { collection } from './collection';

export const reducers = combineReducers({
    cryptoChampions,
    mintElderSpiritWorkflow,
    mintHeroWorkflow,
    workflow,
    heroes,
    duel,
    collection
});
