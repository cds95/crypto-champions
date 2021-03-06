import React from 'react';
import { RACES } from '../../constants';
import { getRaceGif } from '../../images/alternateRaces/';
import { CryptoChampionButton } from '../CryptoChampionButton';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    title: 'For what people do you seek redemption?',
    caption: 'Select a race',
    select: 'Select'
};

export const RaceSelector = ({ onSelect, selectedRaceId, mintedRaces = [] }) => {
    const items = RACES.map((race) => ({
        ...race,
        image: getRaceGif(race.id),
        isSelectable: mintedRaces.indexOf(race.id) === -1,
        isUnavailable: mintedRaces.indexOf(race.id) !== -1,
        actionButton: mintedRaces.indexOf(race.id) === -1 && (
            <CryptoChampionButton label={text.select} onClick={() => onSelect(race)} />
        )
    }));

    const handleOnSelect = (race) => {
        if (race.isUnavailable) {
            return;
        }
        onSelect(race);
    };

    return (
        <ItemSelector
            title={text.title}
            caption={text.caption}
            items={items}
            onSelect={handleOnSelect}
            selectedItemId={selectedRaceId}
        />
    );
};
