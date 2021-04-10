import { FormControl, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import React from 'react';
import { getRaceGif } from '../../images/alternateRaces';
import './MintElderConfirmation.css';

const text = {
    mint: 'Mint Elder',
    selectAffinity: 'Select',
    affinity: 'Affinity',
    race: 'Race',
    classLabel: 'Class',
    affinity: 'Affinity',
    confirm: 'Select an Affinity and confirm your selection'
};

export const MintElderConfirmation = ({ selectedAffinity, race, elderClass, onSelectAffinity, affinities = [] }) => {
    const handleOnSelectAffinity = (e) => onSelectAffinity(e.target.value);
    return (
        <div className="mint-elder-confirmation">
            <Typography className="pronciono--white">{text.confirm}</Typography>
            <div className="mint-elder-confirmation__card-container black-transparent">
                <div className="mint-elder-confirmation__card-image">
                    <img src={getRaceGif(race.id)} />
                </div>
                <div className="mint-elder-confirmation__info">
                    <div>
                        <Typography className="pronciono--white">{`${text.race}: ${race.label}`}</Typography>
                        <Typography className="pronciono--white">{`${text.classLabel}: ${elderClass.label}`}</Typography>
                    </div>
                    <div className="mint-elder-confirmation__affinity">
                        <Typography className="pronciono--white mint-elder-confirmation__affinity-label">
                            {text.affinity}
                        </Typography>
                        <FormControl className="mint-elder-confirmation__form-control">
                            <InputLabel className="mint-elder-confirmation__affinity-selector-label">
                                {text.select}
                            </InputLabel>
                            <Select
                                placeholder={text.selectAffinity}
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
                </div>
            </div>
        </div>
    );
};
