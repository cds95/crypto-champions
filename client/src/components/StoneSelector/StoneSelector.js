import React from 'react';
import { STONES } from '../../constants';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    title: '1st Cycle Summoning Elder Spirits',
    caption: 'Elder spirits are to be summoned to be our champions',
    subCaption: 'Elder spirits will determnine the Race, Class and Afinity of the Champions they gather'
};

export const StoneSelector = ({ onSelect, selectedStoneId, elderSpirits, maxElderSpirits }) => {
    const items = elderSpirits.map((spirit) => ({
        id: spirit.id,
        label: `Test`
    }));
    const availableElderSpots = maxElderSpirits - items.length;
    for (let i = 0; i < availableElderSpots; i++) {
        items.push({
            id: items.length + i,
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
