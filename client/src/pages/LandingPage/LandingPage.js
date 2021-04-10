import React from 'react';
import { connect } from 'react-redux';
import { setMaxElderSpiritsAction } from '../../redux/actions';
import './LandingPage.css';
import { Link } from 'react-router-dom';
import { routeDefinitions } from '../../routeDefinitions';
import { CryptoChampionButton } from '../../components/CryptoChampionButton';

export const LandingPageComp = () => {
    return (
        <div className="landing-page">
            <div className="landing-page__content">
                <Link
                    to={routeDefinitions.PLAY}
                    component={(props) => <CryptoChampionButton {...props} label="Get Started" />}
                />
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        setMaxElderSpirits: (maxElderSpirits) => {
            dispatch(setMaxElderSpiritsAction(maxElderSpirits));
        }
    };
};

export const LandingPage = connect(null, mapDispatchToProps)(LandingPageComp);
