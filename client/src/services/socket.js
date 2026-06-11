import { io } from 'socket.io-client';

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.audioContext = null;
    this.audioStream = null;
    this.mediaRecorder = null;
  }

  connect(onConnect, onDisconnect, onLightStateChanged, onClapDetected) {
    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      if (onConnect) onConnect();
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      if (onDisconnect) onDisconnect();
    });

    this.socket.on('light_state_changed', (data) => {
      console.log('Light state changed:', data);
      if (onLightStateChanged) onLightStateChanged(data);
    });

    this.socket.on('clap_detected', (data) => {
      console.log('Clap detected:', data);
      if (onClapDetected) onClapDetected(data);
    });

    this.socket.on('clap_detection_status', (data) => {
      console.log('Clap detection status:', data);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.stopAudioCapture();
  }

  async startAudioCapture() {
    try {
      // Request microphone access
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 44100,
        },
      });

      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 44100,
      });

      const source = this.audioContext.createMediaStreamSource(this.audioStream);
      const processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(this.audioContext.destination);

      // Process audio chunks
      processor.onaudioprocess = (e) => {
        if (this.socket && this.socket.connected) {
          const audioData = e.inputBuffer.getChannelData(0);
          
          // Convert to base64 for transmission
          const float32Array = new Float32Array(audioData);
          const buffer = Buffer.from(float32Array.buffer);
          const base64Audio = buffer.toString('base64');

          this.socket.emit('audio_data', {
            audio: base64Audio,
            sampleRate: this.audioContext.sampleRate,
          });
        }
      };

      return true;
    } catch (error) {
      console.error('Error starting audio capture:', error);
      return false;
    }
  }

  stopAudioCapture() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach((track) => track.stop());
      this.audioStream = null;
    }
  }

  getClapHistory() {
    if (this.socket) {
      this.socket.emit('get_clap_history');
    }
  }
}

export default new SocketService();
