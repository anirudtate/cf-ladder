import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const About: NextPage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom>
          About
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          LGM = Legendary Grand Master
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          TODO
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
