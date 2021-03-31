import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { AFFINITIES } from '../../constants';
import { getRaceImage } from '../../images/races';
import { ItemGridTile } from '../ItemGridTile/ItemGridTile';
import './MintElderConfirmation.css';

const text = {
    mint: 'Mint Elder Spirit',
    selectAffinity: 'Select an Affinity and confirm your selection',
    affinitySelectorPlaceholer: 'Affinity'
};

export const MintElderConfirmation = ({
    selectedAffinity,
    race,
    elderClass,
    onConfirm,
    onSelectAffinity,
    affinities = []
}) => {
    const handleOnSelectAffinity = (e) => onSelectAffinity(e.target.value);
    return (
        <div className="mint-elder-confirmation">
            <div className="mint-elder-confirmation__selections">
                <div className="mint-elder-confirmation__selections-item">
                    <ItemGridTile itemLabel={race.label} itemImage={getRaceImage(race.id)} />
                </div>
                <div className="mint-elder-confirmation__selections-item">
                    <ItemGridTile itemLabel={elderClass.label} />
                </div>
            </div>
            <div className="mint-elder-confirmation__affinity-selector-container">
                <Typography variant="h5" className="mint-elder-confirmation__select-affinity">
                    {text.selectAffinity}
                </Typography>
                <FormControl className="mint-elder-confirmation__form-control">
                    <InputLabel className="mint-elder-confirmation__affinity-selector-label">
                        {text.affinitySelectorPlaceholer}
                    </InputLabel>
                    <Select
                        placeholder={text.affinitySelectorPlaceholer}
                        onChange={handleOnSelectAffinity}
                        value={selectedAffinity}
                        className="mint-elder-confirmation__affinity-selector"
                    >
                        {affinities.map((affinity) => (
                            <MenuItem
                                key={affinity}
                                value={affinity}
                                className="mint-elder-confirmation__affinity-item"
                            >
                                {affinity}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div className="mint-elder-confirmation__confirmation-container">
                <Button onClick={onConfirm} variant="contained" color="primary">
                    {text.mint}
                </Button>
            </div>
        </div>
    );
};
