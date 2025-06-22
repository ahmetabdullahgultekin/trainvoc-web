import React from 'react';
import {Box, Paper, Typography} from '@mui/material';

const ContactPage: React.FC = () => {
    return (
        <Box maxWidth={{xs: '100%', sm: 600}} mx="auto" mt={{xs: 2, md: 6}} px={{xs: 1, sm: 0}}>
            <Paper elevation={4} sx={{p: {xs: 2, sm: 4}, borderRadius: {xs: 2, sm: 4}}}>
                <Typography variant="h4" fontWeight={700} gutterBottom
                            sx={{fontSize: {xs: 22, sm: 28}}}>İletişim</Typography>
                <Typography mb={2} sx={{fontSize: {xs: 15, sm: 17}}}>
                    <b>Rolling Cat Software</b> olarak TrainVoc platformunu geliştiriyoruz. Her türlü soru, öneri ve iş
                    birliği için bize ulaşabilirsiniz.
                </Typography>
                <Typography mb={1} sx={{fontSize: {xs: 15, sm: 17}}}>
                    <b>E-posta:</b> info@rollingcatsoftware.com
                </Typography>
                <Typography mb={1} sx={{fontSize: {xs: 15, sm: 17}}}>
                    <b>Web:</b> www.rollingcatsoftware.com
                </Typography>
                <Typography mb={1} sx={{fontSize: {xs: 15, sm: 17}}}>
                    <b>Adres:</b> İstanbul, Türkiye
                </Typography>
                <Typography mt={3} color="text.secondary" sx={{fontSize: {xs: 14, sm: 15}}}>
                    Geri bildirimleriniz bizim için çok değerli!
                </Typography>
            </Paper>
        </Box>
    );
};

export default ContactPage;
