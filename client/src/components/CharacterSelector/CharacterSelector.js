import React from 'react';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    title:
        'After an arduous trek, you reach the top of the Elder Mountain.  The journey was worth it and your persistence is about to pay off.  With whom do you seek to train?',
    caption: 'Select an Elder Spirit to train with.  You will inherit some properties from that Elder Spirit.'
};
export const CharacterSelector = ({ onSelect, items }) => {
    return <ItemSelector title={text.title} caption={text.caption} items={items} onSelect={onSelect} />;
};
