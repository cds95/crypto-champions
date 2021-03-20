import React from 'react';
import { connect } from 'react-redux';
import { setMaxElderSpiritsAction } from '../../redux/actions';
import { Button } from '@material-ui/core';
import './LandingPage.css';
import landingPageImg from '../../test.png'; // Temp for now.  Move this to S3 or something later.
import { Link } from 'react-router-dom';
import { routeDefinitions } from '../../routeDefinitions';

export const LandingPageComp = () => {
    return (
        <div className="landing-page">
            <div className="landing-page__content">
                <div className="landing-page__header">
                    <img src={landingPageImg} className="landing-page__img"></img>
                    <div className="landing-page__caption">sdfsdfs</div>
                </div>
                <Link
                    to={routeDefinitions.CREATION_WORKFLOW}
                    component={(props) => (
                        <Button className="landing-page__get-started" variant="contained" color="primary" {...props}>
                            Get Started
                        </Button>
                    )}
                />
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        setMaxElderSpirits: (maxElderSpirits) => {
            dispatch(setMaxElderSpiritsAction(maxElderSpirits));
        }
    };
};

export const LandingPage = connect(mapStateToProps, mapDispatchToProps)(LandingPageComp);
