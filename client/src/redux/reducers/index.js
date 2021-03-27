import { combineReducers } from 'redux';
import { cryptoChampions } from './cryptoChampions';
import { workflow } from './workflow';
import { mintElderSpiritWorkflow } from './mintElderSpiritWorkflow';
import { mintHeroWorkflow } from './mintHeroWorkflow';

export const reducers = combineReducers({
    cryptoChampions,
    mintElderSpiritWorkflow,
    mintHeroWorkflow,
    workflow
});
