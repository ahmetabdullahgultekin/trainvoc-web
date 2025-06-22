import React, {useState} from 'react';
import {Box, Button, LinearProgress, Typography} from '@mui/material';

interface GameQuestionProps {
    question: string;
    options: string[];
    onAnswer: (answer: string) => void;
    timeLimit: number; // saniye
}

const GameQuestion: React.FC<GameQuestionProps> = ({question, options, onAnswer, timeLimit}) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(timeLimit);

    React.useEffect(() => {
        if (selected !== null || timeLeft === 0) return;
        const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, selected]);

    React.useEffect(() => {
        if (timeLeft === 0 && selected === null) {
            onAnswer(''); // Süre doldu, cevap yok
        }
    }, [timeLeft, selected, onAnswer]);

    const handleSelect = (opt: string) => {
        if (selected !== null) return;
        setSelected(opt);
        onAnswer(opt);
    };

    return (
        <Box maxWidth={500} mx="auto" mt={6}>
            <Typography variant="h5" fontWeight={700} mb={2}>{question}</Typography>
            <LinearProgress variant="determinate" value={(timeLeft / timeLimit) * 100} sx={{mb: 3}}/>
            {options.map(opt => (
                <Button
                    key={opt}
                    variant={selected === opt ? 'contained' : 'outlined'}
                    color={selected === opt ? 'success' : 'primary'}
                    fullWidth
                    sx={{mb: 2, fontWeight: 600, fontSize: 18}}
                    onClick={() => handleSelect(opt)}
                    disabled={selected !== null || timeLeft === 0}
                >
                    {opt}
                </Button>
            ))}
            <Typography mt={2} color="text.secondary">
                Kalan süre: {timeLeft} sn
            </Typography>
        </Box>
    );
};

export default GameQuestion;

