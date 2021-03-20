import React from 'react';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    title: 'For what people do you seek redemption?',
    caption: 'Select a race'
};

export const RaceSelector = ({ onSelect }) => {
    const races = [
        {
            id: 0,
            label: 'race 1',
            image: '../../test.png'
        },
        {
            id: 1,
            label: 'race 2',
            image: '../../test.png'
        },
        {
            id: 2,
            label: 'race 3',
            image: '../../test.png'
        },
        {
            id: 3,
            label: 'race 3',
            image: '../../test.png'
        },
        {
            id: 4,
            label: 'race 3',
            image: '../../test.png'
        }
    ];

    return <ItemSelector title={text.title} caption={text.caption} items={races} onSelect={onSelect} />;
};
