import React from 'react';
import './ItemGridTile.css';
import tempImage from '../../test.png';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';

export const ItemGridTile = ({ itemLabel, itemImage, isSelectable, isSelected }) => {
    const classNames = clsx('item-grid-tile', {
        'item-grid-tile--selectable': isSelectable,
        'item-grid-tile--selected': isSelected
    });
    return (
        <div className={classNames}>
            <img src={tempImage} className="item-grid-tile__image" />
            <Typography variant="body1">{itemLabel}</Typography>
        </div>
    );
};
