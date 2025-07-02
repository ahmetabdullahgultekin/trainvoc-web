import React, {useEffect, useState} from 'react';
import {Alert, Box} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {useLocation} from 'react-router-dom';
import api from '../api';
import GameStartCountdown from '../components/GameStartCountdown';
import GameQuestion from '../components/GameQuestion';
import GameRanking from '../components/GameRanking';
import GameFinal from '../components/GameFinal';
import type {Player} from '../interfaces/game';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

// Oyun adımlarını enum olarak tanımla
export enum GameStep {
    Countdown = 'countdown',
    Question = 'question',
    Ranking = 'ranking',
    Final = 'final',
}

const GamePage: React.FC = () => {
    const {t} = useTranslation();
    const query = useQuery();
    const roomCode = query.get('roomCode') || '';
    const playerId = query.get('playerId') || '';

    const [step, setStep] = useState<GameStep>(GameStep.Countdown);
    const [current, setCurrent] = useState(0);
    const [, setAnswers] = useState<string[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showRanking, setShowRanking] = useState(false);
    const [answerGiven, setAnswerGiven] = useState(false); // Cevap verildi mi?
    const [showNext, setShowNext] = useState(false); // Next butonu gösterilsin mi?

    useEffect(() => {
        const fetchGameData = async () => {
            setLoading(true);
            setError('');
            try {
                const qRes = await api.get(`/api/quiz/all-questions?roomCode=${roomCode}`);
                const questionsData = Array.isArray(qRes.data) ? qRes.data : [qRes.data];
                setQuestions(questionsData);
                const pRes = await api.get(`/api/game/players?roomCode=${roomCode}`);
                let playersData = Array.isArray(pRes.data) ? pRes.data : pRes.data.players;
                console.log('API players:', playersData);
                setPlayers(playersData || []);
            } catch (e: any) {
                setError('Veriler alınamadı.');
            } finally {
                setLoading(false);
            }
        };
        if (roomCode) fetchGameData().then(() =>
            setStep(GameStep.Countdown)
        );
    }, [roomCode]);

    // Oyun başlatma geri sayımından sonra ilk soruya geç
    const handleCountdownComplete = () => setStep(GameStep.Question);

    // Soru cevaplandığında
    const handleAnswer = async (answer: string, answerTime: number) => {
        setAnswers(prev => [...prev, answer]);
        setAnswerGiven(true);
        setShowNext(false);
        setShowRanking(true);
        // Doğru cevabı ve seçilme oranını bul
        const currentQuestion = questions[current];
        const correctAnswer = currentQuestion?.correctAnswer;
        // Skor hesaplama kaldırıldı, backend hesaplayacak
        try {
            await api.post(`/api/game/answer`, {
                roomCode,
                playerId,
                answer,
                answerTime
            });
            // Skor ve oyuncu listesini güncelle
            const pRes = await api.get(`/api/game/players?roomCode=${roomCode}`);
            let playersData = Array.isArray(pRes.data) ? pRes.data : pRes.data.players;
            setPlayers(playersData || []);
        } catch (e) {
            console.error('Error sending answer:', e);
        }
        setShowNext(true); // Next butonunu göster
    };

    // Next butonuna basınca bir sonraki soruya geç
    const handleNext = () => {
        setAnswerGiven(false);
        setShowNext(false);
        setShowRanking(false);
        if (current < questions.length - 1) {
            setCurrent(c => c + 1);
            setStep(GameStep.Question);
        } else {
            setStep(GameStep.Final);
        }
    };


    // Sıralama için oyuncuları skora göre sırala
    const sortedPlayers = [...players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).map((p) => ({
        ...p,
        isYou: p.id === playerId || p.name === playerId,
    }));

    if (!roomCode || !playerId) {
        return <Alert severity="error">{t('error')}: roomCode/playerName missing</Alert>;
    }
    if (loading) {
        return <Alert severity="info">Yükleniyor...</Alert>;
    }
    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box maxWidth={600} mx="auto" mt={6}>
            {/* Skorunuz kutusu kaldırıldı, çünkü userScore artık yok */}
            {/* Cevap verildiyse liderlik tablosunu sorunun üstünde göster */}
            {answerGiven && (
                <Box className="ranking-animate" mb={3}>
                    <GameRanking players={sortedPlayers} animate={answerGiven}/>
                    {showNext && (
                        <Box mt={2} textAlign="center">
                            <button onClick={handleNext} className="next-btn" style={{
                                padding: '12px 32px',
                                fontSize: 20,
                                background: '#1976d2',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontWeight: 700,
                                boxShadow: '0 2px 8px #1976d233',
                                transition: 'background 0.2s'
                            }}>
                                Sonraki Soru
                            </button>
                        </Box>
                    )}
                </Box>
            )}
            {/* Soru kutusu her zaman ekranda, cevap verildiyse animasyon class'ı ekle */}
            {step === GameStep.Countdown && <GameStartCountdown onComplete={handleCountdownComplete}/>}
            {(step === GameStep.Question || answerGiven) && (
                !questions[current] ? (
                    <Alert severity="error">Soru bulunamadı (index: {current})</Alert>
                ) : (
                    <Box className={answerGiven ? "question-animate" : undefined}>
                        <GameQuestion
                            question={questions[current].english}
                            options={questions[current].options}
                            onAnswer={handleAnswer}
                            timeLimit={15}
                            answered={answerGiven}
                            correctMeaning={questions[current].correctMeaning}
                            key={current}
                        />
                    </Box>
                )
            )}
            {step === GameStep.Final && <GameFinal players={sortedPlayers}/>}
        </Box>
    );
};

export default GamePage;
