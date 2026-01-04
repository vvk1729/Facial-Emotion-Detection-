import cv2
import numpy as np
import tensorflow as tf
import os
import h5py
import json
import mediapipe as mp

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

MODEL_PATH = r"C:\Users\HP\Desktop\gg\best_model_rgb (1).h5"
INPUT_SIZE = (128, 128)

emotions = ("angry", "disgust", "fear", "happy", "neutral", "sad", "surprise")

EMOTION_COLORS = {
    'angry': (0, 0, 255), 'disgust': (128, 0, 128), 'fear': (255, 0, 255),
    'happy': (0, 255, 0), 'neutral': (200, 200, 200), 'sad': (255, 0, 0),
    'surprise': (0, 255, 255)
}

print("Loading emotion model...")
import tf_keras as keras

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

# MediaPipe Face Detection
print("Loading face detector...")
mp_face = mp.solutions.face_detection
face_detection = mp_face.FaceDetection(min_detection_confidence=0.5, model_selection=0)
print("Face detector loaded ✅")

def preprocess(face):
    face = cv2.resize(face, INPUT_SIZE)
    face = face.astype("float32") / 255.0
    return np.expand_dims(face, axis=0)

cap = cv2.VideoCapture(0)
print("Press Q to quit")

while True:
    ret, frame = cap.read()
    if not ret:
        continue

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_detection.process(rgb)

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

            preds = model.predict(preprocess(face), verbose=0)[0]
            idx = np.argmax(preds)
            emotion = emotions[idx]
            conf = preds[idx] * 100
            color = EMOTION_COLORS[emotion]

            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            # percentage
            # cv2.putText(frame, f"{emotion} ({conf:.1f}%)", (x1, y1-10),
            #            cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
            cv2.putText(frame, f"{emotion}", (x1, y1-10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

    cv2.imshow("Emotion Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
face_detection.close()











