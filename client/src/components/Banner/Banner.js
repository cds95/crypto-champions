import React from 'react';
import clsx from 'clsx';
import './Banner.css';
import { Typography } from '@material-ui/core';

export const Banner = ({ text, isError, isWarning }) => {
    const className = clsx('banner', {
        'banner--error': isError,
        'banner-warning': isWarning
    });
    return (
        <div className={className}>
            <Typography className="banner__text league-spartan">{text}</Typography>
        </div>
    );
};
