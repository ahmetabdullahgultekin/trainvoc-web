import React from 'react';
import {Box, Typography} from '@mui/material';

const Footer = () => (
    <Box component="footer" sx={{py: 2, textAlign: 'center', bgcolor: 'background.paper', mt: 4}}>
        <Typography variant="body2" color="text.secondary">
            © 2025 TrainVoc. Tüm hakları saklıdır.
        </Typography>
    </Box>
);

export default Footer;

