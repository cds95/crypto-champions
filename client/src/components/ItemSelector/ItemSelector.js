import React from 'react';
import { Typography } from '@material-ui/core';
import { ItemGrid } from '../ItemGrid';
import './ItemSelector.css';

export const ItemSelector = ({ items = [], title, caption, subCaption, onSelect, selectedItemId }) => {
    items = items.map((item) => {
        if (selectedItemId && item.id === selectedItemId) {
            item.isSelected = true;
        }
        return item;
    });
    return (
        <div className="item-selector">
            <Typography variant="h5" className="item-selector__title">
                {title}
            </Typography>
            <Typography variant="h6" className="item-selector__caption">
                {caption}
            </Typography>
            <div className="item-selector__items">
                <ItemGrid items={items} onSelect={onSelect} />
            </div>
            {subCaption && (
                <Typography variant="h6" className="item-selector__sub__caption">
                    {subCaption}
                </Typography>
            )}
        </div>
    );
};
