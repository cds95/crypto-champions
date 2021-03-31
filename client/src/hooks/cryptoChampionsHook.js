import { useState, useEffect } from 'react';
import {
    getAffinities,
    getElderSpirits,
    getMaxElderSpirits,
    getNumMintedElderSpirits,
    getPhase
} from '../services/cryptoChampions';

export const useGetNumMintedElderSpirits = () => {
    const [state, setState] = useState({
        isLoading: false,
        numMintedElderSpirits: 0
    });
    useEffect(() => {
        (async () => {
            setState({
                isLoading: true
            });
            const numMintedElderSpirits = await getNumMintedElderSpirits();
            setState({
                isLoading: false,
                numMintedElderSpirits
            });
        })();
    }, []);

    return state;
};

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
        phase: 0,
        isInErrorState: false
    });
    useEffect(() => {
        (async () => {
            setState({ isLoading: true });
            try {
                const phase = await getPhase();
                setState({
                    isLoading: false,
                    phase
                });
            } catch (e) {
                setState({
                    isLoading: false,
                    isInErrorState: true
                });
            }
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

export const useGetAffinities = (maxElders) => {
    const [state, setState] = useState({
        isLoading: false,
        affinities: []
    });
    useEffect(() => {
        (async () => {
            setState({ ...state, isLoading: true });
            const affinities = await getAffinities(maxElders);
            setState({
                isLoading: false,
                affinities
            });
        })();
    }, [maxElders]);
    return state;
};
