import React, { useEffect } from 'react';
import './Play.css';
import { connect } from 'react-redux';
import { useGetPhase } from '../../hooks/cryptoChampionsHook';
import { setPhaseAction } from '../../redux/actions';
import { PHASES } from '../../constants';
import { MintElderSpirintWorkflow } from '../../components/MintElderSpiritWorkflow/MintElderSpiritWorkflow';

export const PlayComp = ({ setPhase }) => {
    const { isLoading, phase } = useGetPhase();
    useEffect(() => {
        setPhase(phase);
    }, [phase]);
    if (isLoading) {
        return <div>Loading...</div>;
    }
    let content;
    switch (phase) {
        case PHASES.ONE:
            content = <MintElderSpirintWorkflow />;
            break;
        default:
            console.warn(`Invalid phase ${phase}`);
            return <></>;
    }
    return <div className="play">{content}</div>;
};

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPhase: (phase) => {
            dispatch(setPhaseAction(phase));
        }
    };
};

export const Play = connect(mapStateToProps, mapDispatchToProps)(PlayComp);
