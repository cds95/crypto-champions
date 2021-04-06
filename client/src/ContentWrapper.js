import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
    useGetAffinities,
    useGetElderSpirits,
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
    setUserAccountAction
} from './redux/actions';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import { routeDefinitions } from './routeDefinitions';
import { Play } from './pages/PlayPage';
import { NavigationBar } from './components/NavigationBar';
import { Gallery } from './pages/Gallery';

export const ContentWrapperComp = ({
    setMaxElderSpirits,
    setNumMintedElderSpirits,
    setElderSpirits,
    setAffinities,
    setUserAccount
}) => {
    const { maxElderSpirits } = useGetMaxElderSpirits();
    const { numMintedElderSpirits } = useGetNumMintedElderSpirits();
    const { elderSpirits } = useGetElderSpirits(numMintedElderSpirits);
    const { affinities } = useGetAffinities(maxElderSpirits);
    const { userAccount } = useGetUserAccount();
    const { userTokenBalance } = useGetUserTokenBalance();
    useEffect(() => setMaxElderSpirits(maxElderSpirits), [maxElderSpirits]);
    useEffect(() => setNumMintedElderSpirits(numMintedElderSpirits), [numMintedElderSpirits]);
    useEffect(() => setElderSpirits(elderSpirits), [elderSpirits]);
    useEffect(() => setAffinities(affinities), [affinities]);
    useEffect(() => setUserAccount(userAccount));
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
        }
    };
};

export const ContentWrapper = connect(null, mapDispatchToProps)(ContentWrapperComp);
