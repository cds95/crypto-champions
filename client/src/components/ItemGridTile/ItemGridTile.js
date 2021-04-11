import React from 'react';
import './ItemGridTile.css';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';
import { getImage, imageNames } from '../../images';

export const ItemGridTile = ({
    itemLabel,
    itemImage,
    isSelectable,
    isSelected,
    itemSublabel,
    sublabelImage,
    isBlackText,
    decorator,
    isWhiteTile,
    actionButton,
    imageWidth,
    isUnavailable
}) => {
    const classNames = clsx('item-grid-tile', 'black-transparent', {
        'item-grid-tile--selectable': isSelectable,
        'item-grid-tile--selected': isSelected,
        'item-grid-tile--black-text': isBlackText,
        'item-grid-tile--white': isWhiteTile,
        'item-grid-tile--no-image': !itemImage
    });
    return (
        <div className={classNames}>
            {decorator && <div className="item-grid-tile__decorator">{decorator}</div>}
            <div className="item-grid-tile__image-container">
                {isUnavailable && (
                    <img src={getImage(imageNames.UNAVAILABLE)} className="item-grid-tile__unavailable" />
                )}
                <img
                    width={imageWidth}
                    src={itemImage || getImage(imageNames.FIRE)}
                    className="item-grid-tile__image"
                />
            </div>

            {itemSublabel && (
                <Typography variant="body1" className="item-grid-tile__label item-grid-tile__sub-label">
                    {itemSublabel}
                </Typography>
            )}
            {sublabelImage && (
                <div className="item-grid-tile__sub-label item-grid-tile__sub-label-image">
                    <img src={sublabelImage} />
                </div>
            )}
            {itemLabel && (
                <Typography variant="body1" className="item-grid-tile__label">
                    {itemLabel}
                </Typography>
            )}
            {actionButton && <div className="item-grid-tile__action">{actionButton}</div>}
        </div>
    );
};
