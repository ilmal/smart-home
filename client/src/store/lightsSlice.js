import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOn: false,
  dimming: 50,
  color: {
    r: 0,
    g: 0,
    b: 0,
  },
  temperature: {
    c: 50,
    w: 50,
  },
  clapDetection: {
    enabled: false,
    listening: false,
    lastClap: null,
  },
  connected: false,
};

const lightsSlice = createSlice({
  name: 'lights',
  initialState,
  reducers: {
    setLightState: (state, action) => {
      return { ...state, ...action.payload };
    },
    toggleLights: (state) => {
      state.isOn = !state.isOn;
    },
    setDimming: (state, action) => {
      state.dimming = action.payload;
    },
    setColor: (state, action) => {
      state.color = action.payload;
    },
    setTemperature: (state, action) => {
      state.temperature = action.payload;
    },
    setClapDetection: (state, action) => {
      state.clapDetection = { ...state.clapDetection, ...action.payload };
    },
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    recordClap: (state, action) => {
      state.clapDetection.lastClap = action.payload;
    },
  },
});

export const {
  setLightState,
  toggleLights,
  setDimming,
  setColor,
  setTemperature,
  setClapDetection,
  setConnected,
  recordClap,
} = lightsSlice.actions;

export default lightsSlice.reducer;
