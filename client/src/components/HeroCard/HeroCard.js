import { Typography } from '@material-ui/core';
import React from 'react';
import { getAlignment, getBackground, getClass, getHometown, getRace } from '../../AppUtils';
import './HeroCard.css';
import { WEATHERS } from '../../constants';
import clsx from 'clsx';
import { getRaceImage } from '../../images/races';
import { getCoinLogo } from '../../images/cryptoIcons';

export const HeroCard = ({ hero, isVertical, isSelectable, isSelected, onSelect, action, shouldOnlyShowImage }) => {
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
        weather,
        appearance,
        roundMinted,
        background,
        traitOne,
        skillOne
    } = hero;
    const image = getRaceImage(hero.raceId, appearance);
    const race = getRace(hero.raceId);
    const heroClass = getClass(hero.classId);
    const className = clsx('hero-card', {
        'hero-card--vertical': isVertical,
        'hero-card--selectable': isSelectable,
        'hero-card--selected': isSelected,
        'hero-card--image-only': shouldOnlyShowImage
    });
    return (
        <div className={className} onClick={() => isSelectable && onSelect && onSelect(hero)}>
            <div className="hero-card__content">
                <div className="hero-card__top">
                    <div className="hero-card__extension">
                        <Typography className="hero-card__extension-item">{race.label}</Typography>
                        <Typography className="hero-card__extension-item">{heroClass.label}</Typography>
                    </div>
                    <div className="hero-card__affinity">
                        <img src={getCoinLogo(affinity)} />
                    </div>
                </div>
                <img src={image} />
                <strong className="hero-card__name">{hero.heroName}</strong>
                <div className="hero-card__stats">
                    <div className="hero-card__stats-top">
                        <strong>{`${getAlignment(alignment)} ${getBackground(background)}`}</strong>
                    </div>
                    <div className="hero-card__stats-bot">
                        <div className="hero-card__stats-left">
                            <div>
                                <div className="hero-card__basic-stat">
                                    <strong>Skill: </strong>
                                    {heroClass.skills[skillOne]}
                                </div>
                                <div className="hero-card__basic-stat">
                                    <strong>Trait: </strong>
                                    {race.traits[traitOne]}
                                </div>
                            </div>
                            <div>
                                <div className="hero-card__basic-stat">
                                    <strong>Hometown: </strong>
                                    {getHometown(hometown)}
                                </div>
                                <div className="hero-card__basic-stat">
                                    <strong>Weather Pref: </strong>
                                    {WEATHERS[parseInt(weather)]}
                                </div>
                            </div>
                        </div>
                        <div className="hero-card__stats-right">
                            <div className="hero-card__stats-list">
                                <div className="hero-card__stats_list-item">
                                    <span>
                                        <strong>Str:</strong> {strength}
                                    </span>
                                </div>
                                <div className="hero-card__stats_list-item">
                                    <span>
                                        <strong>Dex:</strong> {dexterity}
                                    </span>
                                </div>
                                <div className="hero-card__stats_list-item">
                                    <span>
                                        <strong>Con:</strong> {constitution}
                                    </span>
                                </div>
                                <div className="hero-card__stats_list-item">
                                    <span>
                                        <strong>Int:</strong> {intelligence}
                                    </span>
                                </div>
                                <div className="hero-card__stats_list-item">
                                    <span>
                                        <strong>Wis:</strong> {wisdom}
                                    </span>
                                </div>
                                <div className="hero-card__stats_list-item">
                                    <span>
                                        <strong>Cha:</strong> {charisma}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-card__footer">{`Gen ${roundMinted}`}</div>
            </div>
            {action && <div className="hero-card__action">{action}</div>}
        </div>
    );
};
