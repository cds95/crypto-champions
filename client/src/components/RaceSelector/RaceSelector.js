import React from 'react';
import { RACES } from '../../constants';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    title: 'For what people do you seek redemption?',
    caption: 'Select a race'
};

export const RaceSelector = ({ onSelect, selectedRaceId }) => {
    return (
        <ItemSelector
            title={text.title}
            caption={text.caption}
            items={RACES}
            onSelect={onSelect}
            selectedItemId={selectedRaceId}
        />
    );
};
