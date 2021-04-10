import React from 'react';
import { CLASSES } from '../../constants';
import { getClassImage } from '../../images/classes';
import { ItemSelector } from '../ItemSelector/ItemSelector';

const text = {
    title: 'There is more than one path to victory',
    caption: 'Select a class'
};

export const ClassSelector = ({ onSelect, selectedClassId, mintedClasses }) => {
    const items = CLASSES.map((classItem) => ({
        ...classItem,
        isSelectable: true,
        image: getClassImage(classItem.id)
    })).filter((item) => mintedClasses.indexOf(item.id) === -1);
    return (
        <ItemSelector
            title={text.title}
            caption={text.caption}
            items={items}
            onSelect={onSelect}
            selectedItemId={selectedClassId}
            hasWhiteTiles={true}
        />
    );
};
