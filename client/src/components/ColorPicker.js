import React from 'react';
import { Box, Card, CardContent, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { SketchPicker } from 'react-color';
import PaletteIcon from '@mui/icons-material/Palette';

const ColorPicker = ({ color, onChange }) => {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      sx={{
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        background: `linear-gradient(135deg, rgb(${color.r}, ${color.g}, ${color.b}) 0%, rgba(${color.r}, ${color.g}, ${color.b}, 0.6) 100%)`,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <PaletteIcon sx={{ color: 'white', fontSize: 28 }} />
            <Typography variant="h6" fontWeight="bold" color="white">
              Color Control
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              '& .sketch-picker': {
                boxShadow: 'none !important',
                borderRadius: '12px !important',
              },
            }}
          >
            <SketchPicker
              color={color}
              onChange={(newColor) => onChange(newColor.rgb)}
              disableAlpha
            />
          </Box>

          <Box
            sx={{
              height: 60,
              borderRadius: 2,
              background: `rgb(${color.r}, ${color.g}, ${color.b})`,
              border: '3px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          />

          <Typography variant="caption" color="white" textAlign="center">
            RGB: {color.r}, {color.g}, {color.b}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ColorPicker;
