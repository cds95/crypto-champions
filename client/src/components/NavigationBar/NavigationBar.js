import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { routeDefinitions } from '../../routeDefinitions';
import './NavigationBar.css';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';

const text = {
    cryptoChampions: 'Crypto Champz',
    links: {
        about: 'About',
        home: 'Home',
        play: 'Mint',
        gallery: 'Battle',
        collection: 'My Champz'
    }
};

export const NavigationBar = ({ userAccount }) => {
    const location = useLocation();

    const getLinkClassName = (path) => {
        return clsx('navigation-bar__link', 'navigation-bar__text', {
            'navigation-bar__link--selected': location.pathname === path
        });
    };
    return (
        <AppBar position="static" className="navigation-bar">
            <Toolbar>
                <Typography className="navigation-bar__text" variant="h6">
                    {text.cryptoChampions}
                </Typography>
                <div className="navigation-bar__options">
                    <Link className={getLinkClassName(routeDefinitions.ROOT)} to={routeDefinitions.ROOT}>
                        <Typography variant="h6">{text.links.home}</Typography>
                    </Link>
                    <Link className={getLinkClassName(routeDefinitions.ABOUT)} to={routeDefinitions.ABOUT}>
                        <Typography variant="h6">{text.links.about}</Typography>
                    </Link>
                    <Link className={getLinkClassName(routeDefinitions.PLAY)} to={routeDefinitions.PLAY}>
                        <Typography variant="h6">{text.links.play}</Typography>
                    </Link>
                    <Link to={routeDefinitions.COLLECTION} className={getLinkClassName(routeDefinitions.COLLECTION)}>
                        <Typography variant="h6">{text.links.collection}</Typography>
                    </Link>
                    <Link to={routeDefinitions.GALLERY} className={getLinkClassName(routeDefinitions.GALLERY)}>
                        <Typography variant="h6">{text.links.gallery}</Typography>
                    </Link>
                    <Typography className="navigation-bar__text navigation-bar__user-account">{userAccount}</Typography>
                </div>
            </Toolbar>
        </AppBar>
    );
};
