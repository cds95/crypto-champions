import React from 'react';
import './App.css';
import useWeb3 from './hooks/web3';
import { Provider } from 'react-redux';
import { store } from './redux';
import { LandingPage } from './pages/LandingPage';

const App = () => {
    const { isLoading, web3 } = useWeb3();
    return <Provider store={store}>{isLoading ? 'Loading' : <LandingPage />}</Provider>;
};

export default App;
