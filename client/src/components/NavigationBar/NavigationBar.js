import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { routeDefinitions } from '../../routeDefinitions';
import './NavigationBar.css';

export const NavigationBar = () => {
    return (
        <AppBar position="static" className="navigation-bar">
            <Toolbar>
                <Typography variant="h6">Crypto Champions</Typography>
                <div className="navigation-bar__options">
                    <Link to={routeDefinitions.ROOT} className="navigation-bar__link">
                        <Typography variant="h6">Home</Typography>
                    </Link>
                    <Link to={routeDefinitions.PLAY} className="navigation-bar__link">
                        <Typography variant="h6">Play</Typography>
                    </Link>
                </div>
            </Toolbar>
        </AppBar>
    );
};
