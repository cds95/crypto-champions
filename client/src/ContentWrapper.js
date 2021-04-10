import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
    useGetAffinities,
    useGetCurrentRound,
    useGetCurrentRoundWinningAffinity,
    useGetElderSpirits,
    useGetHeroes,
    useGetMaxElderSpirits,
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
    setPhaseAction
} from './redux/actions';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import { routeDefinitions } from './routeDefinitions';
import { Play } from './pages/PlayPage';
import { NavigationBar } from './components/NavigationBar';
import { Gallery } from './pages/Gallery';
import { MyCollection } from './pages/MyCollection';
import { CircularProgress } from '@material-ui/core';

export const ContentWrapperComp = ({
    setMaxElderSpirits,
    setNumMintedElderSpirits,
    setElderSpirits,
    setAffinities,
    setUserAccount,
    setWinningAffinity,
    setCurrentRound,
    setHeroes,
    setIsLoadingHeroes,
    setPhase
}) => {
    const { maxElderSpirits } = useGetMaxElderSpirits();
    const { numMintedElderSpirits } = useGetNumMintedElderSpirits();
    const { elderSpirits, isLoading: isLoadingElderSpirits } = useGetElderSpirits(numMintedElderSpirits);
    const { affinities, isLoading: isLoadingAffinities } = useGetAffinities(maxElderSpirits);
    const { userAccount } = useGetUserAccount();
    const { userTokenBalance } = useGetUserTokenBalance();
    const { affinity } = useGetCurrentRoundWinningAffinity();
    const { currentRound } = useGetCurrentRound();
    const { isLoading: isLoadingHeroes, heroes = [] } = useGetHeroes();
    const { isLoading, phase, isInErrorState } = useGetPhase();
    useEffect(() => {
        setPhase(phase);
    }, [phase]);
    useEffect(() => setMaxElderSpirits(maxElderSpirits), [maxElderSpirits]);
    useEffect(() => setNumMintedElderSpirits(numMintedElderSpirits), [numMintedElderSpirits]);
    useEffect(() => setElderSpirits(elderSpirits), [elderSpirits.length]);
    useEffect(() => setAffinities(affinities), [isLoadingAffinities]);
    useEffect(() => setUserAccount(userAccount), [userAccount]);
    useEffect(() => setWinningAffinity(affinity), [affinity]);
    useEffect(() => setCurrentRound(currentRound), [currentRound]);
    useEffect(() => {
        setIsLoadingHeroes(isLoadingHeroes);
        setHeroes(heroes);
    }, [isLoadingHeroes]);
    if (isLoading || isLoadingHeroes || isLoadingElderSpirits) {
        return (
            <div className="content-loading">
                <CircularProgress />
            </div>
        );
    }
    if (isInErrorState) {
        return (
            <div>
                Failed to get current phase. Make sure you're MetaMask wallet is connected as we can't connect to the
                blockchain without it.
            </div>
        );
    }
    return (
        <Router>
            <NavigationBar userTokenBalance={userTokenBalance} />
            <Switch>
                <Route path={routeDefinitions.ROOT} exact={true}>
                    <LandingPage />
                </Route>
                <Route path={routeDefinitions.PLAY}>
                    <Play />
                </Route>
                <Route path={routeDefinitions.GALLERY}>
                    <Gallery />
                </Route>
                <Route path={routeDefinitions.COLLECTION}>
                    <MyCollection />
                </Route>
            </Switch>
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
        }
    };
};

export const ContentWrapper = connect(null, mapDispatchToProps)(ContentWrapperComp);
