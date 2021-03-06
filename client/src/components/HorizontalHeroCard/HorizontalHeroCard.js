import React from 'react';
import { getAlignment, getBackground, getClass, getHometown, getRace } from '../../AppUtils';
import { WEATHERS } from '../../constants';
import { getClassImage } from '../../images/classes';
import { getCoinLogo } from '../../images/cryptoIcons';
import { getRaceImage } from '../../images/races';
import './HorizontalHeroCard.css';

const text = {
    name: 'Name',
    alignment: 'Alignment',
    background: 'Background',
    weather: 'Weather Preference',
    skill: 'Skill',
    trait: 'Trait',
    hometown: 'Hometown',
    trait: 'Trait',
    skill: 'Skill'
};

export const HorizontalHeroCard = ({ hero, action }) => {
    const {
        raceId,
        appearance,
        heroName,
        alignment,
        hometown,
        weather,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
        background,
        classId,
        affinity,
        traitOne,
        skillOne
    } = hero;
    const race = getRace(hero.raceId);
    const heroClass = getClass(hero.classId);
    return (
        <div className="horizontal-hero-card">
            <img src={getRaceImage(raceId, appearance)} className="horizontal-hero-card__image" />
            <div className="horizontal-hero-card__information">
                <div className="horizontal-hero-card__class-affinity">
                    <img src={getClassImage(classId)} className="horizontal-hero-card__class-image" />
                    <img src={getCoinLogo(affinity)} className="horizontal-hero-card__class-image" />
                </div>
                <div className="horizontal-hero-card__basic-information">
                    <div className="horizontal-hero-card__lore">
                        <div className="horizontal-hero-card__item-group">
                            <strong>{text.name}: </strong>
                            <span>{heroName}</span>
                        </div>
                        <div className="horizontal-hero-card__item-group">
                            <div>
                                <strong>{text.alignment}: </strong>
                                <span>{getAlignment(alignment)}</span>
                            </div>
                            <div>
                                <strong>{text.background}: </strong>
                                <span>{getBackground(background)}</span>
                            </div>
                        </div>
                        <div className="horizontal-hero-card__item-group">
                            <div>
                                <strong>{text.hometown}: </strong>
                                <span>{getHometown(hometown)}</span>
                            </div>
                            <div>
                                <strong>{text.weather}: </strong>
                                <span>{WEATHERS[parseInt(weather)]}</span>
                            </div>
                        </div>
                        <div className="horizontal-hero-card__item-group">
                            <div>
                                <strong>{text.skill}: </strong>
                                <span>{heroClass.skills[skillOne]}</span>
                            </div>
                            <div>
                                <strong>{text.trait}: </strong>
                                <span>{race.traits[traitOne]}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="horizontal-hero-card__stats">
                    <div className="horizontal-hero-card__stats-list">
                        <div className="horizontal-hero-card__stats_list-item">
                            <span>
                                <strong>Str: </strong> {strength}
                            </span>
                        </div>
                        <div className="horizontal-hero-card__stats_list-item">
                            <span>
                                <strong>Dex: </strong> {dexterity}
                            </span>
                        </div>
                        <div className="horizontal-hero-card__stats_list-item">
                            <span>
                                <strong>Con: </strong> {constitution}
                            </span>
                        </div>
                        <div className="horizontal-hero-card__stats_list-item">
                            <span>
                                <strong>Int: </strong> {intelligence}
                            </span>
                        </div>
                        <div className="horizontal-hero-card__stats_list-item">
                            <span>
                                <strong>Wis: </strong> {wisdom}
                            </span>
                        </div>
                        <div className="horizontal-hero-card__stats_list-item">
                            <span>
                                <strong>Cha: </strong> {charisma}
                            </span>
                        </div>
                    </div>
                    {action && <div className="horizontal-hero-card__action">{action}</div>}
                </div>
            </div>
        </div>
    );
};
