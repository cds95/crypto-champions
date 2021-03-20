import { useState, useEffect } from 'react';
import getWeb3 from '../services/web3';

const useWeb3 = () => {
    const [state, setState] = useState({
        isLoading: true,
        isWeb3: false,
        web3: null,
        accounts: []
    });
    useEffect(() => {
        (async () => {
            try {
                const web3 = await getWeb3();
                const accounts = await web3.eth.getAccounts();
                setState({
                    ...state,
                    isLoading: false,
                    isWeb3: true,
                    web3,
                    accounts
                });
            } catch {
                setState({
                    ...state,
                    isLoading: false
                });
            }
        })();
    }, []);
    return state;
};

export default useWeb3;
