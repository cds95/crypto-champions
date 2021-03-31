import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useGetElderSpirits, useGetMaxElderSpirits, useGetNumMintedElderSpirits } from './hooks/cryptoChampionsHook';
import { LandingPage } from './pages/LandingPage';
import { setMaxElderSpiritsAction, setNumMintedElderSpiritsAction, setElderSpiritsAction } from './redux/actions';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { routeDefinitions } from './routeDefinitions';
import { Play } from './pages/PlayPage';
import { NavigationBar } from './components/NavigationBar';

export const ContentWrapperComp = ({ setMaxElderSpirits, setNumMintedElderSpirits, setElderSpirits }) => {
    const { maxElderSpirits } = useGetMaxElderSpirits();
    const { numMintedElderSpirits } = useGetNumMintedElderSpirits();
    const { elderSpirits } = useGetElderSpirits(numMintedElderSpirits);
    useEffect(() => setMaxElderSpirits(maxElderSpirits), [maxElderSpirits]);
    useEffect(() => setNumMintedElderSpirits(numMintedElderSpirits), [numMintedElderSpirits]);
    useEffect(() => setElderSpirits(elderSpirits), [elderSpirits]);
    return (
        <Router>
            <NavigationBar />
            <Switch>
                <Route path={routeDefinitions.ROOT} exact={true}>
                    <LandingPage />
                </Route>
                <Route path={routeDefinitions.PLAY}>
                    <Play />
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
        }
    };
};

export const ContentWrapper = connect(null, mapDispatchToProps)(ContentWrapperComp);
