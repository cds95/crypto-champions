import React from 'react';
import { getImage, imageNames } from '../../images';
import './UnkownTile.css';

const text = {
    summon: 'Summon'
};

export const UnkownTile = ({ onClick = () => {} }) => {
    return (
        <div className="unknown-tile">
            <img src={getImage(imageNames.FIRE)} />
            <CryptoChampionButton onClick={onClick} label={text.summon} />
        </div>
    );
};
