import React, {useEffect, useState} from 'react';
import {Alert, Box, List, ListItem, ListItemText, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import axios from 'axios';

import SharedButton from '../components/shared/Button';
import type {GameRoom, Player} from '../interfaces/game';

const RoomDetailPage = () => {
    const {t} = useTranslation();
    const {roomCode} = useParams();
    const [room, setRoom] = useState<GameRoom | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!roomCode) return;
        setLoading(true);
        setError('');
        setRoom(null);
        axios.get(`/api/game/${roomCode}`)
            .then(res => setRoom(res.data))
            .catch(() => setError(t('error')))
            .finally(() => setLoading(false));
    }, [roomCode, t]);

    return (
        <Box maxWidth={500} mx="auto" mt={6}>
            <Typography variant="h4" gutterBottom>{t('roomDetails')}</Typography>
            {loading && <Typography>{t('loading')}</Typography>}
            {error && <Alert severity="error">{error}</Alert>}
            {room && (
                <>
                    <Typography>{t('roomCode')}: <b>{room.roomCode}</b></Typography>
                    <Typography>{t('settings')}:</Typography>
                    <ul>
                        <li>{t('questionCount') || 'Soru Sayısı'}: {room.totalQuestionCount}</li>
                        <li>{t('timePerQuestion') || 'Soru Süresi'}: {room.questionDuration}</li>
                    </ul>
                    <Typography mt={2}>{t('players') || 'Oyuncular'}:</Typography>
                    <List>
                        {room.players?.map((p: Player) => (
                            <ListItem key={p.id || p.name}>
                                <ListItemText primary={p.name}/>
                            </ListItem>
                        ))}
                    </List>
                    <Box mt={3}>
                        <SharedButton variant="primary">{t('submit')}</SharedButton>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default RoomDetailPage;
