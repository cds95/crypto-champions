import React from 'react';
import './App.css';
import { useGetMaxElderSpirits } from './hooks/cryptoChampionsHook';
import useWeb3 from './hooks/web3';

const App = () => {
    const { isLoading, web3 } = useWeb3();
    const state = useGetMaxElderSpirits();
    return <div>{isLoading ? 'Loading' : 'Done'}</div>;
};

export default App;
