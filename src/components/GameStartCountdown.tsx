import React, {useEffect, useState} from 'react';
import {Box, Typography} from '@mui/material';

interface GameStartCountdownProps {
    onComplete: () => void;
}

const GameStartCountdown: React.FC<GameStartCountdownProps> = ({onComplete}) => {
    const [count, setCount] = useState(3);

    useEffect(() => {
        if (count === 0) {
            onComplete();
            return;
        }
        const timer = setTimeout(() => setCount(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [count, onComplete]);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="40vh">
            <Typography variant="h2" color="primary" fontWeight={700}>
                {count === 0 ? 'Başlıyor!' : count}
            </Typography>
            <Typography mt={2} color="text.secondary">Oyun başlamak üzere...</Typography>
        </Box>
    );
};

export default GameStartCountdown;

