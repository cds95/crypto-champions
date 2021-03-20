import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useGetMaxElderSpirits, useGetMaxNumHeroes } from './hooks/cryptoChampionsHook';
import { LandingPage } from './pages/LandingPage';
import { setMaxElderSpiritsAction, setMaxNumHeroesAction } from './redux/actions';

export const ContentWrapperComp = ({ setMaxElderSpirits, setMaxNumHeroes }) => {
    const { maxElderSpirits } = useGetMaxElderSpirits();
    const { maxNumHeroes } = useGetMaxNumHeroes();
    useEffect(() => setMaxElderSpirits(maxElderSpirits), [maxElderSpirits]);
    useEffect(() => setMaxNumHeroes(maxNumHeroes), [maxNumHeroes]);
    return (
        <div>
            <LandingPage />
        </div>
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
