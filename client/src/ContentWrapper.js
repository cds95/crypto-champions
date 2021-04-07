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
    setIsLoadingHeroesAction
} from './redux/actions';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import { routeDefinitions } from './routeDefinitions';
import { Play } from './pages/PlayPage';
import { NavigationBar } from './components/NavigationBar';
import { Gallery } from './pages/Gallery';
import { MyCollection } from './pages/MyCollection';

export const ContentWrapperComp = ({
    setMaxElderSpirits,
    setNumMintedElderSpirits,
    setElderSpirits,
    setAffinities,
    setUserAccount,
    setWinningAffinity,
    setCurrentRound,
    setHeroes,
    setIsLoadingHeroes
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

    useEffect(() => setMaxElderSpirits(maxElderSpirits), [maxElderSpirits]);
    useEffect(() => setNumMintedElderSpirits(numMintedElderSpirits), [numMintedElderSpirits]);
    useEffect(() => setElderSpirits(elderSpirits), [isLoadingElderSpirits]);
    useEffect(() => setAffinities(affinities), [isLoadingAffinities]);
    useEffect(() => setUserAccount(userAccount), [userAccount]);
    useEffect(() => setWinningAffinity(affinity), [affinity]);
    useEffect(() => setCurrentRound(currentRound), [currentRound]);
    useEffect(() => {
        setIsLoadingHeroes(isLoadingHeroes);
        setHeroes(heroes);
    }, [isLoadingHeroes]);
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
        }
    };
};

export const ContentWrapper = connect(null, mapDispatchToProps)(ContentWrapperComp);
