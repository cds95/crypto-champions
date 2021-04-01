import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { routeDefinitions } from '../../routeDefinitions';
import './NavigationBar.css';

const text = {
    cryptoChampions: 'Crypto Champions',
    links: {
        home: 'Home',
        play: 'Play'
    }
};

export const NavigationBar = () => {
    return (
        <AppBar position="static" className="navigation-bar">
            <Toolbar>
                <Typography className="navigation-bar__text" variant="h6">
                    {text.cryptoChampions}
                </Typography>
                <div className="navigation-bar__options">
                    <Link className="navigation-bar__text" to={routeDefinitions.ROOT} className="navigation-bar__link">
                        <Typography variant="h6">{text.links.home}</Typography>
                    </Link>
                    <Link className="navigation-bar__text" to={routeDefinitions.PLAY} className="navigation-bar__link">
                        <Typography variant="h6">{text.links.play}</Typography>
                    </Link>
                </div>
            </Toolbar>
        </AppBar>
    );
};
