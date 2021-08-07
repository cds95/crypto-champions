import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
    useGetAffinities,
    useGetCurrentRound,
    useGetCurrentRoundWinningAffinity,
    useGetElderSpirits,
    useGetHeroes,
    useGetMaxElderSpirits,
    useGetMintElderSpiritPrice,
    useGetNumMintedElderSpirits,
    useGetPhase,
    useGetUserAccount,
    useGetUserTokenBalance
} from './hooks/cryptoChampionsHook';
import { LandingPage } from './pages/LandingPage';
import {
    setMaxElderSpiritsAction,
    setNumMintedElderSpiritsAction,
    setElderSpiritsAction,
    setAffinitiesAction,
    setUserAccountAction,
    setRoundWinningAffinity,
    setCurrentRoundAction,
    setHeroesAction,
    setIsLoadingHeroesAction,
    setPhaseAction,
    setUserBalanceAction,
    setMintElderSpiritPriceAction
} from './redux/actions';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import { routeDefinitions } from './routeDefinitions';
import { Play } from './pages/PlayPage';
import { NavigationBar } from './components/NavigationBar';
import { Gallery } from './pages/Gallery';
import { MyCollection } from './pages/MyCollection';
import { CircularProgress, Typography } from '@material-ui/core';
import { Footer } from './components/Footer/Footer';
import { Banner } from './components/Banner';
import { About } from './pages/About';

const text = {
    failedToConnect:
        'Network Error: Please make sure to connect your wallet to the correct network and refresh the page',
    loading: 'Loading Crypto Champz'
};

export const ContentWrapperComp = () => {
    return (
        <Router>
            <div className="app-content">
                <Switch>
                    <Route path={routeDefinitions.ROOT} exact={true}>
                        <LandingPage />
                    </Route>
                    <Route path={routeDefinitions.ABOUT}>
                        <About />
                    </Route>
                </Switch>
            </div>
            <Footer />
        </Router>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        setMaxElderSpirits: (maxElderSpirits) => {
            dispatch(setMaxElderSpiritsAction(maxElderSpirits));
        },
        setNumMintedElderSpirits: (numMintedElderSpirits) => {
            dispatch(setNumMintedElderSpiritsAction(numMintedElderSpirits));
        },
        setElderSpirits: (elderSpirits) => {
            dispatch(setElderSpiritsAction(elderSpirits));
        },
        setAffinities: (affinities) => {
            dispatch(setAffinitiesAction(affinities));
        },
        setUserAccount: (account) => {
            dispatch(setUserAccountAction(account));
        },
        setWinningAffinity: (affinity) => {
            dispatch(setRoundWinningAffinity(affinity));
        },
        setCurrentRound: (currentRound) => {
            dispatch(setCurrentRoundAction(currentRound));
        },
        setHeroes: (heroes) => {
            dispatch(setHeroesAction(heroes));
        },
        setIsLoadingHeroes: (isLoadingHeroes) => {
            dispatch(setIsLoadingHeroesAction(isLoadingHeroes));
        },
        setPhase: (phase) => {
            dispatch(setPhaseAction(phase));
        },
        setUserBalance: (balance) => {
            dispatch(setUserBalanceAction(balance));
        },
        setMintElderSpiritPrice: (price) => {
            dispatch(setMintElderSpiritPriceAction(price));
        }
    };
};

export const ContentWrapper = connect(null, mapDispatchToProps)(ContentWrapperComp);
