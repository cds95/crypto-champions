import React from 'react';
import { ItemGridTile } from '../ItemGridTile/ItemGridTile';
import './ItemGrid.css';

const defaultRenderItem = (item, isSelectable) => <ItemGridTile item={item} isSelectable={isSelectable} />;

export const ItemGrid = ({ items = [], onSelect, renderItem = defaultRenderItem }) => {
    return (
        <div className="item-grid">
            {items.map((item) => {
                const handleOnClick = () => onSelect && onSelect(item);
                return (
                    <div className="item-grid__item" key={item.id} onClick={handleOnClick}>
                        {renderItem(item, !!onSelect)}
                    </div>
                );
            })}
        </div>
    );
};
