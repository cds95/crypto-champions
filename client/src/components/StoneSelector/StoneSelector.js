import React from 'react';
import { getRaceClassLabel } from '../../AppUtils';
import { getRaceGif } from '../../images/alternateRaces/images';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    title: '1st Cycle Summoning Elder Spirits',
    caption: 'Elder spirits are to be summoned to be our champions',
    subCaption: 'Elder spirits will determine the Race, Class and Afinity of the Champions they gather'
};

export const StoneSelector = ({ onSelect, selectedStoneId, elderSpirits, maxElderSpirits }) => {
    const items = elderSpirits.map((spirit) => ({
        id: spirit.id,
        label: getRaceClassLabel(spirit.raceId, spirit.classId),
        image: getRaceGif(spirit.raceId),
        subLabel: spirit.affinity
    }));
    const availableElderSpots = maxElderSpirits - items.length;
    for (let i = 0; i < availableElderSpots; i++) {
        items.push({
            id: items.length + i + 1,
            label: '',
            isSelectable: true
        });
    }
    return (
        <ItemSelector
            title={text.title}
            caption={text.caption}
            items={items}
            onSelect={onSelect}
            subCaption={text.subCaption}
            selectedItemId={selectedStoneId}
        />
    );
};
