import React from 'react';
import { getRace } from '../../AppUtils';
import { RACES } from '../../constants';
import { getRaceImage } from '../../images/races';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    title: 'For what people do you seek redemption?',
    caption: 'Select a race'
};

export const RaceSelector = ({ onSelect, selectedRaceId, mintedRaces = [] }) => {
    const items = RACES.map((race) => ({
        ...race,
        image: getRaceImage(race.id),
        isSelectable: true
    })).filter((race) => mintedRaces.indexOf(race.id) === -1);
    return (
        <ItemSelector
            title={text.title}
            caption={text.caption}
            items={items}
            onSelect={onSelect}
            selectedItemId={selectedRaceId}
        />
    );
};
