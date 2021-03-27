import React from 'react';
import { STONES } from '../../constants';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    title: (numStones) =>
        `You make your way to the top of a misty mountain and discover ${numStones} stones with strange markings on them.`,
    caption: 'Select a stone to begin summoning an Elder Spirit'
};
export const StoneSelector = ({ onSelect, selectedStoneId }) => {
    return (
        <ItemSelector
            title={text.title(STONES.length)}
            caption={text.caption}
            items={STONES}
            onSelect={onSelect}
            selectedItemId={selectedStoneId}
        />
    );
};
