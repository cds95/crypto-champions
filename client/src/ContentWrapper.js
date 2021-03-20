import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useGetMaxElderSpirits, useGetMaxNumHeroes } from './hooks/cryptoChampionsHook';
import { LandingPage } from './pages/LandingPage';
import { setMaxElderSpiritsAction, setMaxNumHeroesAction } from './redux/actions';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { routeDefinitions } from './routeDefinitions';
import { MintElderSpirintWorkflow } from './pages/MintElderSpiritWorkflow';

export const ContentWrapperComp = ({ setMaxElderSpirits, setMaxNumHeroes }) => {
    const { maxElderSpirits } = useGetMaxElderSpirits();
    const { maxNumHeroes } = useGetMaxNumHeroes();
    useEffect(() => setMaxElderSpirits(maxElderSpirits), [maxElderSpirits]);
    useEffect(() => setMaxNumHeroes(maxNumHeroes), [maxNumHeroes]);
    return (
        <Router>
            <Switch>
                <Route path={routeDefinitions.ROOT}>
                    <LandingPage />
                </Route>
                <Route path={routeDefinitions.PHASE_1_WORKFLOW}>
                    <MintElderSpirintWorkflow />
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
        setMaxNumHeroes: (maxNumHeroes) => {
            dispatch(setMaxNumHeroesAction(maxNumHeroes));
        }
    };
};

export const ContentWrapper = connect(null, mapDispatchToProps)(ContentWrapperComp);
