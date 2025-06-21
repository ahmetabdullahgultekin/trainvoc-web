import React from 'react';
import {Box, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';

import SharedButton from '../components/shared/Button';

const JoinRoomPage = () => {
    const {t} = useTranslation();
    return (
        <Box>
            <Typography variant="h4" gutterBottom>{t('joinRoom')}</Typography>
            {/* Odaya katılma formu buraya gelecek */}
            <Typography color="text.secondary">{t('roomCode')}</Typography>
            <Box mt={3}>
                <SharedButton variant="primary">{t('submit')}</SharedButton>
            </Box>
        </Box>
    );
};

export default JoinRoomPage;
