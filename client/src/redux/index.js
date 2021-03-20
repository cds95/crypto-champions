import { createStore, compose } from 'redux';
import { reducers } from './reducers';

const composeEnhancers = (typeof window !== 'undefined' && window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']) || compose;

export const store = createStore(reducers, composeEnhancers());
