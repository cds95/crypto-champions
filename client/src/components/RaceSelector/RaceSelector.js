import React from 'react';
import { getRaceImage } from '../../images/races';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    title: 'For what people do you seek redemption?',
    caption: 'Select a race'
};

export const RACES = [
    {
        id: 1,
        label: 'race 1'
    },
    {
        id: 2,
        label: 'race 2'
    },
    {
        id: 3,
        label: 'race 3'
    },
    {
        id: 4,
        label: 'race 4'
    },
    {
        id: 5,
        label: 'race 5'
    },
    {
        id: 6,
        label: 'race 6'
    },
    {
        id: 7,
        label: 'race 7'
    },
    {
        id: 8,
        label: 'race 8'
    }
];

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
