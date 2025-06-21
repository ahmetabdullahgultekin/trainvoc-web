export interface Player {
    id: string;
    name: string;
    score: number;
    correctCount: number;
    wrongCount: number;
    totalAnswerTime: number;
    answers?: any[];
    room?: GameRoom;
}

export interface GameRoom {
    roomCode: string;
    players: Player[];
    currentQuestionIndex: number;
    started: boolean;
    hostId: string;
    questionDuration: number;
    optionCount: number;
    level: string;
    totalQuestionCount: number;
}

