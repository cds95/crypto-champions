import React from 'react';
import { getRaceClassLabel } from '../../AppUtils';
import { getRaceGif } from '../../images/alternateRaces';
import { getCoinLogo } from '../../images/cryptoIcons';
import { getRaceImage } from '../../images/races';
import './ElderCard.css';

const text = {
    elderSpirit: 'Elder Spirit'
};

export const ElderCard = ({ elder }) => {
    return (
        <div className="elder-card">
            <div className="elder-card__identifier">{text.elderSpirit}</div>
            <img src={getRaceGif(elder.raceId)} />
            <div className="elder-card__label">{getRaceClassLabel(elder.raceId, elder.classId)}</div>
            <div className="elder-card__image-container">
                <img src={getCoinLogo(elder.affinity)} />
            </div>
        </div>
    );
};
