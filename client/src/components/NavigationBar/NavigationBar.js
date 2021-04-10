import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { routeDefinitions } from '../../routeDefinitions';
import './NavigationBar.css';

const text = {
    cryptoChampions: 'Crypto Champions',
    links: {
        about: 'About',
        home: 'Home',
        play: 'Mint',
        gallery: 'Battle',
        collection: 'My Champz'
    }
};

export const NavigationBar = ({ userAccount }) => {
    return (
        <AppBar position="static" className="navigation-bar">
            <Toolbar>
                <Typography className="navigation-bar__text" variant="h6">
                    {text.cryptoChampions}
                </Typography>
                <div className="navigation-bar__options">
                    <Link className="navigation-bar__link navigation-bar__text" to={routeDefinitions.ROOT}>
                        <Typography variant="h6">{text.links.home}</Typography>
                    </Link>
                    <Link className="navigation-bar__link navigation-bar__text" to={routeDefinitions.ABOUT}>
                        <Typography variant="h6">{text.links.about}</Typography>
                    </Link>
                    <Link className="navigation-bar__link navigation-bar__text" to={routeDefinitions.PLAY}>
                        <Typography variant="h6">{text.links.play}</Typography>
                    </Link>
                    <Link to={routeDefinitions.COLLECTION} className="navigation-bar__link navigation-bar__text">
                        <Typography variant="h6">{text.links.collection}</Typography>
                    </Link>
                    <Link to={routeDefinitions.GALLERY} className="navigation-bar__link navigation-bar__text">
                        <Typography variant="h6">{text.links.gallery}</Typography>
                    </Link>
                    <Typography className="navigation-bar__text navigation-bar__user-account" variant="h6">
                        {userAccount}
                    </Typography>
                </div>
            </Toolbar>
        </AppBar>
    );
};
