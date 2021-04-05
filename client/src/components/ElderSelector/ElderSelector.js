import React from 'react';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    title: '2nd Cycle Gathering of Champions',
    caption: 'Select an Elder Spirit to train with.  You will inherit some properties from that Elder Spirit.'
};
export const ElderSelector = ({ onSelect, items, selectedElderId }) => {
    return (
        <ItemSelector
            title={text.title}
            caption={text.caption}
            items={items}
            onSelect={onSelect}
            selectedItemId={selectedElderId}
        />
    );
};
