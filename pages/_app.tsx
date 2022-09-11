import Head from 'next/head';
import { AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useState } from 'react';
import { Container } from '@mui/material';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {

  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Container maxWidth="sm">
        <IconButton onClick={() => { (mode === "dark") ? setMode("light") : setMode("dark") }} color="inherit">
          {theme.palette.mode === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </Container>
    </CacheProvider>
  );
}
