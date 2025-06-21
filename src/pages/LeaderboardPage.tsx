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
import axios from 'axios';

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
            const res = await axios.get(`/api/leaderboard?roomCode=${roomCode}`);
            setPlayers(res.data);
        } catch (e) {
            setError(t('error'));
            setPlayers([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth={500} mx="auto" mt={6}>
            <Typography variant="h4" gutterBottom>{t('leaderboard')}</Typography>
            <Box display="flex" gap={2} mb={3}>
                <TextField
                    label={t('roomCode')}
                    value={roomCode}
                    onChange={e => setRoomCode(e.target.value)}
                    fullWidth
                />
                <SharedButton variant="primary" onClick={fetchLeaderboard}>{t('submit')}</SharedButton>
            </Box>
            {error && <Typography color="error">{error}</Typography>}
            {loading && <Typography>{t('loading')}</Typography>}
            {players.length > 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>{t('playerName')}</TableCell>
                                <TableCell>{t('score')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {players.map((player, idx) => (
                                <TableRow key={player.id}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{player.name}</TableCell>
                                    <TableCell>{player.score}</TableCell>
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
