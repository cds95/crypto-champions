import React from 'react';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    mintChampion:
        'Champions can be minted during the Action Phase.  Select an Elder Spirit with whom you would like to train your Champion.  You will inherit that Elder’s Race, Class, and Affinity. The rest of your Champion’s attributes will be randomly generated.'
};
export const ElderSelector = ({ items, selectedElderId, action }) => {
    return (
        <ItemSelector
            items={items}
            selectedItemId={selectedElderId}
            captions={[text.mintChampion]}
            numPerRow={5}
            action={action}
        />
    );
};
