import React from 'react';
import { getRaceClassLabel } from '../../AppUtils';
import { getRaceGif } from '../../images/alternateRaces/';
import { ItemSelector } from '../ItemSelector/ItemSelector';
import { CryptoChampionButton } from '../CryptoChampionButton';
import { getCoinLogo } from '../../images/cryptoIcons';
import { RefreshPhaseButton } from '../RefreshPhaseButton';
import { PHASES } from '../../constants';

const text = {
    summon: 'Summon'
};

export const StoneSelector = ({ onSelect, selectedStoneId, elderSpirits, maxElderSpirits, captions }) => {
    const items = elderSpirits.map((spirit) => ({
        id: spirit.id,
        label: getRaceClassLabel(spirit.raceId, spirit.classId),
        image: getRaceGif(spirit.raceId),
        sublabelImage: getCoinLogo(spirit.affinity)
    }));
    const availableElderSpots = maxElderSpirits - items.length;
    for (let i = 0; i < availableElderSpots; i++) {
        items.push({
            imageWidth: '65%',
            id: items.length + i + 1,
            label: '',
            actionButton: <CryptoChampionButton onClick={onSelect} label={text.summon} />
        });
    }
    return (
        <ItemSelector
            numPerRow={5}
            items={items}
            onSelect={onSelect}
            selectedItemId={selectedStoneId}
            captions={captions}
            action={availableElderSpots === 0 && <RefreshPhaseButton currentPhase={PHASES.SETUP} />}
        />
    );
};
