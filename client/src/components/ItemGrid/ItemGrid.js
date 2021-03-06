import React from 'react';
import { ItemGridTile } from '../ItemGridTile/ItemGridTile';
import './ItemGrid.css';
import clsx from 'clsx';

const defaultRenderItem = (item, isSelectable, isBlackText, hasWhiteTiles) => (
    <ItemGridTile
        itemImage={item.image}
        itemLabel={item.label}
        isSelectable={isSelectable}
        isSelected={item.isSelected}
        itemSublabel={item.subLabel}
        isBlackText={isBlackText}
        isWhiteTile={hasWhiteTiles}
        actionButton={item.actionButton}
        imageWidth={item.imageWidth || '100%'}
        isUnavailable={item.isUnavailable}
        sublabelImage={item.sublabelImage}
        imageWidth={item.imageWidth}
        sublabelTwo={item.sublabelTwo}
    />
);

export const ItemGrid = ({
    items = [],
    onSelect,
    renderItem = defaultRenderItem,
    isMini,
    isBlackText,
    hasWhiteTiles,
    isCentered = true,
    numPerRow = 4
}) => {
    const className = clsx('item-grid', {
        'item-grid--mini': isMini,
        'item-grid--centered': isCentered,
        'item-grid--three': numPerRow === 3,
        'item-grid--five': numPerRow == 5
    });
    return (
        <div className={className}>
            {items.map((item) => {
                const handleOnClick = () => item.isSelectable && onSelect && onSelect(item);
                return (
                    <div className="item-grid__item" key={item.id} onClick={handleOnClick}>
                        {renderItem(item, !!onSelect && item.isSelectable, isBlackText, hasWhiteTiles)}
                    </div>
                );
            })}
        </div>
    );
};
