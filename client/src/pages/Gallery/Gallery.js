import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useGetHeroes, useGetWeatherDuels } from '../../hooks/cryptoChampionsHook';
import {
    setDuelOpponentHeroAction,
    setHeroesAction,
    setIsLoadingHeroesAction,
    setWeatherDuelsAction
} from '../../redux/actions';
import './Gallery.css';
import { ItemSelector } from '../../components/ItemSelector';
import { getRaceImage } from '../../images/races';
import { getRaceClassLabel } from '../../AppUtils';
import { getNonUserOwnedHeros, getOpenUserDuels, getPastUserDuels } from '../../redux/selectors';
import { DuelModal } from '../../components/DuelModal/DuelModal';
import { Tab, Tabs } from '@material-ui/core';
import { WeatherDuels } from '../../components/WeatherDuels/WeatherDuels';

const text = {
    title: 'Click on a hero below to challenge them to a duel!',
    challengeTab: 'Challenge',
    openDuels: 'Open Duels',
    pastDuels: 'Past Duels'
};

const galleryTabs = {
    CHALLENGE: 0,
    FINISHED_DUELS: 1,
    OPEN_DUELS: 2
};

export const GalleryComp = ({
    setHeroes,
    setIsLoadingHeroes,
    nonUserHeroes,
    setDuelOpponentHero,
    setWeatherDuels,
    openUserDuels,
    closedUserDuels
}) => {
    const { isLoading: isLoadingHeroes, heroes = [] } = useGetHeroes();
    const { isLoading: isLoadingDuels, weatherDuels } = useGetWeatherDuels();
    useEffect(() => {
        setIsLoadingHeroes(isLoadingHeroes);
        setHeroes(heroes);
    }, [isLoadingHeroes]);
    useEffect(() => {
        setWeatherDuels(weatherDuels);
    }, [isLoadingDuels]);
    const onSelect = (hero) => {
        setDuelOpponentHero(hero.id, hero.owner);
        setIsDuelModalOpen(true);
    };
    const [isDuelModalOpen, setIsDuelModalOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState(galleryTabs.CHALLENGE);
    const handleOnClose = () => setIsDuelModalOpen(false);
    const changeTabs = (event, newTab) => {
        setCurrentTab(newTab);
    };
    const items = nonUserHeroes.map((hero) => {
        return {
            ...hero,
            image: getRaceImage(hero.raceId),
            isSelectable: true,
            label: getRaceClassLabel(hero.raceId, hero.classId),
            subLabel: hero.affinity
        };
    });
    let content;
    switch (currentTab) {
        case galleryTabs.CHALLENGE:
            content = (
                <React.Fragment>
                    <ItemSelector title={text.title} caption={text.caption} items={items} onSelect={onSelect} />
                    <DuelModal isOpen={isDuelModalOpen} onClose={handleOnClose} />
                </React.Fragment>
            );
            break;
        case galleryTabs.OPEN_DUELS:
            content = <WeatherDuels duels={openUserDuels} />;
            break;
        case galleryTabs.FINISHED_DUELS:
            content = <WeatherDuels duels={closedUserDuels} />;
            break;
        default:
            break;
    }
    return (
        <div className="gallery">
            <Tabs className="gallery__tabs" value={currentTab} onChange={changeTabs}>
                <Tab className="gallery__tab-item" label={text.challengeTab} value={galleryTabs.CHALLENGE} />
                <Tab className="gallery__tab-item" label={text.openDuels} value={galleryTabs.OPEN_DUELS} />
                <Tab className="gallery__tab-item" label={text.pastDuels} value={galleryTabs.FINISHED_DUELS} />
            </Tabs>
            <div className="gallery-content">{content}</div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        nonUserHeroes: getNonUserOwnedHeros(state),
        openUserDuels: getOpenUserDuels(state),
        closedUserDuels: getPastUserDuels(state)
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
        setDuelOpponentHero: (heroId, opponentAddress) => {
            dispatch(setDuelOpponentHeroAction(heroId, opponentAddress));
        },
        setWeatherDuels: (duels) => {
            dispatch(setWeatherDuelsAction(duels));
        }
    };
};

export const Gallery = connect(mapStateToProps, mapDispatchToProps)(GalleryComp);
