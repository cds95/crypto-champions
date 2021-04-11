import React from 'react';
import { Typography } from '@material-ui/core';
import { ItemGrid } from '../ItemGrid';
import './ItemSelector.css';

export const ItemSelector = ({
    items = [],
    title,
    caption,
    subCaption,
    onSelect,
    selectedItemId,
    isBlackText,
    isMini,
    renderItem,
    hasWhiteTiles,
    isCentered,
    captions,
    numPerRow = 4
}) => {
    items = items.map((item) => {
        if (selectedItemId !== null && selectedItemId !== undefined && item.id === selectedItemId) {
            item.isSelected = true;
        }
        return item;
    });
    return (
        <div className="item-selector">
            {title && (
                <Typography variant="h5" className="item-selector__title">
                    {title}
                </Typography>
            )}
            {caption && (
                <Typography variant="h6" className="item-selector__caption">
                    {caption}
                </Typography>
            )}
            {captions && (
                <div className="item-selector__captions">
                    {captions.map((captionText) => (
                        <p className="item-selector__caption-paragraph pronciono">{captionText}</p>
                    ))}
                </div>
            )}
            <div className="item-selector__items">
                <ItemGrid
                    numPerRow={numPerRow}
                    isCentered={isCentered}
                    isBlackText={isBlackText}
                    items={items}
                    onSelect={onSelect}
                    isMini={isMini}
                    renderItem={renderItem}
                    hasWhiteTiles={hasWhiteTiles}
                />
            </div>
            {subCaption && (
                <Typography variant="h6" className="item-selector__sub__caption">
                    {subCaption}
                </Typography>
            )}
        </div>
    );
};
