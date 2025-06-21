import React, {useEffect, useState} from 'react';
import {Box, Divider, Fade, Grid, Paper, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import Loader from '../components/shared/Loader';
import {useNavigate} from 'react-router-dom';
import RoomCard from '../components/shared/RoomCard';
import type {GameRoom} from '../interfaces/game';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const HomePage: React.FC = () => {
    const {t} = useTranslation();
    const [rooms, setRooms] = useState<GameRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [joiningRoom, setJoiningRoom] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get('/api/game/rooms')
            .then(res => setRooms(res.data))
            .catch(() => setRooms([]))
            .finally(() => setLoading(false));
    }, []);

    const handleJoin = (roomCode: string) => {
        setJoiningRoom(roomCode);
        setTimeout(() => {
            navigate(`/join?roomCode=${encodeURIComponent(roomCode)}`);
        }, 500);
    };

    return (
        <Box maxWidth={1100} mx="auto" mt={4}>
            <Fade in timeout={800}>
                <Paper elevation={4} sx={{p: 4, borderRadius: 4, mb: 4}}>
                    <Typography variant="h2" align="center" color="primary.main" fontWeight={700} gutterBottom>
                        TrainVoc
                    </Typography>
                    <Typography variant="h5" align="center" color="text.secondary" mb={4}>
                        İngilizce-Türkçe kelime ezberini eğlenceli, sosyal ve sürdürülebilir hale getiren yeni nesil
                        platform.
                    </Typography>
                    <Divider sx={{mb: 4}}/>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} sm={4}>
                            <Fade in timeout={1000}><Paper elevation={2}
                                                           sx={{p: 3, textAlign: 'center', borderRadius: 3}}>
                                <GroupIcon color="primary" sx={{fontSize: 48}}/>
                                <Typography variant="h6" fontWeight={600} mt={2}>Sosyal Oyun</Typography>
                                <Typography color="text.secondary">Arkadaşlarınla veya toplulukla yarış!</Typography>
                            </Paper></Fade>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Fade in timeout={1200}><Paper elevation={2}
                                                           sx={{p: 3, textAlign: 'center', borderRadius: 3}}>
                                <EmojiEventsIcon color="warning" sx={{fontSize: 48}}/>
                                <Typography variant="h6" fontWeight={600} mt={2}>Liderlik Tablosu</Typography>
                                <Typography color="text.secondary">En iyi oyuncularla rekabet et, skorunu
                                    yükselt!</Typography>
                            </Paper></Fade>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Fade in timeout={1400}><Paper elevation={2}
                                                           sx={{p: 3, textAlign: 'center', borderRadius: 3}}>
                                <RocketLaunchIcon color="success" sx={{fontSize: 48}}/>
                                <Typography variant="h6" fontWeight={600} mt={2}>Hızlı ve Modern</Typography>
                                <Typography color="text.secondary">Her cihazda hızlı, modern ve erişilebilir
                                    deneyim.</Typography>
                            </Paper></Fade>
                        </Grid>
                    </Grid>
                </Paper>
            </Fade>
            <Fade in timeout={1200}>
                <Box>
                    <Typography variant="h4" fontWeight={700} mb={3} color="primary.main">Aktif Odalar</Typography>
                    {loading ? <Loader/> : (
                        rooms.length === 0 ? (
                            <Typography color="text.secondary">Şu anda aktif oda yok. Hemen bir oda
                                oluştur!</Typography>
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
            </Fade>
        </Box>
    );
};

export default HomePage;
