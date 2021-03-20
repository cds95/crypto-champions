import { useState, useEffect } from 'react';
import { getMaxElderSpirits } from '../services/cryptoChampions';

export const useGetMaxElderSpirits = () => {
    const [state, setState] = useState({
        isLoading: false,
        maxElderSpirits: 0
    });
    useEffect(() => {
        (async () => {
            setState({
                isLoading: true
            });
            const maxElderSpirits = await getMaxElderSpirits();
            setState({
                isLoading: false,
                maxElderSpirits
            });
        })();
    }, []);

    return state;
};
