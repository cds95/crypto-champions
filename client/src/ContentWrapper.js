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
import { CircularProgress } from '@material-ui/core';
import { Footer } from './components/Footer/Footer';
import { Banner } from './components/Banner';
import { About } from './pages/About';

const text = {
    failedToConnect:
        'Network Error: Please make sure to connect your wallet to the correct network and refresh the page'
};

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
    setUserBalance,
    setPhase,
    setMintElderSpiritPrice,
    isLoadingWeb3
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
    const { price } = useGetMintElderSpiritPrice();
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
    useEffect(() => setUserBalance(userTokenBalance), [userTokenBalance]);
    useEffect(() => {
        setIsLoadingHeroes(isLoadingHeroes);
        setHeroes(heroes);
    }, [isLoadingHeroes]);
    useEffect(() => setMintElderSpiritPrice(price), [price]);
    if (!isInErrorState && (isLoadingWeb3 || isLoading || isLoadingHeroes || isLoadingElderSpirits)) {
        return (
            <div className="content-loading">
                <CircularProgress />
            </div>
        );
    }
    return (
        <Router>
            <NavigationBar userAccount={userAccount} />
            {isInErrorState && <Banner text={text.failedToConnect} isError={isInErrorState} />}
            <div className="app-content">
                <Switch>
                    <Route path={routeDefinitions.ROOT} exact={true}>
                        <LandingPage />
                    </Route>
                    <Route path={routeDefinitions.ABOUT}>
                        <About />
                    </Route>
                    {!isInErrorState && (
                        <React.Fragment>
                            {' '}
                            <Route path={routeDefinitions.PLAY}>
                                <Play />
                            </Route>
                            <Route path={routeDefinitions.GALLERY}>
                                <Gallery />
                            </Route>
                            <Route path={routeDefinitions.COLLECTION}>
                                <MyCollection />
                            </Route>
                        </React.Fragment>
                    )}
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
