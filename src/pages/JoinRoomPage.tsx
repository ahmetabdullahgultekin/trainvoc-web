import React, {useEffect, useState} from 'react';
import {Alert, Box, Divider, Fade, Grid, Paper, TextField, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import SharedButton from '../components/shared/Button';
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom';
import RoomCard from '../components/shared/RoomCard';
import type {GameRoom} from '../interfaces/game';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const JoinRoomPage = () => {
    const {t} = useTranslation();
    const [roomCode, setRoomCode] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [player, setPlayer] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rooms, setRooms] = useState<GameRoom[]>([]);
    const [joiningRoom, setJoiningRoom] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        axios.get('/api/game/rooms')
            .then(res => setRooms(res.data))
            .catch(() => setRooms([]));
    }, []);

    useEffect(() => {
        // URL'den roomCode parametresini al ve inputa yaz
        const params = new URLSearchParams(location.search);
        const code = params.get('roomCode');
        if (code) setRoomCode(code);
    }, [location.search]);

    const handleJoin = async () => {
        setLoading(true);
        setError('');
        setPlayer(null);
        try {
            const res = await axios.post(`/api/game/join?roomCode=${encodeURIComponent(roomCode)}&playerName=${encodeURIComponent(playerName)}`);
            setPlayer(res.data);
            // Başarılı katılım sonrası oyun ekranına yönlendir
            setTimeout(() => {
                navigate(`/game?roomCode=${encodeURIComponent(roomCode)}&playerName=${encodeURIComponent(playerName)}`);
            }, 1000);
        } catch (e) {
            setError(t('error'));
        } finally {
            setLoading(false);
        }
    };

    const handleRoomJoin = async (roomCode: string) => {
        setJoiningRoom(roomCode);
        setRoomCode(roomCode);
        await handleJoin();
        setJoiningRoom(null);
    };

    return (
        <Box maxWidth={1100} mx="auto" mt={4}>
            <Fade in timeout={800}>
                <Paper elevation={4} sx={{p: 4, borderRadius: 4, mb: 4}}>
                    <Typography variant="h2" align="center" color="primary.main" fontWeight={700} gutterBottom>
                        Odaya Katıl
                    </Typography>
                    <Typography variant="h5" align="center" color="text.secondary" mb={4}>
                        Mevcut odalardan birine katılmak için oda kodunu gir ya da listeden bir odayı seç!
                    </Typography>
                    <Divider sx={{mb: 4}}/>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} sm={4}>
                            <Fade in timeout={1000}><Paper elevation={2}
                                                           sx={{p: 3, textAlign: 'center', borderRadius: 3}}>
                                <GroupIcon color="primary" sx={{fontSize: 48}}/>
                                <Typography variant="h6" fontWeight={600} mt={2}>Topluluk</Typography>
                                <Typography color="text.secondary">Birlikte öğren, birlikte yarış!</Typography>
                            </Paper></Fade>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Fade in timeout={1200}><Paper elevation={2}
                                                           sx={{p: 3, textAlign: 'center', borderRadius: 3}}>
                                <EmojiEventsIcon color="warning" sx={{fontSize: 48}}/>
                                <Typography variant="h6" fontWeight={600} mt={2}>Rekabet</Typography>
                                <Typography color="text.secondary">En iyi oyuncularla yarış!</Typography>
                            </Paper></Fade>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Fade in timeout={1400}><Paper elevation={2}
                                                           sx={{p: 3, textAlign: 'center', borderRadius: 3}}>
                                <RocketLaunchIcon color="success" sx={{fontSize: 48}}/>
                                <Typography variant="h6" fontWeight={600} mt={2}>Hızlı Katılım</Typography>
                                <Typography color="text.secondary">Odaya anında katıl, hemen başla!</Typography>
                            </Paper></Fade>
                        </Grid>
                    </Grid>
                </Paper>
            </Fade>
            <Box maxWidth={400} mx="auto" mt={6}>
                <Typography variant="h4" gutterBottom>{t('joinRoom')}</Typography>
                <TextField
                    label={t('roomCode')}
                    value={roomCode}
                    onChange={e => setRoomCode(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label={t('playerName')}
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <div style={{marginTop: 24}}>
                    <SharedButton variant="primary" onClick={handleJoin}
                                  disabled={loading || !roomCode || !playerName}>{t('submit')}</SharedButton>
                </div>
                {loading && <Typography>{t('loading')}</Typography>}
                {error && <Alert severity="error">{error}</Alert>}
                {player && (
                    <Alert severity="success" sx={{mt: 2}}>
                        {t('joinSuccess') || 'Odaya başarıyla katıldınız!'}<br/>
                        {t('playerName')}: <b>{player.name}</b>
                    </Alert>
                )}
            </Box>
            <Divider sx={{my: 4}}/>
            <Box maxWidth={900} mx="auto" mt={4}>
                <Typography variant="h5" fontWeight={700} mb={3} color="primary.main">Aktif Odalar</Typography>
                {rooms.length === 0 ? (
                    <Typography color="text.secondary">Şu anda aktif oda yok. Hemen bir oda oluştur!</Typography>
                ) : (
                    <Box display="grid" gridTemplateColumns={{xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr'}} gap={3}>
                        {rooms.map((room, idx) => (
                            <RoomCard
                                key={room.roomCode}
                                room={room}
                                idx={idx}
                                t={t}
                                joiningRoom={joiningRoom}
                                onJoin={handleRoomJoin}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default JoinRoomPage;
