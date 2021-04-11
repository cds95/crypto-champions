import { BottomNavigation, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { GITHUB_LINK, TWITTER_LINK } from '../../constants';
import './Footer.css';

const text = {
    gitHub: 'GitHub',
    twitter: 'Twitter'
};

export const Footer = () => {
    return (
        <BottomNavigation className="footer">
            <a href={GITHUB_LINK} className="footer__link footer__text" target="_blank">
                <Typography className="league-spartan">{text.gitHub}</Typography>
            </a>
            <a href={TWITTER_LINK} className="footer__link footer__text" target="_blank">
                <Typography className="league-spartan">{text.twitter}</Typography>
            </a>
        </BottomNavigation>
    );
};
