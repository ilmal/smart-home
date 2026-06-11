from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import socket
import json
import numpy as np
import base64
from config import Config
from clap_detector import ClapDetector

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize clap detector
clap_detector = ClapDetector(
    threshold=app.config['CLAP_THRESHOLD'],
    timeout=app.config['CLAP_TIMEOUT']
)

# Track light state
light_state = {
    'is_on': False,
    'dimming': 50,
    'r': 0,
    'g': 0,
    'b': 0,
    'c': 50,
    'w': 50
}


def send_light_command(state, dimming, r, g, b, c, w):
    """Send UDP command to all configured lights."""
    lights = app.config['LIGHTS']
    
    if not lights:
        print("Warning: No lights configured in environment variables")
        return False
    
    for light in lights:
        try:
            data = {
                "method": "setPilot",
                "env": "pro",
                "params": {
                    "mac": light['mac'],
                    "src": "",
                    "dimming": int(dimming),
                    "rssi": -62,
                    "state": bool(state),
                    "r": int(r),
                    "g": int(g),
                    "b": int(b),
                    "c": int(c),
                    "w": int(w)
                }
            }
            
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.sendto(
                bytes(json.dumps(data), "utf-8"),
                (light['ip'], light['port'])
            )
            sock.close()
            print(f"Sent command to light {light['mac']} at {light['ip']}")
        except Exception as e:
            print(f"Error sending command to light {light['mac']}: {e}")
    
    return True


def toggle_lights():
    """Toggle lights on/off."""
    light_state['is_on'] = not light_state['is_on']
    send_light_command(
        light_state['is_on'],
        light_state['dimming'],
        light_state['r'],
        light_state['g'],
        light_state['b'],
        light_state['c'],
        light_state['w']
    )
    socketio.emit('light_state_changed', light_state)
    print(f"Lights toggled: {'ON' if light_state['is_on'] else 'OFF'}")


# Set double clap callback
clap_detector.set_double_clap_callback(toggle_lights)


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "lights_configured": len(app.config['LIGHTS']),
        "clap_detection": app.config['CLAP_DETECTION_ENABLED']
    }), 200


@app.route("/lights", methods=["POST"])
def lights():
    """Control lights endpoint."""
    state = request.form.get("state", "false")
    d = request.form.get("d", "50")
    r = request.form.get("r", "0")
    g = request.form.get("g", "0")
    b = request.form.get("b", "0")
    c = request.form.get("c", "50")
    w = request.form.get("w", "50")
    
    # Update global state
    light_state['is_on'] = state == "true"
    light_state['dimming'] = int(d)
    light_state['r'] = int(r)
    light_state['g'] = int(g)
    light_state['b'] = int(b)
    light_state['c'] = int(c)
    light_state['w'] = int(w)
    
    success = send_light_command(
        state == "true", d, r, g, b, c, w
    )
    
    # Notify WebSocket clients
    socketio.emit('light_state_changed', light_state)
    
    return jsonify({
        "status": "success" if success else "error",
        "state": light_state
    }), 200


@app.route("/lights/state", methods=["GET"])
def get_light_state():
    """Get current light state."""
    return jsonify(light_state), 200


@app.route("/lights/config", methods=["GET"])
def get_light_config():
    """Get light configuration."""
    return jsonify({
        "lights": [
            {
                "id": i,
                "mac": light['mac'],
                "ip": light['ip']
            }
            for i, light in enumerate(app.config['LIGHTS'])
        ]
    }), 200


@socketio.on('connect')
def handle_connect():
    """Handle WebSocket connection."""
    print('Client connected')
    emit('light_state_changed', light_state)
    emit('clap_detection_status', {
        'enabled': app.config['CLAP_DETECTION_ENABLED']
    })


@socketio.on('disconnect')
def handle_disconnect():
    """Handle WebSocket disconnection."""
    print('Client disconnected')


@socketio.on('audio_data')
def handle_audio_data(data):
    """
    Handle audio data from client for clap detection.
    Data should be base64 encoded audio samples.
    """
    if not app.config['CLAP_DETECTION_ENABLED']:
        return
    
    try:
        # Decode base64 audio data
        audio_bytes = base64.b64decode(data['audio'])
        audio_array = np.frombuffer(audio_bytes, dtype=np.float32)
        
        # Detect clap
        is_clap = clap_detector.detect_clap_in_audio(
            audio_array,
            sample_rate=data.get('sampleRate', 44100)
        )
        
        if is_clap:
            result = clap_detector.process_clap()
            emit('clap_detected', {
                'type': result,
                'timestamp': time.time()
            }, broadcast=True)
            
    except Exception as e:
        print(f"Error processing audio data: {e}")
        emit('error', {'message': str(e)})


@socketio.on('get_clap_history')
def handle_get_clap_history():
    """Send clap detection history to client."""
    history = clap_detector.get_clap_history()
    emit('clap_history', {'history': history})


if __name__ == "__main__":
    import time
    print("=" * 50)
    print("Smart Home Server Starting")
    print("=" * 50)
    print(f"Configured lights: {len(app.config['LIGHTS'])}")
    for i, light in enumerate(app.config['LIGHTS']):
        print(f"  Light {i+1}: {light['mac']} @ {light['ip']}:{light['port']}")
    print(f"Clap detection: {'ENABLED' if app.config['CLAP_DETECTION_ENABLED'] else 'DISABLED'}")
    print("=" * 50)
    
    socketio.run(app, host="0.0.0.0", port=5000, debug=False, allow_unsafe_werkzeug=True)
