import React from 'react';
import { Box, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const PowerControl = ({ isOn, onChange }) => {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        background: isOn
          ? 'linear-gradient(135deg, #FDC830 0%, #F37335 100%)'
          : 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        transition: 'all 0.5s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, py: 4 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <motion.div
            animate={isOn ? {
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            } : {}}
            transition={{
              duration: 2,
              repeat: isOn ? Infinity : 0,
            }}
          >
            <LightbulbIcon sx={{ fontSize: 64 }} />
          </motion.div>
        </Box>

        <Typography variant="h4" fontWeight="bold">
          {isOn ? 'LIGHTS ON' : 'LIGHTS OFF'}
        </Typography>

        <ToggleButtonGroup
          value={isOn ? 'on' : 'off'}
          exclusive
          onChange={(e, value) => {
            if (value !== null) {
              onChange(value === 'on');
            }
          }}
          sx={{
            '& .MuiToggleButton-root': {
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.4)',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
            },
          }}
        >
          <ToggleButton value="on">
            <PowerSettingsNewIcon sx={{ mr: 1 }} />
            ON
          </ToggleButton>
          <ToggleButton value="off">
            <PowerSettingsNewIcon sx={{ mr: 1 }} />
            OFF
          </ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Tap to toggle lights
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PowerControl;
