import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useGetHeroes } from '../../hooks/cryptoChampionsHook';
import { setDuelOpponentHeroAction, setHeroesAction, setIsLoadingHeroesAction } from '../../redux/actions';
import './Gallery.css';
import { ItemSelector } from '../../components/ItemSelector';
import { getRaceImage } from '../../images/races';
import { CLASSES, RACES } from '../../constants';
import { getRaceClassLabel } from '../../AppUtils';
import { getNonUserOwnedHeros } from '../../redux/selectors';
import { DuelModal } from '../../components/DuelModal/DuelModal';

const text = {
    title: 'Click on a hero below to challenge them to a duel!'
};

export const GalleryComp = ({ setHeroes, setIsLoadingHeroes, nonUserHeroes, setDuelOpponentHero }) => {
    const { isLoading: isLoadingHeroes, heroes = [] } = useGetHeroes();
    useEffect(() => {
        setIsLoadingHeroes(isLoadingHeroes);
        setHeroes(heroes);
    }, [isLoadingHeroes]);
    const onSelect = (hero) => {
        setDuelOpponentHero(hero.id);
        setIsDuelModalOpen(true);
    };
    const [isDuelModalOpen, setIsDuelModalOpen] = useState(false);
    const handleOnClose = () => setIsDuelModalOpen(false);
    const items = nonUserHeroes.map((hero) => {
        return {
            ...hero,
            image: getRaceImage(hero.raceId),
            isSelectable: true,
            label: getRaceClassLabel(hero.raceId, hero.classId),
            subLabel: hero.affinity
        };
    });
    return (
        <div className="gallery">
            <ItemSelector title={text.title} caption={text.caption} items={items} onSelect={onSelect} />
            <DuelModal isOpen={isDuelModalOpen} onClose={handleOnClose} />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        nonUserHeroes: getNonUserOwnedHeros(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setHeroes: (heroes) => {
            dispatch(setHeroesAction(heroes));
        },
        setIsLoadingHeroes: (isLoadingHeroes) => {
            dispatch(setIsLoadingHeroesAction(isLoadingHeroes));
        },
        setDuelOpponentHero: (heroId) => {
            dispatch(setDuelOpponentHeroAction(heroId));
        }
    };
};

export const Gallery = connect(mapStateToProps, mapDispatchToProps)(GalleryComp);
