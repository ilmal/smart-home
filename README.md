# Smart Home Control System 🏠✨

A modern, beautiful smart home control system with double-clap detection to control your smart lights!

## Features

### 🎨 Modern UI
- Beautiful gradient-based design with animations
- Responsive layout that works on all devices
- Dark mode theme
- Real-time updates via WebSocket

### 💡 Light Control
- Power on/off toggle
- Brightness dimmer (0-100%)
- Full RGB color picker
- Support for multiple lights

### 👏 Clap Detection (NEW!)
- Double-clap to toggle lights on/off
- Real-time audio processing using ML
- Uses librosa for audio analysis
- WebSocket-based communication

### 🔧 Easy Configuration
- All lamp IPs and settings in `docker-compose.yml`
- Environment-based configuration
- No code changes needed to update settings

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Microphone access (for clap detection)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ilmal/smart-home.git
cd smart-home
```

2. **Configure your lights**

Edit `docker-compose.yml` and update the light configuration:

```yaml
environment:
  - LIGHT_1_MAC=d8a0113a94b6
  - LIGHT_1_IP=192.168.1.14
  - LIGHT_1_PORT=38899
  # Add more lights as needed
  - LIGHT_2_MAC=...
  - LIGHT_2_IP=...
```

3. **Start the application**
```bash
docker-compose up -d
```

4. **Access the app**

Open your browser and go to: **http://localhost:16745**

## Configuration

### Environment Variables

#### Server (Backend)
- `LIGHT_X_MAC` - MAC address of light X
- `LIGHT_X_IP` - IP address of light X
- `LIGHT_X_PORT` - Port of light X (default: 38899)
- `CLAP_DETECTION_ENABLED` - Enable clap detection (true/false)
- `CLAP_THRESHOLD` - Clap detection sensitivity (default: 0.7)
- `CLAP_TIMEOUT` - Time between claps for double-clap (default: 0.5s)

#### Client (Frontend)
- `PORT` - Port to run the frontend (default: 16745)
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000)
- `REACT_APP_WS_URL` - WebSocket URL (default: ws://localhost:5000)

### Adding More Lights

To add more lights, simply add new environment variables in `docker-compose.yml`:

```yaml
- LIGHT_4_MAC=your_mac_address
- LIGHT_4_IP=192.168.1.100
- LIGHT_4_PORT=38899
```

The system supports up to 9 lights (LIGHT_1 through LIGHT_9).

## Technology Stack

### Backend
- **Flask** - Web framework
- **Flask-SocketIO** - WebSocket support
- **librosa** - Audio analysis for clap detection
- **NumPy** - Numerical processing

### Frontend
- **React 18** - Modern React with hooks
- **Redux Toolkit** - State management
- **Material-UI v5** - Beautiful components
- **Framer Motion** - Smooth animations
- **Socket.io** - Real-time communication
- **react-color** - Color picker

## How Clap Detection Works

1. **Audio Capture**: Browser captures microphone audio
2. **WebSocket Stream**: Audio data sent to backend in real-time
3. **ML Processing**: Librosa analyzes audio for clap characteristics:
   - High-frequency energy spikes
   - Spectral centroid analysis
   - Peak detection
4. **Double-Clap Recognition**: Detects two claps within 0.5 seconds
5. **Light Toggle**: Automatically toggles lights on/off

## API Endpoints

### REST API
- `GET /health` - Health check
- `POST /lights` - Control lights
- `GET /lights/state` - Get current state
- `GET /lights/config` - Get light configuration

### WebSocket Events
- `connect` - Client connected
- `disconnect` - Client disconnected
- `audio_data` - Send audio for clap detection
- `clap_detected` - Clap detected notification
- `light_state_changed` - Light state update

## Development

### Running Locally

**Backend:**
```bash
cd server
python -m venv venv
source venv/bin/activate
pip install flask flask-socketio flask-cors librosa numpy
python main.py
```

**Frontend:**
```bash
cd client
npm install
npm start
```

### Building for Production

```bash
docker-compose build
docker-compose up -d
```

## Troubleshooting

### Clap detection not working
- Ensure microphone permissions are granted
- Check that `CLAP_DETECTION_ENABLED=true` in docker-compose.yml
- Try adjusting `CLAP_THRESHOLD` (lower = more sensitive)

### Lights not responding
- Verify light IP addresses are correct
- Ensure lights are on the same network
- Check that UDP port 38899 is not blocked

### Frontend not connecting
- Check that both containers are running: `docker ps`
- Verify `REACT_APP_API_URL` matches backend address
- Check browser console for errors

## License

MIT

## Credits

Built with ❤️ by [@ilmal](https://github.com/ilmal)
