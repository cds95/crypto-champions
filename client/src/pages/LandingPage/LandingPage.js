import React from 'react';
import { connect } from 'react-redux';
import { setMaxElderSpiritsAction } from '../../redux/actions';

export const LandingPageComp = ({ maxElderSpirits, maxNumHeroes }) => {
    return (
        <div>
            {maxElderSpirits} {maxNumHeroes}
        </div>
    );
};

const mapStateToProps = (state) => {
    const { maxElderSpirits, maxNumHeroes } = state.cryptoChampions;
    return {
        maxElderSpirits,
        maxNumHeroes
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setMaxElderSpirits: (maxElderSpirits) => {
            dispatch(setMaxElderSpiritsAction(maxElderSpirits));
        }
    };
};

export const LandingPage = connect(mapStateToProps, mapDispatchToProps)(LandingPageComp);
