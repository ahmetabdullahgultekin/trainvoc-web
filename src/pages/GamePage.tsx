import React, {useEffect, useState} from 'react';
import {Alert, Box} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {useLocation} from 'react-router-dom';
import api from '../api';
import type {Question} from '../interfaces/gameExtra';
import GameStartCountdown from '../components/GameStartCountdown';
import GameQuestion from '../components/GameQuestion';
import GameRanking from '../components/GameRanking';
import GameFinal from '../components/GameFinal';

// Mock veri
const mockQuestions = [
    {
        question: 'Apple kelimesinin Türkçesi nedir?',
        options: ['Elma', 'Armut', 'Muz', 'Karpuz'],
        correct: 'Elma',
    },
    {
        question: 'Dog kelimesinin Türkçesi nedir?',
        options: ['Kedi', 'Kuş', 'Köpek', 'Balık'],
        correct: 'Köpek',
    },
    {
        question: 'Book kelimesinin Türkçesi nedir?',
        options: ['Defter', 'Kitap', 'Kalem', 'Silgi'],
        correct: 'Kitap',
    },
];
const mockPlayers = [
    {id: '1', name: 'Ali', score: 0},
    {id: '2', name: 'Veli', score: 0},
    {id: '3', name: 'Ayşe', score: 0},
];

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const GamePage: React.FC = () => {
    const {t} = useTranslation();
    const query = useQuery();
    const roomCode = query.get('roomCode') || '';
    const playerName = query.get('playerName') || '';

    const [step, setStep] = useState<'countdown' | 'question' | 'ranking' | 'final'>('countdown');
    const [current, setCurrent] = useState(0);
    const [, setAnswers] = useState<string[]>([]);
    const [, setQuestion] = useState<Question | null>(null);
    const [, setSelected] = useState('');
    const [, setAnswered] = useState(false);
    const [, setLoading] = useState(false);
    const [, setError] = useState('');
    const [players, setPlayers] = useState<{ id: string; name: string; score: number }[]>(mockPlayers);
    const [showRanking, setShowRanking] = useState(false);

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
            const res = await api.get(`/api/quiz/question?roomCode=${roomCode}`);
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

    // Oyun başlatma geri sayımından sonra ilk soruya geç
    const handleCountdownComplete = () => setStep('question');

    // Soru cevaplandığında
    const handleAnswer = async (answer: string) => {
        setAnswers(prev => [...prev, answer]);
        // Skor güncelle (örnek: sadece doğruysa +10)
        setPlayers((prev: { id: string; name: string; score: number }[]) => prev.map((p: {
                id: string;
                name: string;
                score: number
            }, idx: number) =>
                idx === 0 && answer === mockQuestions[current].correct ? {...p, score: p.score + 10} : p
        ));
        setStep('ranking');
        setShowRanking(true);
        setTimeout(() => {
            if (current < mockQuestions.length - 1) {
                setCurrent(c => c + 1);
                setStep('question');
                setShowRanking(false);
            } else {
                setStep('final');
            }
        }, 2500);

        // Cevabı sunucuya gönder
        try {
            await api.post(`/api/game/answer`, {
                roomCode,
                playerName,
                answer,
            });
        } catch (e) {
            console.error('Error sending answer:', e);
        }
    };

    // Sıralama için oyuncuları skora göre sırala
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score).map((p, idx) => ({
        ...p,
        isYou: idx === 0, // örnek: ilk oyuncu sizsiniz
    }));

    if (!roomCode || !playerName) {
        return <Alert severity="error">{t('error')}: roomCode/playerName missing</Alert>;
    }

    return (
        <Box maxWidth={600} mx="auto" mt={6}>
            {step === 'countdown' && <GameStartCountdown onComplete={handleCountdownComplete}/>}
            {step === 'question' && (
                <GameQuestion
                    question={mockQuestions[current].question}
                    options={mockQuestions[current].options}
                    onAnswer={handleAnswer}
                    timeLimit={15}
                />
            )}
            {step === 'ranking' && showRanking && <GameRanking players={sortedPlayers}/>}
            {step === 'final' && <GameFinal players={sortedPlayers}/>}
        </Box>
    );
};

export default GamePage;
