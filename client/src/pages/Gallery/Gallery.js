import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useGetWeatherDuels } from '../../hooks/cryptoChampionsHook';
import { setDuelOpponentHeroAction, setWeatherDuelsAction } from '../../redux/actions';
import './Gallery.css';
import { ItemSelector } from '../../components/ItemSelector';
import { getRaceImage } from '../../images/races';
import { getRaceClassLabel } from '../../AppUtils';
import { getHerosUserCanChallenge, getOpenUserDuels, getPastUserDuels } from '../../redux/selectors';
import { DuelModal } from '../../components/DuelModal/DuelModal';
import { Tab, Tabs } from '@material-ui/core';
import { WeatherDuels } from '../../components/WeatherDuels/WeatherDuels';
import { HeroCard } from '../../components/HeroCard';

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
    heroesUserCanChallenge,
    setDuelOpponentHero,
    setWeatherDuels,
    openUserDuels,
    closedUserDuels
}) => {
    const { isLoading: isLoadingDuels, weatherDuels } = useGetWeatherDuels();
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
    const changeTabs = (_, newTab) => {
        setCurrentTab(newTab);
    };
    const items = heroesUserCanChallenge.map((hero) => {
        return {
            ...hero,
            image: getRaceImage(hero.raceId, hero.appearance),
            isSelectable: true,
            label: hero.heroName,
            subLabel: getRaceClassLabel(hero.raceId, hero.classId) + ` - ${hero.affinity}`
        };
    });
    let content;
    switch (currentTab) {
        case galleryTabs.CHALLENGE:
            content = (
                <React.Fragment>
                    <ItemSelector
                        renderItem={(hero) => <HeroCard isVertical={true} hero={hero} isSelectable={true} />}
                        title={text.title}
                        caption={text.caption}
                        items={items}
                        onSelect={onSelect}
                    />
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
        heroesUserCanChallenge: getHerosUserCanChallenge(state),
        openUserDuels: getOpenUserDuels(state),
        closedUserDuels: getPastUserDuels(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setDuelOpponentHero: (heroId, opponentAddress) => {
            dispatch(setDuelOpponentHeroAction(heroId, opponentAddress));
        },
        setWeatherDuels: (duels) => {
            dispatch(setWeatherDuelsAction(duels));
        }
    };
};

export const Gallery = connect(mapStateToProps, mapDispatchToProps)(GalleryComp);
