import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { displayToken } from '../../AppUtils';
import { routeDefinitions } from '../../routeDefinitions';
import './NavigationBar.css';

const text = {
    cryptoChampions: 'Crypto Champions',
    links: {
        home: 'Home',
        play: 'Play',
        gallery: 'Gallery',
        collection: 'My Collection'
    }
};

export const NavigationBar = ({ userTokenBalance }) => {
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
                    <Link className="navigation-bar__link navigation-bar__text" to={routeDefinitions.PLAY}>
                        <Typography variant="h6">{text.links.play}</Typography>
                    </Link>
                    <Link to={routeDefinitions.COLLECTION} className="navigation-bar__link navigation-bar__text">
                        <Typography variant="h6">{text.links.collection}</Typography>
                    </Link>
                    <Link to={routeDefinitions.GALLERY} className="navigation-bar__link navigation-bar__text">
                        <Typography variant="h6">{text.links.gallery}</Typography>
                    </Link>
                    <Typography className="navigation-bar__text" variant="h6">{`Token Balance: ${displayToken(
                        userTokenBalance
                    )} CC`}</Typography>
                </div>
            </Toolbar>
        </AppBar>
    );
};
