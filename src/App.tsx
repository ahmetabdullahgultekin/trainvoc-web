import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import HomePage from './pages/HomePage';
import CreateRoomPage from './pages/CreateRoomPage';
import JoinRoomPage from './pages/JoinRoomPage';
import RoomDetailPage from './pages/RoomDetailPage';
import AboutPage from './pages/AboutPage';
import LeaderboardPage from './pages/LeaderboardPage';
import GamePage from './pages/GamePage';

function App() {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/create" element={<CreateRoomPage/>}/>
                <Route path="/join" element={<JoinRoomPage/>}/>
                <Route path="/room/:roomCode" element={<RoomDetailPage/>}/>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/leaderboard" element={<LeaderboardPage/>}/>
                <Route path="/game" element={<GamePage/>}/>
            </Routes>
            <Footer/>
        </>
    );
}

export default App;
