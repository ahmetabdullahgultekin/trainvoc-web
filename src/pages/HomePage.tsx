import React, {useState} from 'react';
import {Box, Stack, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import SharedButton from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import Loader from '../components/shared/Loader';

const HomePage = () => {
    const {t} = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
        setLoading(true);
        setTimeout(() => setLoading(false), 2000); // 2 sn loader göster
    };

    const handleCloseModal = () => setModalOpen(false);

    return (
        <Box textAlign="center" mt={8}>
            <Typography variant="h3" gutterBottom>TrainVoc</Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
                {t('description')}
            </Typography>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} justifyContent="center" mt={4}>
                <RouterLink to="/create" style={{textDecoration: 'none'}}>
                    <SharedButton variant="primary">{t('createRoom')}</SharedButton>
                </RouterLink>
                <RouterLink to="/join" style={{textDecoration: 'none'}}>
                    <SharedButton variant="secondary">{t('joinRoom')}</SharedButton>
                </RouterLink>
                <SharedButton variant="primary" onClick={handleOpenModal}>Modal/Loader Demo</SharedButton>
            </Stack>
            <Modal open={modalOpen} onClose={handleCloseModal}>
                {loading ? <Loader/> : <Typography>{t('welcome')}</Typography>}
            </Modal>
        </Box>
    );
};

export default HomePage;
