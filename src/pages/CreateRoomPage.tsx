import React, {useEffect, useState} from 'react';
import {Alert, Box, Divider, Fade, Paper, TextField, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import {useTranslation} from 'react-i18next';
import SharedButton from '../components/shared/Button';
import api from '../api';
import {useNavigate} from 'react-router-dom';
import RoomCard from '../components/shared/RoomCard';
import type {GameRoom} from '../interfaces/game';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import useNick from '../components/shared/useNick.ts';
import useProfile from '../components/shared/useProfile';
import {hashPassword} from '../components/shared/hashPassword';

const CreateRoomPage = () => {
    const {t} = useTranslation();
    const [hostName, setHostName] = useState('');
    const [room, setRoom] = useState<GameRoom | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rooms, setRooms] = useState<GameRoom[]>([]);
    const [roomsLoading, setRoomsLoading] = useState(true);
    const [joiningRoom, setJoiningRoom] = useState<string | null>(null);
    const [nick, setNick] = useNick();
    const {avatar} = useProfile();
    const avatarId = avatar ? avatar : (Math.floor(Math.random() * 10) + 1).toString();
    const navigate = useNavigate();

    // Quiz ayarları örnek (geliştirilebilir):
    const [settings, setSettings] = useState({
        questionCount: 10,
        timePerQuestion: 20
    });
    const [roomPassword, setRoomPassword] = useState('');

    useEffect(() => {
        setRoomsLoading(true);
        api.get('/api/game/rooms')
            .then(res => setRooms(res.data))
            .catch(() => setRooms([]))
            .finally(() => setRoomsLoading(false));
    }, [room]); // room değişince tekrar listele

    useEffect(() => {
        setHostName(nick);
    }, [nick]);

    const handleCreate = async () => {
        setLoading(true);
        setError('');
        setRoom(null);
        try {
            setNick(hostName); // nick'i localStorage'a kaydet
            // Şifre hashle
            const hashedPassword = roomPassword ? await hashPassword(roomPassword) : '';
            // avatarId'yi ve hashedPassword'ü gönder
            const res = await api.post('/api/game/create?hostName=' + encodeURIComponent(hostName) + '&hostWantsToJoin=true' + `&avatarId=${avatarId}` + (hashedPassword ? `&hashedPassword=${hashedPassword}` : ''), settings);
            setRoom(res.data);
            // Oda oluşturulduktan sonra hostu lobiye yönlendir
            const roomCode = res.data.roomCode;
            const hostId = res.data.hostId || (res.data.host && res.data.host.id);
            if (roomCode && hostId) {
                navigate(`/play/lobby?roomCode=${encodeURIComponent(roomCode)}&playerId=${encodeURIComponent(hostId)}`);
            }
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
            <Box maxWidth={1100} mx="auto" mt={{xs: 2, md: 4}} px={{xs: 1, sm: 2, md: 0}}>
                <Fade in timeout={800}>
                    <Paper elevation={4} sx={{p: {xs: 2, sm: 3, md: 4}, borderRadius: {xs: 2, sm: 4}, mb: 4}}>
                        <Typography variant="h3" align="center" color="primary.main" fontWeight={700} gutterBottom
                                    sx={{fontSize: {xs: 26, sm: 36, md: 40}}}>
                            Oda Oluştur
                        </Typography>
                        <Typography variant="h6" align="center" color="text.secondary" mb={4}
                                    sx={{fontSize: {xs: 15, sm: 20}}}>
                            Kendi odanı oluştur, ayarlarını seç ve arkadaşlarını davet et!
                        </Typography>
                        <Divider sx={{mb: 4}}/>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid sx={{display: {xs: 'none', sm: 'block'}}}>
                                <Fade in timeout={1000}><Paper elevation={2}
                                                               sx={{
                                                                   p: {xs: 2, sm: 3},
                                                                   textAlign: 'center',
                                                                   borderRadius: 3
                                                               }}>
                                    <GroupIcon color="primary" sx={{fontSize: {xs: 36, sm: 48}}}/>
                                    <Typography variant="h6" fontWeight={600} mt={2} sx={{fontSize: {xs: 15, sm: 18}}}>Kendi
                                        Odan</Typography>
                                    <Typography color="text.secondary" sx={{fontSize: {xs: 13, sm: 15}}}>Kendi
                                        kurallarınla oyun başlat!</Typography>
                                </Paper></Fade>
                            </Grid>
                            <Grid sx={{display: {xs: 'none', sm: 'block'}}}>
                                <Fade in timeout={1200}><Paper elevation={2}
                                                               sx={{
                                                                   p: {xs: 2, sm: 3},
                                                                   textAlign: 'center',
                                                                   borderRadius: 3
                                                               }}>
                                    <EmojiEventsIcon color="warning" sx={{fontSize: {xs: 36, sm: 48}}}/>
                                    <Typography variant="h6" fontWeight={600} mt={2} sx={{fontSize: {xs: 15, sm: 18}}}>Davet
                                        Et</Typography>
                                    <Typography color="text.secondary" sx={{fontSize: {xs: 13, sm: 15}}}>Arkadaşlarını
                                        davet et, birlikte yarış!</Typography>
                                </Paper></Fade>
                            </Grid>
                            <Grid sx={{display: {xs: 'none', sm: 'block'}}}>
                                <Fade in timeout={1400}><Paper elevation={2}
                                                               sx={{
                                                                   p: {xs: 2, sm: 3},
                                                                   textAlign: 'center',
                                                                   borderRadius: 3
                                                               }}>
                                    <RocketLaunchIcon color="success" sx={{fontSize: {xs: 36, sm: 48}}}/>
                                    <Typography variant="h6" fontWeight={600} mt={2} sx={{fontSize: {xs: 15, sm: 18}}}>Hızlı
                                        Başlangıç</Typography>
                                    <Typography color="text.secondary" sx={{fontSize: {xs: 13, sm: 15}}}>Odanı oluştur,
                                        hemen başla!</Typography>
                                </Paper></Fade>
                            </Grid>
                        </Grid>
                    </Paper>
                </Fade>
                <Box maxWidth={400} mx="auto" mt={6}>
                    <Typography variant="h4" gutterBottom
                                sx={{fontSize: {xs: 20, sm: 28}}}>{t('createRoom')}</Typography>
                    <TextField
                        label={t('hostName')}
                        value={hostName}
                        onChange={e => {
                            setHostName(e.target.value);
                            setNick(e.target.value);
                        }}
                        fullWidth
                        margin="normal"
                        size="small"
                    />
                    <TextField
                        label={t('questionCount') || 'Soru Sayısı'}
                        type="number"
                        value={settings.questionCount}
                        onChange={e => setSettings(s => ({...s, questionCount: Number(e.target.value)}))}
                        fullWidth
                        margin="normal"
                        size="small"
                    />
                    <TextField
                        label={t('timePerQuestion') || 'Soru Süresi (sn)'}
                        type="number"
                        value={settings.timePerQuestion}
                        onChange={e => setSettings(s => ({...s, timePerQuestion: Number(e.target.value)}))}
                        fullWidth
                        margin="normal"
                        size="small"
                    />
                    <TextField
                        label="Oda Şifresi (isteğe bağlı)"
                        type="password"
                        value={roomPassword}
                        onChange={e => setRoomPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        size="small"
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
                    <Typography variant="h5" fontWeight={700} mb={3} color="primary.main"
                                sx={{fontSize: {xs: 18, sm: 24}}}>Aktif Odalar</Typography>
                    {roomsLoading ? <Typography>{t('loading')}</Typography> : (
                        rooms.length === 0 ? (
                            <Typography color="text.secondary">{t('noRooms') || 'Şu anda aktif oda yok.'}</Typography>
                        ) : (
                            <Box display="grid" gridTemplateColumns={{xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr'}}
                                 gap={2}>
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
