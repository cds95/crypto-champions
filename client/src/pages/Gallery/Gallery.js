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
import { PHASES } from '../../constants';
import { TokenBalance } from '../../components/TokenBalance';
import { HorizontalHeroCard } from '../../components/HorizontalHeroCard/HorizontalHeroCard';
import { CryptoChampionButton } from '../../components/CryptoChampionButton';
import { DuelWorkflow } from '../../components/DuelWorkflow/DuelWorkflow';

const text = {
    title: 'Click on a hero below to challenge them to a duel!',
    challengeTab: 'Challenge',
    openDuels: 'Open Duels',
    pastDuels: 'Past Duels',
    noDuels: 'Duels can only be fought during the action phase.',
    challenge: 'Challenge'
};

const galleryTabs = {
    CHALLENGE: 0,
    FINISHED_DUELS: 1,
    OPEN_DUELS: 2
};

export const GalleryComp = ({ setDuelOpponentHero, setWeatherDuels, openUserDuels, closedUserDuels, currentPhase }) => {
    const { isLoading: isLoadingDuels, weatherDuels } = useGetWeatherDuels();
    useEffect(() => {
        setWeatherDuels(weatherDuels);
    }, [isLoadingDuels]);
    const [currentTab, setCurrentTab] = useState(galleryTabs.CHALLENGE);
    const changeTabs = (_, newTab) => {
        setCurrentTab(newTab);
    };

    let content;
    switch (currentTab) {
        case galleryTabs.CHALLENGE:
            content =
                currentPhase == PHASES.SETUP ? (
                    <div className="gallery__no-duels">{text.noDuels}</div>
                ) : (
                    <DuelWorkflow />
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
            <TokenBalance className="gallery__token-balance" />
            <div className="gallery-content">{content}</div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        openUserDuels: getOpenUserDuels(state),
        closedUserDuels: getPastUserDuels(state),
        currentPhase: state.cryptoChampions.phase
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setWeatherDuels: (duels) => {
            dispatch(setWeatherDuelsAction(duels));
        }
    };
};

export const Gallery = connect(mapStateToProps, mapDispatchToProps)(GalleryComp);
