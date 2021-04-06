import React from 'react';
import './ItemGridTile.css';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';
import emptySpace from '../../images/not-summoned.png';

export const ItemGridTile = ({ itemLabel, itemImage, isSelectable, isSelected, itemSublabel, isBlackText }) => {
    const classNames = clsx('item-grid-tile', {
        'item-grid-tile--selectable': isSelectable,
        'item-grid-tile--selected': isSelected,
        'item-grid-tile--black-text': isBlackText
    });
    return (
        <div className={classNames}>
            <img src={itemImage || emptySpace} className="item-grid-tile__image" />
            <Typography variant="body1" className="item-grid-tile__label">
                {itemLabel}
            </Typography>
            {itemSublabel && (
                <Typography variant="body1" className="item-grid-tile__label">
                    {itemSublabel}
                </Typography>
            )}
        </div>
    );
};
