import { Button, MenuItem, Select, Typography } from '@material-ui/core';
import React from 'react';
import { AFFINITIES } from '../../constants';
import { ItemGridTile } from '../ItemGridTile/ItemGridTile';
import './MintElderConfirmation.css';

const text = {
    mint: 'Mint Elder Spirit',
    selectAffinity: 'Select an Affinity and confirm your selection'
};

export const MintElderConfirmation = ({ selectedAffinity, race, elderClass, onConfirm, onSelectAffinity }) => {
    const handleOnSelectAffinity = (e) => onSelectAffinity(e.target.value);
    return (
        <div className="mint-elder-confirmation">
            <div className="mint-elder-confirmation__selections">
                <div className="mint-elder-confirmation__selections-item">
                    <ItemGridTile itemLabel={race.label} />
                </div>
                <div className="mint-elder-confirmation__selections-item">
                    <ItemGridTile itemLabel={elderClass.label} />
                </div>
            </div>
            <div className="mint-elder-confirmation__affinity-selector-container">
                <Typography variant="h5">{text.selectAffinity}</Typography>
                <Select onChange={handleOnSelectAffinity} value={selectedAffinity}>
                    {AFFINITIES.map((affinity) => (
                        <MenuItem key={affinity} value={affinity}>
                            {affinity}
                        </MenuItem>
                    ))}
                </Select>
            </div>
            <div className="mint-elder-confirmation__confirmation-container">
                <Button onClick={onConfirm} variant="contained" color="primary">
                    {text.mint}
                </Button>
            </div>
        </div>
    );
};
