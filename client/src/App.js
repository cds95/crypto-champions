import React from 'react';
import './App.css';
import useWeb3 from './hooks/web3';
import { Provider } from 'react-redux';
import { store } from './redux';
import { ContentWrapper } from './ContentWrapper';
import { NavigationBar } from './components/NavigationBar';

const App = () => {
    const { isLoading } = useWeb3();
    return <Provider store={store}>{isLoading ? 'Loading' : <ContentWrapper />}</Provider>;
};

export default App;
