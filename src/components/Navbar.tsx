// Sayfa yönlendirmeleri ve genel layout için ana dosya
import React from 'react';
import {AppBar, Box, Button, MenuItem, Select, Toolbar, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import styles from './Navbar.module.css';
import type {SelectChangeEvent} from '@mui/material/Select';

const Navbar = () => {
    const [lang, setLang] = React.useState(localStorage.getItem('lang') || 'tr');

    const handleLangChange = (event: SelectChangeEvent<string>) => {
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
