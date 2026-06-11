import React from 'react';
import { Box, Card, CardContent, Typography, Slider, Stack, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import WbIncandescentIcon from '@mui/icons-material/WbIncandescent';

const DimmerControl = ({ value, onChange }) => {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      sx={{
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
        height: '100%',
      }}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={2} sx={{ flex: 1 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <WbIncandescentIcon sx={{ fontSize: 28 }} />
            <Typography variant="h6" fontWeight="bold">
              Brightness
            </Typography>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
            >
              <Typography
                variant="h2"
                fontWeight="bold"
                sx={{
                  textShadow: '0 4px 20px rgba(255,255,255,0.5)',
                }}
              >
                {value}%
              </Typography>

              <Slider
                orientation="vertical"
                value={value}
                onChange={(e, newValue) => onChange(newValue)}
                min={0}
                max={100}
                step={5}
                sx={{
                  height: 200,
                  '& .MuiSlider-thumb': {
                    width: 24,
                    height: 24,
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#fff',
                    border: 'none',
                    width: 8,
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    width: 8,
                  },
                }}
              />
            </motion.div>
          </Box>

          <Chip
            label={value < 30 ? 'Dim' : value < 70 ? 'Medium' : 'Bright'}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DimmerControl;
