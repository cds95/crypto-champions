import React from 'react';
import { connect } from 'react-redux';
import { setMaxElderSpiritsAction } from '../../redux/actions';
import './LandingPage.css';
import { Link } from 'react-router-dom';
import { routeDefinitions } from '../../routeDefinitions';
import { CryptoChampionButton } from '../../components/CryptoChampionButton';
import { Typography } from '@material-ui/core';
import PepeA from '../../images/races/Pepe_A.png';

export const LandingPageComp = () => {
    return (
        <div className="landing-page">
            <div className="landing-page__content">
                <div className="landing-page__text">
                    <h1 className="landing-page__text-header">
                        Introducing the universal standard for <span className="pink-font">interoperable</span>,{' '}
                        <span className="pink-font">composable</span> NFT <span className="pink-font">primitives</span>
                    </h1>
                    <div className="landing-page__text-caption">
                        Traverse the Metaverse with NFTs that have deep and infinitely configurable functionality.{' '}
                    </div>
                    <div className="landing-page__action">
                        <CryptoChampionButton label="Coming soon..." />
                    </div>
                </div>
                <div className="landing-page__image-container">
                    <img className="landing-page__image" src={PepeA} />
                </div>
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
