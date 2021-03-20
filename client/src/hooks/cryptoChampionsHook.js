import { useState, useEffect } from 'react';
import { getMaxElderSpirits, getMaxNumHeroes, getPhase } from '../services/cryptoChampions';

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

export const useGetMaxNumHeroes = () => {
    const [state, setState] = useState({
        isLoading: false,
        maxNumHeroes: 0
    });
    useEffect(() => {
        (async () => {
            setState({
                isLoading: true
            });
            const maxNumHeroes = await getMaxNumHeroes();
            setState({
                isLoading: false,
                maxNumHeroes
            });
        })();
    }, []);

    return state;
};

export const useGetPhase = () => {
    const [state, setState] = useState({
        isLoading: false,
        phase: 0
    });
    useEffect(() => {
        (async () => {
            setState({ isLoading: true });
            const phase = await getPhase();
            setState({
                isLoading: false,
                phase
            });
        })();
    }, []);
    return state;
};
