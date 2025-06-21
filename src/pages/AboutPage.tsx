import React, {useEffect, useRef} from 'react';
import {Box, Divider, Fade, Paper, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const AboutPage: React.FC = () => {
    const {t} = useTranslation();
    const ref = useRef<HTMLDivElement>(null);

    const features = [
        {
            icon: <EmojiEventsIcon color="primary" sx={{fontSize: 48}}/>,
            title: t('socialCompetition'),
            desc: t('socialCompetitionDesc')
        },
        {
            icon: <GroupIcon color="secondary" sx={{fontSize: 48}}/>,
            title: t('multiRoom'),
            desc: t('multiRoomDesc')
        },
        {
            icon: <SchoolIcon color="success" sx={{fontSize: 48}}/>,
            title: t('educationalContent'),
            desc: t('educationalContentDesc')
        },
        {
            icon: <RocketLaunchIcon color="warning" sx={{fontSize: 48}}/>,
            title: t('advancedTech'),
            desc: t('advancedTechDesc')
        }
    ];

    useEffect(() => {
        fetch('/src/pages/AboutInfo.html')
            .then(res => res.text())
            .then(html => {
                if (ref.current) {
                    ref.current.innerHTML = html;
                }
            });
    }, []);

    return (
        <div>
            <div ref={ref}/>
            <Box maxWidth={1100} mx="auto" mt={4}>
                <Fade in timeout={800}>
                    <Paper elevation={4} sx={{p: 4, borderRadius: 4, mb: 4}}>
                        <Typography variant="h2" align="center" color="primary.main" fontWeight={700} gutterBottom>
                            {t('aboutTitle') || 'Hakkında'}
                        </Typography>
                        <Typography variant="h5" align="center" color="text.secondary" mb={4}>
                            {t('aboutDesc') || 'TrainVoc hakkında detaylı bilgi ve vizyon.'}
                        </Typography>
                        <Divider sx={{mb: 4}}/>
                        <Box display="grid" gridTemplateColumns={{xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr'}} gap={3}>
                            {features.map((feature, idx) => (
                                <Fade in timeout={1000 + idx * 200} key={idx}>
                                    <Paper elevation={2} sx={{p: 3, textAlign: 'center', borderRadius: 3}}>
                                        {feature.icon}
                                        <Typography variant="h6" fontWeight={600} mt={2}>{feature.title}</Typography>
                                        <Typography color="text.secondary">{feature.desc}</Typography>
                                    </Paper>
                                </Fade>
                            ))}
                        </Box>
                    </Paper>
                </Fade>
            </Box>
        </div>
    );
};

export default AboutPage;
