import React from 'react';
import { HeroCard } from '../HeroCard';
import { ItemSelector } from '../ItemSelector';

export const DuelForm = ({ userHeroes, onSelectUserHero, selectedUserHeroId }) => {
    return (
        <ItemSelector
            isCentered={false}
            items={userHeroes}
            isBlackText={true}
            isMini={true}
            selectedItemId={selectedUserHeroId}
            renderItem={(hero) => (
                <HeroCard
                    isSelected={selectedUserHeroId == hero.id}
                    hero={hero}
                    isVertical={true}
                    isSelectable={true}
                    onSelect={onSelectUserHero}
                />
            )}
        />
    );
};
