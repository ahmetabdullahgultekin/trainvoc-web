import React from 'react';
import {Box, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';

import SharedButton from '../components/shared/Button';

const CreateRoomPage = () => {
    const {t} = useTranslation();
    return (
        <Box>
            <Typography variant="h4" gutterBottom>{t('createRoom')}</Typography>
            {/* Quiz ayarları ve form buraya gelecek */}
            <Typography color="text.secondary">{t('settings')}</Typography>
            <Box mt={3}>
                <SharedButton variant="primary">{t('submit')}</SharedButton>
            </Box>
        </Box>
    );
};

export default CreateRoomPage;
