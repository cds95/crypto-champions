import React from 'react';
import clsx from 'clsx';
import './ProgressIndicator.css';
import { Typography } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

export const ProgressIndicator = ({ steps, currentStep, maxSteps }) => {
    return (
        <div className="progress-indicator">
            {steps.map((s, index) => {
                const stepClassName = clsx('progress-indicator__step', {
                    'progress-indicator__step--selected': s.id === currentStep
                });
                return (
                    <div className={stepClassName} key={s.id}>
                        <Typography className="progress-indicator__step-label">{s.label}</Typography>
                        {index + 1 < maxSteps && (
                            <ArrowRightAltIcon fontSize="large" className="progress-indicator__arrow" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
