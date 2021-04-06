import { useState, useEffect } from 'react';
import {
    getAffinities,
    getElderSpirits,
    getHeroes,
    getMaxElderSpirits,
    getNumMintedElderSpirits,
    getPhase
} from '../services/cryptoChampions';
import { getAllWeatherDuels } from '../services/weatherWars';
import { getUserAccount } from '../services/web3';

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

export const useGetUserAccount = () => {
    const [state, setState] = useState({
        isLoading: false,
        userAccount: ''
    });
    useEffect(() => {
        (async () => {
            setState({ ...state, isLoading: true });
            const userAccount = await getUserAccount();
            setState({
                isLoading: false,
                userAccount
            });
        })();
    }, []);
    return state;
};

export const useGetHeroes = () => {
    const [state, setState] = useState({
        isLoading: false,
        isInErrorState: false,
        heroes: []
    });
    useEffect(() => {
        (async () => {
            setState({ isLoading: true });
            try {
                const heroes = await getHeroes();
                setState({
                    isLoading: false,
                    heroes
                });
            } catch (e) {
                setState({
                    isLoading: false,
                    isInErrorState: true,
                    heroes: []
                });
            }
        })();
    }, []);
    return state;
};

export const useGetWeatherDuels = () => {
    const [state, setState] = useState({
        isLoading: false,
        isInErrorState: false,
        weatherDuels: []
    });
    useEffect(() => {
        (async () => {
            setState({ isLoading: true });
            try {
                const weatherDuels = await getAllWeatherDuels();
                setState({
                    isLoading: false,
                    weatherDuels
                });
            } catch (e) {
                setState({
                    isLoading: false,
                    isInErrorState: true,
                    weatherDuels: []
                });
            }
        })();
    }, []);
    return state;
};
