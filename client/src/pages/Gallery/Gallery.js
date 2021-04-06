import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useGetHeroes } from '../../hooks/cryptoChampionsHook';
import { setHeroesAction, setIsLoadingHeroesAction } from '../../redux/actions';
import './Gallery.css';
import { ItemSelector } from '../../components/ItemSelector';
import { getRaceImage } from '../../images/races';
import { CLASSES, RACES } from '../../constants';
import { getRaceClassLabel } from '../../AppUtils';

const text = {
    title: 'Click on a hero below to challenge them to a duel!'
};

export const GalleryComp = ({ setHeroes, setIsLoadingHeroes }) => {
    const { isLoading, heroes = [] } = useGetHeroes();
    useEffect(() => setHeroes, [heroes]);
    useEffect(() => setIsLoadingHeroes(isLoading), [isLoading]);
    const onSelect = () => {};
    const items = heroes.map((hero) => {
        return {
            ...heroes,
            image: getRaceImage(hero.raceId),
            isSelectable: true,
            label: getRaceClassLabel(hero.raceId, hero.classId),
            subLabel: hero.affinity
        };
    });
    return (
        <div className="gallery">
            <ItemSelector title={text.title} caption={text.caption} items={items} onSelect={onSelect} />
        </div>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        setHeroes: (heroes) => {
            dispatch(setHeroesAction(heroes));
        },
        setIsLoadingHeroes: (isLoadingHeroes) => {
            dispatch(setIsLoadingHeroesAction(isLoadingHeroes));
        }
    };
};

export const Gallery = connect(null, mapDispatchToProps)(GalleryComp);
