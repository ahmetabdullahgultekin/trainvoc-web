import React from 'react';
import styles from './Navbar.module.css';
import {AppBar, Box, MenuItem, Select, type SelectChangeEvent, Toolbar, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const Navbar: React.FC = () => {
    const [lang, setLang] = React.useState(localStorage.getItem('lang') || 'tr');
    const {t} = useTranslation();

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
                <Box>
                    <RouterLink to="/create" className={styles.link}>
                        <button className={styles.button}>{t('createRoom')}</button>
                    </RouterLink>
                    <RouterLink to="/join" className={styles.link}>
                        <button className={styles.button}>{t('joinRoom')}</button>
                    </RouterLink>
                    <RouterLink to="/about" className={styles.link}>
                        <button className={styles.button}>{t('about')}</button>
                    </RouterLink>
                    <RouterLink to="/leaderboard" className={styles.link}>
                        <button className={styles.button}>{t('leaderboard')}</button>
                    </RouterLink>
                    <Select
                        value={lang}
                        onChange={handleLangChange}
                        size="small"
                        className={styles.langSelect}
                        aria-label={t('language')}
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
