import React from 'react';
import { WeatherDuelTile } from '../WeatherDuelTile';
import './WeatherDuels.css';

export const WeatherDuels = ({ duels }) => {
    return (
        <div className="weather-duels">
            {duels.map((duel) => (
                <WeatherDuelTile key={duel.address} duel={duel} />
            ))}
        </div>
    );
};
