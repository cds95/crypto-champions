import React from 'react';
import { connect } from 'react-redux';
import { setMaxElderSpiritsAction } from '../../redux/actions';
import './LandingPage.css';
import { Link } from 'react-router-dom';
import { routeDefinitions } from '../../routeDefinitions';
import { CryptoChampionButton } from '../../components/CryptoChampionButton';
import { Typography } from '@material-ui/core';
import { VIDEO_LINK } from '../../constants';

const text = {
    welcome: 'Welcome to Crypto Champz!',
    caption: 'A Universal Character Generator and Minigame Playground'
};

export const LandingPageComp = () => {
    return (
        <div className="landing-page">
            <Typography variant="h2" className="page-header landing-page__header">
                {text.welcome}
            </Typography>
            <Typography variant="h2" className="page-header landing-page__header">
                {text.caption}
            </Typography>
            <div className="landing-page__content">
                <div className="landing-page__video-container">
                    <div className="landing-page__video-container-inside" />
                    <iframe
                        src="https://www.youtube.com/embed/KyIWXI5WxxE"
                        title="Crypto Champz Demo"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen={true}
                        className="landing-page__content-video"
                    ></iframe>
                </div>
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
