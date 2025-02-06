import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box
            sx={{
                bottom: 0,
                left: 0,
                right: 0,
                marginTop: 'auto', 
                padding: '10px',
                textAlign: 'center',
                borderTop: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Typography variant="body2" color="textSecondary">
                © 2024 Web Encuestas - UNT - FACET - Proyecto de Software (LI) Proyecto Final (PU)
            </Typography>
        </Box>
    );
};

export default Footer;