import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';

export const EmptyState = ({ text }) => {
    return (
        <Card className="empty-state">
            <CardContent>
                <Typography>{text}</Typography>
            </CardContent>
        </Card>
    );
};
