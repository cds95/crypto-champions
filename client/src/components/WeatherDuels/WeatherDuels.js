import React from 'react';
import { ItemSelector } from '../ItemSelector';
import { WeatherDuelTile } from '../WeatherDuelTile';
import './WeatherDuels.css';

export const WeatherDuels = ({ duels }) => {
    const items = duels.map((duel) => ({
        ...duel
    }));
    return <ItemSelector items={items} renderItem={(duel) => <WeatherDuelTile duel={duel} />} />;
};
