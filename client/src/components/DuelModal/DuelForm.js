import React from 'react';
import { getRaceClassLabel } from '../../AppUtils';
import { getRaceImage } from '../../images/races';
import { ItemSelector } from '../ItemSelector';

export const DuelForm = ({ userHeroes, onSelectUserHero, selectedUserHeroId }) => {
    const items = userHeroes.map((hero) => ({
        id: hero.id,
        label: getRaceClassLabel(hero.raceId, hero.classId),
        sublabel: hero.affinity,
        isSelectable: true,
        image: getRaceImage(hero.raceId)
    }));

    return (
        <ItemSelector
            items={items}
            isBlackText={true}
            isMini={true}
            onSelect={onSelectUserHero}
            selectedItemId={selectedUserHeroId}
        />
    );
};
