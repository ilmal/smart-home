import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import PowerControl from './components/PowerControl';
import DimmerControl from './components/DimmerControl';
import ColorPicker from './components/ColorPicker';
import ClapDetectionCard from './components/ClapDetectionCard';
import apiService from './services/api';
import socketService from './services/socket';
import {
  setLightState,
  setDimming,
  setColor,
  setClapDetection,
  setConnected,
  recordClap,
} from './store/lightsSlice';

// Modern dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#f093fb',
    },
    background: {
      default: '#0f0f23',
      paper: '#1a1a2e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  const dispatch = useDispatch();
  const lightState = useSelector((state) => state.lights);
  const [clapNotification, setClapNotification] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    socketService.connect(
      // onConnect
      () => {
        dispatch(setConnected(true));
        // Load initial state
        apiService.getLightState().then((state) => {
          dispatch(
            setLightState({
              isOn: state.is_on,
              dimming: state.dimming,
              color: { r: state.r, g: state.g, b: state.b },
              temperature: { c: state.c, w: state.w },
            })
          );
        });
      },
      // onDisconnect
      () => {
        dispatch(setConnected(false));
      },
      // onLightStateChanged
      (data) => {
        dispatch(
          setLightState({
            isOn: data.is_on,
            dimming: data.dimming,
            color: { r: data.r, g: data.g, b: data.b },
            temperature: { c: data.c, w: data.w },
          })
        );
      },
      // onClapDetected
      (data) => {
        dispatch(recordClap(data));
        if (data.type === 'double_clap') {
          setClapNotification('Double clap detected! Toggling lights...');
        }
      }
    );

    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);

  const handlePowerChange = async (isOn) => {
    try {
      await apiService.setLights(
        isOn,
        lightState.dimming,
        lightState.color,
        lightState.temperature
      );
    } catch (err) {
      setError('Failed to control lights');
    }
  };

  const handleDimmingChange = async (dimming) => {
    dispatch(setDimming(dimming));
    try {
      await apiService.setLights(
        lightState.isOn,
        dimming,
        lightState.color,
        lightState.temperature
      );
    } catch (err) {
      setError('Failed to adjust brightness');
    }
  };

  const handleColorChange = async (color) => {
    dispatch(setColor(color));
    try {
      await apiService.setLights(
        lightState.isOn,
        lightState.dimming,
        color,
        lightState.temperature
      );
    } catch (err) {
      setError('Failed to change color');
    }
  };

  const handleClapDetectionToggle = async (enabled) => {
    dispatch(setClapDetection({ enabled, listening: enabled }));
    
    if (enabled) {
      const success = await socketService.startAudioCapture();
      if (!success) {
        setError('Failed to access microphone. Please allow microphone access.');
        dispatch(setClapDetection({ enabled: false, listening: false }));
      }
    } else {
      socketService.stopAudioCapture();
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%)',
        }}
      >
        {/* App Bar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: 'transparent',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Toolbar>
            <HomeIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Smart Home Control
            </Typography>
            <Chip
              label={lightState.connected ? 'Connected' : 'Disconnected'}
              color={lightState.connected ? 'success' : 'error'}
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {/* Power Control */}
            <Grid item xs={12} md={6} lg={4}>
              <PowerControl isOn={lightState.isOn} onChange={handlePowerChange} />
            </Grid>

            {/* Brightness Control */}
            <Grid item xs={12} md={6} lg={4}>
              <DimmerControl value={lightState.dimming} onChange={handleDimmingChange} />
            </Grid>

            {/* Clap Detection */}
            <Grid item xs={12} md={12} lg={4}>
              <ClapDetectionCard
                enabled={lightState.clapDetection.enabled}
                listening={lightState.clapDetection.listening}
                onToggle={handleClapDetectionToggle}
                lastClap={lightState.clapDetection.lastClap}
              />
            </Grid>

            {/* Color Picker */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ColorPicker color={lightState.color} onChange={handleColorChange} />
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Notifications */}
        <Snackbar
          open={!!clapNotification}
          autoHideDuration={3000}
          onClose={() => setClapNotification(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="info" sx={{ width: '100%' }}>
            {clapNotification}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={5000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
