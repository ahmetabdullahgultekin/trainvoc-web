// Sayfa yönlendirmeleri ve genel layout için ana dosya
import React from 'react';
import {AppBar, Box, Button, MenuItem, Select, Toolbar, Typography} from '@mui/material';
import {BrowserRouter as Router, Link as RouterLink, Route, Routes} from 'react-router-dom';
import styles from './Navbar.module.css';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CreateRoomPage from './pages/CreateRoomPage';
import JoinRoomPage from './pages/JoinRoomPage';
import RoomDetailPage from './pages/RoomDetailPage';

const Navbar = () => {
    const [lang, setLang] = React.useState(localStorage.getItem('lang') || 'tr');

    const handleLangChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newLang = event.target.value as string;
        setLang(newLang);
        localStorage.setItem('lang', newLang);
        window.location.reload(); // Basitçe sayfayı yenile, i18n eklenince kaldırılabilir
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={RouterLink} to="/"
                            sx={{flexGrow: 1, color: 'inherit', textDecoration: 'none'}}>
                    TrainVoc
                </Typography>
                <Box>
                    <Button color="inherit" component={RouterLink} to="/create">Oda Oluştur</Button>
                    <Button color="inherit" component={RouterLink} to="/join">Odaya Katıl</Button>
                    <Select
                        value={lang}
                        onChange={handleLangChange}
                        size="small"
                        className={styles.langSelect}
                        sx={undefined}
                    >
                        <MenuItem value="tr">TR</MenuItem>
                        <MenuItem value="en">EN</MenuItem>
                    </Select>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

function App() {
    return (
        <Router>
            <CssBaseline/>
            <Navbar/>
            <Container maxWidth="md" sx={{minHeight: '80vh', py: 4}}>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/create" element={<CreateRoomPage/>}/>
                    <Route path="/join" element={<JoinRoomPage/>}/>
                    <Route path="/room/:roomCode" element={<RoomDetailPage/>}/>
                </Routes>
            </Container>
            <Footer/>
        </Router>
    );
}

export default App;
