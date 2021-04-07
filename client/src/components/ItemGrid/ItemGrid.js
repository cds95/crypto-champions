import React from 'react';
import { ItemGridTile } from '../ItemGridTile/ItemGridTile';
import './ItemGrid.css';
import clsx from 'clsx';

const defaultRenderItem = (item, isSelectable, isBlackText) => (
    <ItemGridTile
        itemImage={item.image}
        itemLabel={item.label}
        isSelectable={isSelectable}
        isSelected={item.isSelected}
        itemSublabel={item.subLabel}
        isBlackText={isBlackText}
    />
);

export const ItemGrid = ({ items = [], onSelect, renderItem = defaultRenderItem, isMini, isBlackText }) => {
    const className = clsx('item-grid', {
        'item-grid--mini': isMini
    });
    return (
        <div className={className}>
            {items.map((item) => {
                const handleOnClick = () => item.isSelectable && onSelect && onSelect(item);
                return (
                    <div className="item-grid__item" key={item.id} onClick={handleOnClick}>
                        {renderItem(item, !!onSelect && item.isSelectable, isBlackText)}
                    </div>
                );
            })}
        </div>
    );
};
