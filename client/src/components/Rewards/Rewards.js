import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import clsx from 'clsx';
import './Rewards.css';
import { CryptoChampionButton } from '../CryptoChampionButton';

const text = {
    caption: 'You have Rewards!',
    noRewards: 'You have no rewards',
    claim: 'Claim Reward',
    previousRoundWinner: (affinity) => `Previous Round Winner: ${affinity}`
};

export const Rewards = ({ winningAffinity, winningHeroes = [], className, onClaim = () => {} }) => {
    const elementClassName = clsx('rewards', className);
    return (
        <Card className={elementClassName}>
            <Typography variant="h4">{winningHeroes.length > 0 ? text.caption : text.noRewards}</Typography>
            <CardContent>
                <Typography variant="h6">{text.previousRoundWinner(winningAffinity)}</Typography>
                {winningHeroes.map((hero) => {
                    const claimReward = () => onClaim(hero.id);
                    return (
                        <div className="rewards__item">
                            <Typography variant="body1" className="rewards__heroName">
                                {hero.heroName}
                            </Typography>
                            <CryptoChampionButton size="small" onClick={claimReward} label={text.claim} />
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};
