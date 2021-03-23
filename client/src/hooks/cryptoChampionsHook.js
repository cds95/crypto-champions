import { useState, useEffect } from 'react';
import { getElderSpirits, getMaxElderSpirits, getPhase } from '../services/cryptoChampions';

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

export const useGetElderSpirits = (maxElderSpirits) => {
    const [state, setState] = useState({
        isLoading: false,
        elderSpirits: []
    });
    useEffect(() => {
        (async () => {
            setState({ ...state, isLoading: true });
            const elderSpirits = await getElderSpirits(maxElderSpirits);
            setState({
                isLoading: false,
                elderSpirits
            });
        })();
    }, [maxElderSpirits]);
    return state;
};
