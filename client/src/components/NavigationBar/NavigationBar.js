import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { routeDefinitions } from '../../routeDefinitions';
import './NavigationBar.css';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { CircularProgress, DrawerComponent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

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

export const MOBILE_WIDTH = 768;

export const NavigationBar = ({ userAccount }) => {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_WIDTH);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const listener = window.addEventListener('resize', () => {
            const isNewWidthMobile = window.innerWidth < MOBILE_WIDTH;
            setIsMobile(isNewWidthMobile);
        });
        return () => {
            window.removeEventListener('resize', listener);
        };
    }, []);

    const getLinkClassName = (path) => {
        return clsx('navigation-bar__link', 'navigation-bar__text', {
            'navigation-bar__link--selected': location.pathname === path
        });
    };
    const openMobileMenu = () => setIsMobileMenuOpen(true);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    let menu;
    if (isMobile) {
        menu = (
            <React.Fragment>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon onClick={openMobileMenu} />
                </IconButton>
                {isMobileMenuOpen && (
                    <div className="navigation-bar__menu--mobile">
                        <div className="navigation-bar__menu-mobile__close">
                            <CloseIcon onClick={closeMobileMenu} />
                        </div>
                        <Link
                            className={getLinkClassName(routeDefinitions.ROOT)}
                            to={routeDefinitions.ROOT}
                            onClick={closeMobileMenu}
                        >
                            <Typography variant="h6">{text.links.home}</Typography>
                        </Link>
                        <Link
                            className={getLinkClassName(routeDefinitions.ABOUT)}
                            to={routeDefinitions.ABOUT}
                            onClick={closeMobileMenu}
                        >
                            <Typography variant="h6">{text.links.about}</Typography>
                        </Link>
                        <Link
                            className={getLinkClassName(routeDefinitions.PLAY)}
                            to={routeDefinitions.PLAY}
                            onClick={closeMobileMenu}
                        >
                            <Typography variant="h6">{text.links.play}</Typography>
                        </Link>
                        <Link
                            to={routeDefinitions.COLLECTION}
                            className={getLinkClassName(routeDefinitions.COLLECTION)}
                            onClick={closeMobileMenu}
                        >
                            <Typography variant="h6">{text.links.collection}</Typography>
                        </Link>
                        <Link
                            to={routeDefinitions.GALLERY}
                            className={getLinkClassName(routeDefinitions.GALLERY)}
                            onClick={closeMobileMenu}
                        >
                            <Typography variant="h6">{text.links.gallery}</Typography>
                        </Link>
                        <Typography className="navigation-bar__text navigation-bar__user-account">
                            {userAccount}
                        </Typography>
                    </div>
                )}
            </React.Fragment>
        );
    } else {
        menu = (
            <React.Fragment>
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
            </React.Fragment>
        );
    }
    return (
        <AppBar position="static" className="navigation-bar">
            <Toolbar>
                <Typography className="navigation-bar__text" variant="h6">
                    {text.cryptoChampions}
                </Typography>
                <div className="navigation-bar__options">{menu}</div>
            </Toolbar>
        </AppBar>
    );
};
