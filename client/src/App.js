import React from 'react';
import './App.css';
import useWeb3 from './hooks/web3';

const App = () => {
    const { isLoading, web3 } = useWeb3();
    return <div>{isLoading ? 'Loading' : 'Done'}</div>;
};

export default App;
