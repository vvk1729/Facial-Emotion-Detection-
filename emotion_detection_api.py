"""
Emotion Detection Flask API Service
This service provides REST endpoints for emotion detection during video meetings
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import tensorflow as tf
import h5py
import json
import mediapipe as mp
import base64
import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

app = Flask(__name__)
CORS(app)  # Enable CORS for Node.js integration

# Configuration
MODEL_PATH = r"C:\Users\HP\Desktop\gg\best_model_rgb (1).h5"
INPUT_SIZE = (128, 128)
emotions = ("angry", "disgust", "fear", "happy", "neutral", "sad", "surprise")

# Define interest categories
INTEREST_EMOTIONS = {'happy', 'neutral', 'surprise'}
NON_INTEREST_EMOTIONS = {'angry', 'disgust', 'fear', 'sad'}

EMOTION_COLORS = {
    'angry': '#0000FF', 'disgust': '#800080', 'fear': '#FF00FF',
    'happy': '#00FF00', 'neutral': '#C8C8C8', 'sad': '#FF0000',
    'surprise': '#00FFFF'
}

print("Loading emotion model...")
import tf_keras as keras

# Load model
with h5py.File(MODEL_PATH, 'r') as f:
    model_config = f.attrs.get('model_config')
    if isinstance(model_config, bytes):
        model_config = model_config.decode('utf-8')
    config = json.loads(model_config)
    
    def clean_config(obj):
        if isinstance(obj, dict):
            if 'dtype' in obj and isinstance(obj['dtype'], dict):
                obj['dtype'] = 'float32'
            if 'batch_shape' in obj:
                obj['batch_input_shape'] = obj.pop('batch_shape')
            for value in obj.values():
                clean_config(value)
        elif isinstance(obj, list):
            for item in obj:
                clean_config(item)
    
    clean_config(config)
    model = keras.models.model_from_json(json.dumps(config))
    model.load_weights(MODEL_PATH)

print("Model loaded ✅")

# Initialize MediaPipe Face Detection
print("Loading face detector...")
mp_face = mp.solutions.face_detection
face_detection = mp_face.FaceDetection(min_detection_confidence=0.5, model_selection=0)
print("Face detector loaded ✅")

def preprocess(face):
    """Preprocess face image for model input"""
    face = cv2.resize(face, INPUT_SIZE)
    face = face.astype("float32") / 255.0
    return np.expand_dims(face, axis=0)

def calculate_interest(preds):
    """Calculate interest and non-interest percentages"""
    interest_prob = sum(preds[i] for i, emotion in enumerate(emotions) if emotion in INTEREST_EMOTIONS)
    non_interest_prob = sum(preds[i] for i, emotion in enumerate(emotions) if emotion in NON_INTEREST_EMOTIONS)
    return interest_prob * 100, non_interest_prob * 100

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'emotion-detection',
        'model_loaded': True
    }), 200

@app.route('/detect_emotion', methods=['POST'])
def detect_emotion():
    """
    Detect emotion from base64 encoded image
    Request body: { "image": "base64_string", "mode": "individual" | "interest" }
    """
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Decode base64 image
        image_data = data['image']
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'error': 'Invalid image data'}), 400
        
        # Get detection mode
        mode = data.get('mode', 'individual')  # 'individual' or 'interest'
        
        # Convert to RGB for MediaPipe
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_detection.process(rgb)
        
        detections = []
        
        if results.detections:
            h, w, _ = frame.shape
            for detection in results.detections:
                bbox = detection.location_data.relative_bounding_box
                x1 = int(bbox.xmin * w)
                y1 = int(bbox.ymin * h)
                x2 = int((bbox.xmin + bbox.width) * w)
                y2 = int((bbox.ymin + bbox.height) * h)

                x1, y1 = max(0, x1), max(0, y1)
                x2, y2 = min(w, x2), min(h, y2)

                face = frame[y1:y2, x1:x2]
                if face.size == 0:
                    continue

                # Predict emotions
                preds = model.predict(preprocess(face), verbose=0)[0]
                
                # Build emotion probabilities
                emotion_probs = {emotions[i]: float(preds[i] * 100) for i in range(len(emotions))}
                
                detection_result = {
                    'bbox': {'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2},
                    'emotions': emotion_probs
                }
                
                if mode == 'interest':
                    interest_pct, non_interest_pct = calculate_interest(preds)
                    detection_result['interest'] = float(interest_pct)
                    detection_result['non_interest'] = float(non_interest_pct)
                    detection_result['category'] = 'Interest' if interest_pct > non_interest_pct else 'Non-Interest'
                    detection_result['category_confidence'] = float(max(interest_pct, non_interest_pct))
                else:
                    idx = np.argmax(preds)
                    detection_result['primary_emotion'] = emotions[idx]
                    detection_result['confidence'] = float(preds[idx] * 100)
                    detection_result['color'] = EMOTION_COLORS[emotions[idx]]
                
                detections.append(detection_result)
        
        return jsonify({
            'success': True,
            'mode': mode,
            'detections': detections,
            'face_count': len(detections)
        }), 200
        
    except Exception as e:
        print(f"Error in emotion detection: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/toggle_mode', methods=['POST'])
def toggle_mode():
    """Toggle between individual and interest modes"""
    data = request.get_json()
    mode = data.get('mode', 'individual')
    return jsonify({
        'success': True,
        'mode': mode,
        'message': f'Mode set to {mode}'
    }), 200

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Emotion Detection API Server Starting...")
    print("="*60)
    print(f"📍 Server: http://localhost:5000")
    print(f"💚 Health Check: http://localhost:5000/health")
    print(f"🎭 Detect Endpoint: POST http://localhost:5000/detect_emotion")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
