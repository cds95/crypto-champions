import React from 'react';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    title: 'There is more than one path to victory',
    caption: 'Select a class'
};

export const ClassSelector = ({ onSelect }) => {
    const classes = [
        {
            id: 0,
            label: 'class 1',
            image: '../../test.png'
        },
        {
            id: 1,
            label: 'class 2',
            image: '../../test.png'
        },
        {
            id: 2,
            label: 'class 3',
            image: '../../test.png'
        },
        {
            id: 3,
            label: 'class 3',
            image: '../../test.png'
        },
        {
            id: 4,
            label: 'class 3',
            image: '../../test.png'
        }
    ];

    return <ItemSelector title={text.title} caption={text.caption} items={classes} onSelect={onSelect} />;
};
