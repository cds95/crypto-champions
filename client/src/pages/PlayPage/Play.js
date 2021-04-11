import React from 'react';
import './Play.css';
import { connect } from 'react-redux';
import { PHASES } from '../../constants';
import { MintElderSpirintWorkflow } from '../../components/MintElderSpiritWorkflow/MintElderSpiritWorkflow';
import { MintHeroWorkflow } from '../../components/MintHeroWorkflow';
import { Typography } from '@material-ui/core';

const text = {
    phaseOne: 'Setup',
    phaseTwo: 'Action'
};

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
    return (
        <div className="play">
            <Typography className="page-header play__header" variant="h2">
                {phase === PHASES.SETUP ? text.phaseOne : text.phaseTwo}
            </Typography>
            {content}
        </div>
    );
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
