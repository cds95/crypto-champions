import React from 'react';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    title: 'There is more than one path to victory',
    caption: 'Select a class'
};

const CLASSES = [
    {
        id: 0,
        label: 'class 1'
    },
    {
        id: 1,
        label: 'class 2'
    },
    {
        id: 2,
        label: 'class 3'
    },
    {
        id: 3,
        label: 'class 4'
    },
    {
        id: 4,
        label: 'class 5'
    }
];

export const ClassSelector = ({ onSelect, selectedClassId }) => {
    const items = CLASSES.map((classItem) => ({
        ...classItem,
        isSelectable: true
    }));
    return (
        <ItemSelector
            title={text.title}
            caption={text.caption}
            items={items}
            onSelect={onSelect}
            selectedItemId={selectedClassId}
        />
    );
};
