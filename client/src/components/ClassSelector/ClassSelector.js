import React from 'react';
import { CLASSES } from '../../constants';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    title: 'There is more than one path to victory',
    caption: 'Select a class'
};

export const ClassSelector = ({ onSelect }) => {
    return <ItemSelector title={text.title} caption={text.caption} items={CLASSES} onSelect={onSelect} />;
};
