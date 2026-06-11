import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Chip,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import PanToolIcon from '@mui/icons-material/PanTool';

const ClapDetectionCard = ({ enabled, listening, onToggle, lastClap }) => {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <PanToolIcon sx={{ fontSize: 32 }} />
              <Typography variant="h6" fontWeight="bold">
                Clap Detection
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={enabled}
                  onChange={(e) => onToggle(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#fff',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#fff',
                      opacity: 0.5,
                    },
                  }}
                />
              }
              label=""
            />
          </Box>

          {enabled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                {listening ? (
                  <>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      <MicIcon />
                    </motion.div>
                    <Typography variant="body2">Listening for claps...</Typography>
                  </>
                ) : (
                  <>
                    <MicOffIcon />
                    <Typography variant="body2">Microphone inactive</Typography>
                  </>
                )}
              </Box>

              {lastClap && (
                <Chip
                  label={`Last: ${lastClap.type} - ${new Date(lastClap.timestamp * 1000).toLocaleTimeString()}`}
                  size="small"
                  sx={{
                    mt: 1,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                  }}
                />
              )}

              <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
                Double clap to toggle lights on/off
              </Typography>
            </motion.div>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ClapDetectionCard;
