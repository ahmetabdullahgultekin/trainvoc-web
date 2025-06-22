import React from 'react';
import styles from './Navbar.module.css';
import {AppBar, Box, Button, MenuItem, Select, type SelectChangeEvent, Toolbar, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';

const Navbar: React.FC = () => {
    const [lang, setLang] = React.useState(localStorage.getItem('lang') || 'tr');

    const handleLangChange = (event: React.ChangeEvent<{ value: unknown }> | SelectChangeEvent<string>) => {
        const newLang = (event.target as HTMLInputElement).value as string;
        setLang(newLang);
        localStorage.setItem('lang', newLang);
        window.location.reload();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={RouterLink} to="/"
                            sx={{flexGrow: 1, color: 'inherit', textDecoration: 'none'}}>
                    TrainVoc
                </Typography>
                <Box display="flex" alignItems="center">
                    <Button color="inherit" component={RouterLink} to="/">Ana Sayfa</Button>
                    <Button color="inherit" component={RouterLink} to="/about">Hakkında</Button>
                    <Button color="inherit" component={RouterLink} to="/contact">İletişim</Button>
                    <Button color="inherit" component={RouterLink} to="/mobile">Mobil Uygulama</Button>
                    <Button color="inherit" component={RouterLink} to="/play">Oyna</Button>
                    <Select
                        value={lang}
                        onChange={handleLangChange}
                        size="small"
                        className={styles.langSelect}
                        sx={{ml: 2}}
                    >
                        <MenuItem value="tr">TR</MenuItem>
                        <MenuItem value="en">EN</MenuItem>
                    </Select>
                    {/* <Button color="inherit" component={RouterLink} to="/profile"
                            startIcon={<Avatar sx={{width: 28, height: 28, fontSize: 20}}>{avatar || '🦊'}</Avatar>}
                            sx={{ml: 2}}>
                        <span style={{fontWeight: 600}}>{nick || 'Profil'}</span>
                    </Button> */}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
