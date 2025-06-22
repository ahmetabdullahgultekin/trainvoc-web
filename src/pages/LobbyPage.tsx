import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Avatar, Box, Button, CircularProgress, Grid, Paper, TextField, Typography} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import api from '../api';
import Modal from '../components/shared/Modal';
import FullscreenButton from '../components/shared/FullscreenButton';
import {avatarList} from '../components/shared/useProfile';
import {hashPassword} from '../components/shared/hashPassword';

interface Player {
    id: string;
    name: string;
    isHost: boolean;
}

interface LobbyData {
    players: Player[];
    hostId: string;
    roomCode: string;
    gameStarted: boolean;
}

const LobbyPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [lobby, setLobby] = useState<LobbyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState('');
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [roomPassword, setRoomPassword] = useState('');
    const [hashedPassword, setHashedPassword] = useState('');

    // roomCode ve playerId queryden alınır
    const params = new URLSearchParams(location.search);
    const roomCode = params.get('roomCode');
    const playerId = params.get('playerId');

    useEffect(() => {
        // Tam ekrandan çıkılırsa artık lobiyi dağıtma, sadece host çıkarsa dağıt
        const onFullscreenChange = () => {
            // Artık burada hiçbir şey yapılmıyor
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);

        // Sayfa değişirse/lobiden çıkılırsa/lobi kapatılırsa lobi dağıt
        const handleUnload = async () => {
            if (roomCode) {
                try {
                    await api.post(`/api/game/rooms/${roomCode}/disband`);
                } catch {
                }
            }
        };
        window.addEventListener('beforeunload', handleUnload);
        window.addEventListener('popstate', handleUnload);

        return () => {
            document.removeEventListener('fullscreenchange', onFullscreenChange);
            window.removeEventListener('beforeunload', handleUnload);
            window.removeEventListener('popstate', handleUnload);
        };
    }, [roomCode]);

    useEffect(() => {
        if (!roomCode || !playerId) {
            setError('Oda kodu veya oyuncu bilgisi eksik.');
            return;
        }
        setLoading(true);
        const fetchLobby = () => {
            api.get(`/api/game/${roomCode}`)
                .then(res => {
                    setLobby(res.data);
                    if (res.data.gameStarted) {
                        navigate(`/game?roomCode=${roomCode}&playerId=${playerId}`);
                    }
                })
                .catch(() => setError('Lobi bilgisi alınamadı.'))
                .finally(() => setLoading(false));
        };
        fetchLobby();
        const interval = setInterval(fetchLobby, 2000); // 2 sn'de bir güncelle
        return () => clearInterval(interval);
    }, [roomCode, playerId, navigate]);

    const handleStartGame = async () => {
        setStarting(true);
        setLoading(true);
        setError("");
        try {
            let hash = hashedPassword;
            if (!hash && roomPassword) hash = await hashPassword(roomPassword);
            await api.post(`/api/game/rooms/${roomCode}/start` + (hash ? `?hashedPassword=${hash}` : ''));
        } catch (e: any) {
            setError('Oyun başlatılamadı.');
            console.error('Oyun başlatma hatası:', e);
            setLoading(false);
        } finally {
            setStarting(false);
            setLoading(false);
        }
    };

    const handleHostLeave = async () => {
        if (document.exitFullscreen) await document.exitFullscreen().catch(() => {
        });
        else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
        else if ((document as any).msExitFullscreen) (document as any).msExitFullscreen();
        try {
            let hash = hashedPassword;
            if (!hash && roomPassword) hash = await hashPassword(roomPassword);
            await api.post(`/api/game/rooms/${roomCode}/disband` + (hash ? `?hashedPassword=${hash}` : ''));
            navigate('/play');
        } catch (e) {
            setError('Lobi dağıtılamadı.');
        }
    };

    // Oyuncu sorgusuz sualsiz lobiden çıkabilir
    const handlePlayerLeave = async () => {
        // Tam ekrandan çık
        if (document.exitFullscreen) await document.exitFullscreen().catch(() => {
        });
        else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
        else if ((document as any).msExitFullscreen) (document as any).msExitFullscreen();
        try {
            // Oyuncuyu lobiden/veritabanından silmek için backend'e istek at
            if (roomCode && playerId) {
                await api.post(`/api/game/rooms/${roomCode}/leave?playerId=${playerId}`);
            }
            navigate('/play');
        } catch (e) {
            setError('Lobiden çıkılamadı.');
        }
    };

    if (loading && !error && lobby !== null) return <Box display="flex" justifyContent="center" alignItems="center"
                                                         minHeight="60vh"><CircularProgress/></Box>;
    if (error) return <Box p={4}><Typography color="error">{error}</Typography></Box>;
    if (!lobby) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Paper elevation={6} sx={{p: 5, borderRadius: 4, maxWidth: 400, width: '100%', textAlign: 'center'}}>
                <Box mb={2}>
                    <Avatar sx={{bgcolor: '#e53935', width: 56, height: 56, mx: 'auto'}}>
                        <GroupIcon sx={{fontSize: 36}}/>
                    </Avatar>
                </Box>
                <Typography variant="h5" fontWeight={700} color="error" gutterBottom>
                    Lobi Bulunamadı
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                    Henüz bir lobiye katılmadınız veya lobi süresi dolmuş olabilir.<br/>
                    Oyuna katılmak için aşağıdaki butonu kullanabilirsiniz.
                </Typography>
                <Button variant="contained" color="primary" size="large" onClick={() => navigate('/play/join')}>
                    Oyuna Katıl
                </Button>
            </Paper>
        </Box>
    );

    const isHost = lobby.hostId === playerId;

    // Host oyuncuyu en başa al, diğerlerini sırala
    let players: Player[] = [];
    if (lobby) {
        const hostPlayer = lobby.players.find(p => p.id === lobby.hostId);
        const otherPlayers = lobby.players.filter(p => p.id !== lobby.hostId);
        players = hostPlayer ? [hostPlayer, ...otherPlayers] : lobby.players;
    }

    return (
        <>
            <FullscreenButton/>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    minHeight: '100vh',
                    minWidth: '100vw',
                    bgcolor: '#f5f7fa',
                    zIndex: 9999,
                    overflow: 'auto',
                }}
            >
                <Box maxWidth={600} mx="auto" mt={6}>
                    <Paper elevation={4} sx={{p: 4, borderRadius: 4}}>
                        <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
                            Oda Kodu: <span style={{color: '#1976d2'}}>{lobby.roomCode}</span>
                        </Typography>
                        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 1
                                }}
                            >
                                <GroupIcon
                                    sx={{
                                        fontSize: 48,
                                        color: '#1976d2',
                                        animation: 'spin 2s linear infinite'
                                    }}
                                />
                                <Box
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        bgcolor: '#ffd600',
                                        ml: 2,
                                        animation: 'bounce 1s infinite alternate'
                                    }}
                                />
                            </Box>
                            <Typography variant="h6" align="center" fontWeight={700} sx={{color: '#1976d2'}}>
                                Oyuncular bekleniyor...
                            </Typography>
                            <Typography variant="body2" align="center" sx={{color: '#888', mt: 1}}>
                                Hazır mısın? Oyun birazdan başlıyor!
                            </Typography>
                        </Box>
                        <style>
                            {`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                        @keyframes bounce {
                            0% { transform: translateY(0); }
                            100% { transform: translateY(-16px); }
                        }
                        `}
                        </style>
                        <Grid container spacing={2} justifyContent="center" mb={3}>
                            {players.map(player => (
                                <Grid key={player.id}>
                                    <Paper elevation={2} sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        minWidth: 100,
                                        textAlign: 'center',
                                        background: player.isHost ? '#fffde7' : '#e3f2fd'
                                    }}>
                                        <Avatar sx={{
                                            bgcolor: player.isHost ? '#ffd600' : '#1976d2',
                                            mx: 'auto',
                                            mb: 1,
                                            width: 56,
                                            height: 56,
                                            fontSize: 36
                                        }}>
                                            {typeof (player as any).avatarId === 'number' || !isNaN(Number((player as any).avatarId))
                                                ? avatarList[Number((player as any).avatarId) % avatarList.length]
                                                : avatarList[Math.floor(Math.random() * avatarList.length)]}
                                        </Avatar>
                                        <Typography fontWeight={600}>
                                            {player.name} {player.isHost &&
                                            <span style={{color: '#ff9800', fontWeight: 700}}>(host)</span>}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        {isHost ? (
                            <>
                                <Button variant="contained" color="primary" fullWidth size="large"
                                        onClick={handleStartGame}
                                        disabled={starting}>
                                    {starting ? 'Ba���latılıyor...' : 'Oyunu Başlat'}
                                </Button>
                                <Button variant="outlined" color="error" fullWidth size="large" sx={{mt: 2}}
                                        onClick={() => setShowLeaveModal(true)}>
                                    Lobiden Çık
                                </Button>
                                <Modal open={showLeaveModal} onClose={() => setShowLeaveModal(false)}>
                                    <Typography variant="h6" fontWeight={700} mb={2}>Emin misiniz?</Typography>
                                    <Typography mb={3}>Lobiden çıkarsanız oda dağıtılacak ve tüm oyuncular
                                        atılacak.</Typography>
                                    <Button variant="contained" color="error" onClick={handleHostLeave} sx={{mr: 2}}>
                                        Evet, Lobi Dağıtılsın
                                    </Button>
                                    <Button variant="outlined" onClick={() => setShowLeaveModal(false)}>
                                        Vazgeç
                                    </Button>
                                </Modal>
                            </>
                        ) : (
                            <Button variant="outlined" color="error" fullWidth size="large" sx={{mt: 2}}
                                    onClick={handlePlayerLeave}>
                                Lobiden Çık
                            </Button>
                        )}
                        {/* <Button variant="outlined" color="secondary" fullWidth size="large" sx={{mt: 2}}
                                onClick={() => document.exitFullscreen && document.exitFullscreen()}>
                            Tam Ekrandan Çık
                        </Button> */}
                    </Paper>
                </Box>
                {/* Host ise şifre inputunu göster */}
                {lobby && lobby.hostId === playerId && (
                    <Box maxWidth={400} mx="auto" mt={2}>
                        <TextField
                            label="Oda Şifresi (host için gerekli)"
                            type="password"
                            value={roomPassword}
                            onChange={async e => {
                                setRoomPassword(e.target.value);
                                if (e.target.value) setHashedPassword(await hashPassword(e.target.value));
                                else setHashedPassword('');
                            }}
                            fullWidth
                            margin="normal"
                            size="small"
                        />
                    </Box>
                )}
            </Box>
        </>
    );
};

export default LobbyPage;
