import React, {useState} from 'react';
import {Box, Button, LinearProgress, Typography} from '@mui/material';

interface GameQuestionProps {
    question: string;
    options: string[];
    onAnswer: (answer: string, answerTime: number) => void;
    timeLimit: number;
    answered?: boolean;
    correctMeaning?: string;
    selectedAnswer?: string | null;
}

const GameQuestion: React.FC<GameQuestionProps> = ({
                                                       question,
                                                       options,
                                                       onAnswer,
                                                       timeLimit,
                                                       answered,
                                                       correctMeaning,
                                                       selectedAnswer
                                                   }) => {
    const [selected, setSelected] = useState<string | null>(selectedAnswer ?? null);
    const [timeLeft, setTimeLeft] = useState(timeLimit);

    React.useEffect(() => {
        if (selected !== null || timeLeft === 0) return;
        const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, selected]);

    React.useEffect(() => {
        if (timeLeft === 0 && selected === null) {
            onAnswer('', timeLimit);
        }
    }, [timeLeft, selected, onAnswer]);

    const handleSelect = (opt: string) => {
        if (selected !== null) return;
        setSelected(opt);
        const usedTime = timeLimit - timeLeft;
        onAnswer(opt, usedTime);
    };

    return (
        <Box maxWidth={500} mx="auto" mt={6} p={3} bgcolor="#f9f9f9" borderRadius={3} boxShadow={2}>
            <Typography variant="h5" fontWeight={700} mb={2} color="#222">
                {question}
            </Typography>
            <LinearProgress variant="determinate" value={(timeLeft / timeLimit) * 100} sx={{mb: 3}}/>
            {options.map(opt => {
                let btnColor = 'primary';
                let btnBg = '#fff';
                let btnText = '#222';
                if (answered && selected) {
                    if (opt === selected && selected !== correctMeaning) {
                        // Yanlış işaretlenen şık kırmızı
                        btnColor = 'error';
                        btnBg = '#e53935';
                        btnText = '#fff';
                    } else if (opt === correctMeaning) {
                        // Doğru şık yeşil
                        btnColor = 'success';
                        btnBg = '#4caf50';
                        btnText = '#fff';
                    } else {
                        // Diğerleri gri
                        btnColor = 'inherit';
                        btnBg = '#eee';
                        btnText = '#888';
                    }
                } else if (selected === opt) {
                    // Sadece cevap verilmemişse işaretli şık mavi
                    btnColor = 'primary';
                    btnBg = '#fff';
                    btnText = '#222';
                }
                return (
                    <Button
                        key={opt}
                        variant={selected === opt ? 'contained' : 'outlined'}
                        color={btnColor as any}
                        fullWidth
                        sx={{
                            mb: 2,
                            fontWeight: 600,
                            fontSize: 18,
                            backgroundColor: btnBg,
                            color: btnText,
                            borderColor: btnColor === 'error' ? '#e53935' : btnColor === 'success' ? '#4caf50' : '#eee',
                            transition: 'all 0.3s',
                        }}
                        onClick={() => handleSelect(opt)}
                        disabled={(!answered && (selected !== null || timeLeft === 0))}
                    >
                        {opt}
                    </Button>
                );
            })}
            <Typography mt={2} color="#1976d2" fontWeight={700} fontSize={20} textAlign="center">
                Kalan süre: {timeLeft} sn
            </Typography>
        </Box>
    );
};

export default GameQuestion;
