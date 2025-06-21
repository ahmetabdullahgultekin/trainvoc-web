import React, {useEffect, useState} from 'react';
import {Alert, Box, Divider, Fade, Paper, TextField, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import {useTranslation} from 'react-i18next';
import SharedButton from '../components/shared/Button';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import RoomCard from '../components/shared/RoomCard';
import type {GameRoom} from '../interfaces/game';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const CreateRoomPage = () => {
    const {t} = useTranslation();
    const [hostName, setHostName] = useState('');
    const [room, setRoom] = useState<GameRoom | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rooms, setRooms] = useState<GameRoom[]>([]);
    const [roomsLoading, setRoomsLoading] = useState(true);
    const [joiningRoom, setJoiningRoom] = useState<string | null>(null);
    const navigate = useNavigate();

    // Quiz ayarları örnek (geliştirilebilir):
    const [settings, setSettings] = useState({
        questionCount: 10,
        timePerQuestion: 20
    });

    useEffect(() => {
        setRoomsLoading(true);
        axios.get('/api/game/rooms')
            .then(res => setRooms(res.data))
            .catch(() => setRooms([]))
            .finally(() => setRoomsLoading(false));
    }, [room]); // room değişince tekrar listele

    const handleCreate = async () => {
        setLoading(true);
        setError('');
        setRoom(null);
        try {
            const res = await axios.post('/api/game/create?hostName=' + encodeURIComponent(hostName) + '&hostWantsToJoin=true', settings);
            setRoom(res.data);
        } catch (e) {
            setError(t('error'));
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = (roomCode: string) => {
        setJoiningRoom(roomCode);
        setTimeout(() => {
            navigate(`/join?roomCode=${encodeURIComponent(roomCode)}`);
        }, 500);
    };

    return (
        <>
            <Box maxWidth={1100} mx="auto" mt={4}>
                <Fade in timeout={800}>
                    <Paper elevation={4} sx={{p: 4, borderRadius: 4, mb: 4}}>
                        <Typography variant="h2" align="center" color="primary.main" fontWeight={700} gutterBottom>
                            Oda Oluştur
                        </Typography>
                        <Typography variant="h5" align="center" color="text.secondary" mb={4}>
                            Kendi odanı oluştur, ayarlarını seç ve arkadaşlarını davet et!
                        </Typography>
                        <Divider sx={{mb: 4}}/>
                        <Grid container spacing={4} justifyContent="center">
                            <Grid item xs={12} sm={4}>
                                <Fade in timeout={1000}><Paper elevation={2}
                                                               sx={{p: 3, textAlign: 'center', borderRadius: 3}}>
                                    <GroupIcon color="primary" sx={{fontSize: 48}}/>
                                    <Typography variant="h6" fontWeight={600} mt={2}>Kendi Odan</Typography>
                                    <Typography color="text.secondary">Kendi kurallarınla oyun başlat!</Typography>
                                </Paper></Fade>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Fade in timeout={1200}><Paper elevation={2}
                                                               sx={{p: 3, textAlign: 'center', borderRadius: 3}}>
                                    <EmojiEventsIcon color="warning" sx={{fontSize: 48}}/>
                                    <Typography variant="h6" fontWeight={600} mt={2}>Davet Et</Typography>
                                    <Typography color="text.secondary">Arkadaşlarını davet et, birlikte
                                        yarış!</Typography>
                                </Paper></Fade>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Fade in timeout={1400}><Paper elevation={2}
                                                               sx={{p: 3, textAlign: 'center', borderRadius: 3}}>
                                    <RocketLaunchIcon color="success" sx={{fontSize: 48}}/>
                                    <Typography variant="h6" fontWeight={600} mt={2}>Hızlı Başlangıç</Typography>
                                    <Typography color="text.secondary">Odanı oluştur, hemen başla!</Typography>
                                </Paper></Fade>
                            </Grid>
                        </Grid>
                    </Paper>
                </Fade>
                <Box maxWidth={400} mx="auto" mt={6}>
                    <Typography variant="h4" gutterBottom>{t('createRoom')}</Typography>
                    <TextField
                        label={t('hostName')}
                        value={hostName}
                        onChange={e => setHostName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label={t('questionCount') || 'Soru Sayısı'}
                        type="number"
                        value={settings.questionCount}
                        onChange={e => setSettings(s => ({...s, questionCount: Number(e.target.value)}))}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label={t('timePerQuestion') || 'Soru Süresi (sn)'}
                        type="number"
                        value={settings.timePerQuestion}
                        onChange={e => setSettings(s => ({...s, timePerQuestion: Number(e.target.value)}))}
                        fullWidth
                        margin="normal"
                    />
                    <Box mt={3}>
                        <SharedButton variant="primary" onClick={handleCreate}
                                      disabled={loading || !hostName}>{t('submit')}</SharedButton>
                    </Box>
                    {loading && <Typography>{t('loading')}</Typography>}
                    {error && <Alert severity="error">{error}</Alert>}
                    {room && (
                        <Alert severity="success" sx={{mt: 2}}>
                            {t('roomCreated') || 'Oda oluşturuldu!'}<br/>
                            {t('roomCode')}: <b>{room.roomCode}</b>
                        </Alert>
                    )}
                </Box>
                <Divider sx={{my: 4}}/>
                <Box maxWidth={900} mx="auto" mt={4}>
                    <Typography variant="h5" fontWeight={700} mb={3} color="primary.main">Aktif Odalar</Typography>
                    {roomsLoading ? <Typography>{t('loading')}</Typography> : (
                        rooms.length === 0 ? (
                            <Typography color="text.secondary">{t('noRooms') || 'Şu anda aktif oda yok.'}</Typography>
                        ) : (
                            <Box display="grid" gridTemplateColumns={{xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr'}}
                                 gap={3}>
                                {rooms.map((room, idx) => (
                                    <RoomCard
                                        key={room.roomCode || idx}
                                        room={room}
                                        idx={idx}
                                        t={t}
                                        joiningRoom={joiningRoom}
                                        onJoin={handleJoin}
                                    />
                                ))}
                            </Box>
                        )
                    )}
                </Box>
            </Box>
        </>
    );
};

export default CreateRoomPage;
