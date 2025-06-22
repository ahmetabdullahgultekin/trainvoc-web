import React, {useState} from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {useTranslation} from 'react-i18next';
import SharedButton from '../components/shared/Button';
import api from '../api';

interface Player {
    id: string;
    name: string;
    score: number;
}

const LeaderboardPage: React.FC = () => {
    const {t} = useTranslation();
    const [roomCode, setRoomCode] = useState('');
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchLeaderboard = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get(`/api/leaderboard?roomCode=${roomCode}`);
            setPlayers(res.data);
        } catch (e) {
            setError(t('error'));
            setPlayers([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth={{xs: '100%', sm: 500}} mx="auto" mt={{xs: 2, md: 6}} px={{xs: 1, sm: 0}}>
            <Typography variant="h4" gutterBottom sx={{fontSize: {xs: 22, sm: 28}}}>{t('leaderboard')}</Typography>
            <Box display="flex" gap={2} mb={3} flexDirection={{xs: 'column', sm: 'row'}}>
                <TextField
                    label={t('roomCode')}
                    value={roomCode}
                    onChange={e => setRoomCode(e.target.value)}
                    fullWidth
                    size="small"
                />
                <SharedButton variant="primary" onClick={fetchLeaderboard}
                              style={{minWidth: 120}}>{t('submit')}</SharedButton>
            </Box>
            {error && <Typography color="error">{error}</Typography>}
            {loading && <Typography>{t('loading')}</Typography>}
            {players.length > 0 && (
                <TableContainer component={Paper} sx={{borderRadius: {xs: 2, sm: 4}}}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: 700, fontSize: {xs: 14, sm: 16}}}>#</TableCell>
                                <TableCell
                                    sx={{fontWeight: 700, fontSize: {xs: 14, sm: 16}}}>{t('playerName')}</TableCell>
                                <TableCell sx={{fontWeight: 700, fontSize: {xs: 14, sm: 16}}}>{t('score')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {players.map((player, idx) => (
                                <TableRow key={player.id}>
                                    <TableCell sx={{fontSize: {xs: 13, sm: 15}}}>{idx + 1}</TableCell>
                                    <TableCell sx={{fontSize: {xs: 13, sm: 15}}}>{player.name}</TableCell>
                                    <TableCell sx={{fontSize: {xs: 13, sm: 15}}}>{player.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default LeaderboardPage;
