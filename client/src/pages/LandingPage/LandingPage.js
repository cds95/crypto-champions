import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useGetMaxElderSpirits } from '../../hooks/cryptoChampionsHook';
import { setMaxElderSpiritsAction } from '../../redux/actions';

export const LandingPageComp = ({ setMaxElderSpirits }) => {
    const { maxElderSpirits } = useGetMaxElderSpirits();
    useEffect(() => setMaxElderSpirits(maxElderSpirits), [maxElderSpirits]);
    return <div>{maxElderSpirits}</div>;
};

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        setMaxElderSpirits: (maxElderSpirits) => {
            dispatch(setMaxElderSpiritsAction(maxElderSpirits));
        }
    };
};

export const LandingPage = connect(mapStateToProps, mapDispatchToProps)(LandingPageComp);
