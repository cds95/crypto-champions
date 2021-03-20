import React from 'react';
import './ItemGridTile.css';
import tempImage from '../../test.png';
import clsx from 'clsx';

export const ItemGridTile = ({ item, isSelectable }) => {
    const classNames = clsx('item-grid-tile', {
        'item-grid-tile--selectable': isSelectable
    });
    return (
        <div className={classNames}>
            <img src={tempImage} className="item-grid-tile__image" />
            {item.label}
        </div>
    );
};
