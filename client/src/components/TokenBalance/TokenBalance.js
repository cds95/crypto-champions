import { Typography } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { displayToken } from '../../AppUtils';
import { getUserBalance } from '../../redux/selectors';
import './TokenBalance.css';
import clsx from 'clsx';

const text = {
    tokenBalance: 'Token Balance',
    creds: 'Creds'
};

export const TokenBalanceComp = ({ tokenBalance, className }) => {
    const tokenClassName = clsx('token-balance', {
        [`${className}`]: !!className
    });
    return (
        <Typography variant="h4" className={tokenClassName}>{`${text.tokenBalance}: ${displayToken(tokenBalance)} ${
            text.creds
        }`}</Typography>
    );
};

const mapStateToProps = (state) => {
    return {
        tokenBalance: getUserBalance(state)
    };
};

export const TokenBalance = connect(mapStateToProps)(TokenBalanceComp);
