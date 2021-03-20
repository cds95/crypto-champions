import { combineReducers } from 'redux';
import { cryptoChampions } from './cryptoChampions';
import { workflow } from './workflow';
import { mintElderSpiritWorkflow } from './mintElderSpiritWorkflow';

export const reducers = combineReducers({
    cryptoChampions,
    mintElderSpiritWorkflow,
    workflow
});
