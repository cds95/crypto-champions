import React from 'react';
import { STONES } from '../../constants';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    title: '1st Cycle Summoning Elder Spirits',
    caption: 'Elder spirits are to be summoned to be our champions',
    subCaption: 'Elder spirits will determnine the Race, Class and Afinity of the Champions they gather'
};
export const StoneSelector = ({ onSelect, selectedStoneId }) => {
    return (
        <ItemSelector
            title={text.title}
            caption={text.caption}
            items={STONES}
            onSelect={onSelect}
            subCaption={text.subCaption}
            selectedItemId={selectedStoneId}
        />
    );
};
