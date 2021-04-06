import { TextField } from '@material-ui/core';
import React from 'react';
import { getRaceClassLabel } from '../../AppUtils';
import { getRaceImage } from '../../images/races';
import { ItemGridTile } from '../ItemGridTile/ItemGridTile';

const text = {
    betField: 'Amount to bet in CC'
};

export const DuelModalConfirmStep = ({ opponentHero, bet, onBetChange }) => {
    if (!opponentHero) {
        return <></>;
    }
    const itemImage = getRaceImage(opponentHero.raceId);
    const itemLabel = getRaceClassLabel(opponentHero.raceId, opponentHero.classId);
    const itemSublabel = opponentHero.affinity;
    return (
        <div className="duel-modal-confirm-step">
            <ItemGridTile itemImage={itemImage} itemSublabel={itemSublabel} itemLabel={itemLabel} isBlackText={true} />
            <TextField
                className="duel-modal-confirm__bet"
                label={text.betField}
                value={bet}
                onChange={onBetChange}
                type="number"
            />
        </div>
    );
};
