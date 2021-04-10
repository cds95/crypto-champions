import React from 'react';
import './Play.css';
import { connect } from 'react-redux';
import { PHASES } from '../../constants';
import { MintElderSpirintWorkflow } from '../../components/MintElderSpiritWorkflow/MintElderSpiritWorkflow';
import { MintHeroWorkflow } from '../../components/MintHeroWorkflow';

export const PlayComp = ({ phase }) => {
    let content;
    switch (phase) {
        case PHASES.SETUP:
            content = <MintElderSpirintWorkflow />;
            break;
        case PHASES.ACTION:
            content = <MintHeroWorkflow />;
            break;
        default:
            console.warn(`Invalid phase ${phase}`);
            return <></>;
    }
    return <div className="play">{content}</div>;
};

const mapStateToProps = (state) => {
    const {
        cryptoChampions: { phase }
    } = state;
    return {
        phase
    };
};

export const Play = connect(mapStateToProps)(PlayComp);
