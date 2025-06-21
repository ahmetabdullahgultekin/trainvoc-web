import React, {useEffect, useState} from 'react';
import {Alert, Box, Button, FormControlLabel, Paper, Radio, RadioGroup, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {useLocation} from 'react-router-dom';
import axios from 'axios';
import type {Question} from '../interfaces/gameExtra';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const GamePage: React.FC = () => {
    const {t} = useTranslation();
    const query = useQuery();
    const roomCode = query.get('roomCode') || '';
    const playerName = query.get('playerName') || '';

    const [question, setQuestion] = useState<Question | null>(null);
    const [selected, setSelected] = useState('');
    const [answered, setAnswered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Oyun başladığında ilk soruyu çek
    useEffect(() => {
        fetchQuestion();
        // eslint-disable-next-line
    }, []);

    const fetchQuestion = async () => {
        setLoading(true);
        setError('');
        setQuestion(null);
        setAnswered(false);
        setSelected('');
        try {
            // Örnek: Seviye ve seçenek sayısı sabit, isterseniz dinamik yapabilirsiniz
            const res = await axios.get(`/api/quiz/question?level=easy&optionCount=4`);
            if (res.data.error) {
                setError(res.data.error);
            } else {
                setQuestion(res.data);
            }
        } catch (e) {
            setError(t('error'));
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = () => {
        setAnswered(true);
    };

    const handleNext = () => {
        fetchQuestion();
    };

    if (!roomCode || !playerName) {
        return <Alert severity="error">{t('error')}: roomCode/playerName missing</Alert>;
    }

    return (
        <Box maxWidth={600} mx="auto" mt={6}>
            <Typography variant="h4" gutterBottom>{t('roomCode')}: {roomCode}</Typography>
            <Typography variant="h6" gutterBottom>{t('playerName')}: {playerName}</Typography>
            {loading && <Typography>{t('loading')}</Typography>}
            {error && <Alert severity="error">{error}</Alert>}
            {question && (
                <Paper sx={{p: 3, mt: 3}}>
                    <Typography variant="h5" gutterBottom>{question.text}</Typography>
                    <RadioGroup value={selected} onChange={e => setSelected(e.target.value)}>
                        {question.options.map((opt, idx) => (
                            <FormControlLabel
                                key={idx}
                                value={opt}
                                control={<Radio disabled={answered}/>}
                                label={opt}
                            />
                        ))}
                    </RadioGroup>
                    {!answered ? (
                        <Button variant="contained" onClick={handleAnswer} disabled={!selected}
                                sx={{mt: 2}}>{t('submit')}</Button>
                    ) : (
                        <>
                            <Alert severity={selected === question.options[question.correctIndex] ? 'success' : 'error'}
                                   sx={{mt: 2}}>
                                {selected === question.options[question.correctIndex] ? t('correct') : t('wrong')}<br/>
                                {t('correctAnswer')}: <b>{question.options[question.correctIndex]}</b>
                            </Alert>
                            <Button variant="outlined" onClick={handleNext} sx={{mt: 2}}>{t('next')}</Button>
                        </>
                    )}
                </Paper>
            )}
        </Box>
    );
};

export default GamePage;
