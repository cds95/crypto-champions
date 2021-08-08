import React from 'react';
import './App.css';
import useWeb3 from './hooks/web3';
import { Provider } from 'react-redux';
import { store } from './redux';
import { ContentWrapper } from './ContentWrapper';
import './App.css';

const App = () => {
    return (
        <Provider store={store}>
            <ContentWrapper />
        </Provider>
    );
};

export default App;
