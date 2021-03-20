import React from 'react';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    title: (numStones) =>
        `You make your way to the top of a misty mountain and discover ${numStones} stones with strange markings on them.`,
    caption: 'Select a stone to begin summoning an Elder Spirit'
};
export const StoneSelector = ({ onSelect }) => {
    const stones = [
        {
            id: 0,
            label: 'stone 1',
            image: '../../test.png'
        },
        {
            id: 1,
            label: 'stone 2',
            image: '../../test.png'
        },
        {
            id: 2,
            label: 'stone 3',
            image: '../../test.png'
        },
        {
            id: 3,
            label: 'stone 3',
            image: '../../test.png'
        },
        {
            id: 4,
            label: 'stone 3',
            image: '../../test.png'
        }
    ];

    return <ItemSelector title={text.title(stones.length)} caption={text.caption} items={stones} onSelect={onSelect} />;
};
