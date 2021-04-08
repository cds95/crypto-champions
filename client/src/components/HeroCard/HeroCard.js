import { Chip, Typography } from '@material-ui/core';
import React from 'react';
import { getAlignment, getClass, getHometown, getRace } from '../../AppUtils';
import { getRaceImage } from '../../images/races';
import './HeroCard.css';
import { WEATHERS } from '../../constants';
import clsx from 'clsx';

export const HeroCard = ({ hero, isVertical, isSelectable }) => {
    const {
        affinity,
        alignment,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
        hometown,
        weather
    } = hero;
    const image = getRaceImage(hero.raceId);
    const race = getRace(hero.raceId);
    const heroClass = getClass(hero.classId);
    const className = clsx('hero-card', {
        'hero-card--vertical': isVertical,
        'hero-card--selectable': isSelectable
    });
    return (
        <div className={className}>
            <div className="hero-card__content">
                <div className="hero-card__extension">
                    <Typography className="hero-card__extension-item pronciono">{race.label}</Typography>
                    <Typography className="hero-card__extension-item pronciono">{heroClass.label}</Typography>
                </div>
                <div className="hero-card__affinity">
                    <Typography className="pronciono">{affinity}</Typography>
                </div>
                <div className="hero-card__image-container">
                    <img src={image} />
                </div>
                <div className="hero-card__name">
                    <Chip className="hero-card__name-pill" label={hero.heroName} />
                </div>
                <div className="hero-card__stats">
                    <div className="hero-card__stats-top">
                        <div className="hero-card__stats-list">
                            <div className="hero-card__stats_list-item">
                                <span className="pronciono">STR: {strength}</span>
                            </div>
                            <div className="hero-card__stats_list-item">
                                <span className="pronciono">DEX: {dexterity}</span>
                            </div>
                            <div className="hero-card__stats_list-item">
                                <span className="pronciono">CON: {constitution}</span>
                            </div>
                            <div className="hero-card__stats_list-item">
                                <span className="pronciono">INT: {intelligence}</span>
                            </div>
                            <div className="hero-card__stats_list-item">
                                <span className="pronciono">WIS: {wisdom}</span>
                            </div>
                            <div className="hero-card__stats_list-item">
                                <span className="pronciono">CHA: {charisma}</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-card__stats-bot">
                        <div>
                            <Typography className="pronciono">{getAlignment(alignment)}</Typography>
                        </div>
                        <div>
                            <Typography className="pronciono">{WEATHERS[parseInt(weather)]}</Typography>
                            <Typography className="pronciono">{getHometown(hometown)}</Typography>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
