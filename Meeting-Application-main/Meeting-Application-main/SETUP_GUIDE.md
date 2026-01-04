# How to Run Emotion Detection in Meeting Application

## Prerequisites
Make sure you have:
- ✅ Python 3.8+ installed
- ✅ Node.js installed
- ✅ The trained model `best_model_rgb.keras` in the project root

## Setup Steps

### 1. Copy the trained model
Copy the `best_model_rgb.keras` folder to the Meeting-Application-main directory:
```
Meeting-Application-main/
├── best_model_rgb.keras/
│   ├── config.json
│   ├── metadata.json
│   └── model.weights.h5
```

**Important:** The emotion detection service expects the model at this location.

### 2. Install Python Dependencies
Open PowerShell and navigate to the project directory:
```powershell
cd Meeting-Application-main
pip install -r requirements.txt
```

This will install:
- Flask (web server)
- Flask-CORS (cross-origin support)
- OpenCV (image processing)
- TensorFlow & Keras (deep learning)
- NumPy & Pillow (image handling)

### 3. Install Node.js Dependencies
If not already installed:
```powershell
npm install
```

### 4. Start the Python Emotion Detection Service
Open a **new PowerShell terminal** and run:
```powershell
cd Meeting-Application-main
python emotion_detection_service.py
```

You should see:
```
🚀 Starting Emotion Detection Service...
📦 Model path: C:\Users\HP\Downloads\Meeting-Application-main\Meeting-Application-main\best_model_rgb.keras
✓ Emotion detection model loaded successfully!
✓ Model input shape: (None, 128, 128, 3)
✓ Model output shape: (None, 7)

🎯 Emotion Detection Service is ready!
📡 Listening on http://localhost:5000
```

**Keep this terminal running!**

### 5. Start the Node.js Meeting Application
Open **another PowerShell terminal** and run:
```powershell
cd Meeting-Application-main
npm start
```

You should see:
```
Server started on port 3000
```

### 6. Access the Application
Open your browser and go to:
```
http://localhost:3000
```

## How to Use Emotion Detection

### For Participants (2x3 Grid View):

1. **Join a meeting** by clicking "Join Meeting"
2. Enter the room name and your name
3. Wait for host approval
4. Click "👥 All Members" button to see the **2x3 grid** showing all 6 participants
5. Click **"😊 Detect Emotion"** button
6. The system will:
   - Capture frames from all visible participants
   - Send them to the Python service
   - Display emotion labels on each participant's video
   - Show emotions like: 😊 Happy, 😢 Sad, 😠 Angry, 😲 Surprise, 😨 Fear, 🤢 Disgust, 😐 Neutral

### Grid Layout:
The participant view shows a **2x3 grid** (2 rows, 3 columns):
```
┌─────────┬─────────┬─────────┐
│ Person1 │ Person2 │ Person3 │
├─────────┼─────────┼─────────┤
│ Person4 │ Person5 │ Person6 │
└─────────┴─────────┴─────────┘
```

Each video frame will show:
- Participant name at the bottom
- **Emotion label at the top right** (appears for 10 seconds after detection)
- Example: `😊 HAPPY 95%`

## Features

### Multi-Person Detection
- ✅ Detects emotions for **all 6 participants** simultaneously
- ✅ Shows confidence percentage for each detection
- ✅ Automatic face detection using Haar Cascade
- ✅ RGB color image processing (128x128 resolution)

### Supported Emotions
1. 😊 **Happy** - Smiling, joyful expressions
2. 😢 **Sad** - Downcast, unhappy expressions
3. 😠 **Angry** - Frowning, aggressive expressions
4. 😲 **Surprise** - Wide-eyed, shocked expressions
5. 😨 **Fear** - Scared, anxious expressions
6. 🤢 **Disgust** - Repulsed, disgusted expressions
7. 😐 **Neutral** - Calm, expressionless

### View Modes
- **👤 Host Screen**: Shows only the host's video (fullscreen)
- **👥 All Members**: Shows 2x3 grid with all participants (best for emotion detection)

## Troubleshooting

### "Emotion detection service is not running"
- ✅ Make sure Python service is running on port 5000
- ✅ Check for error messages in the Python terminal
- ✅ Verify the model file exists

### "No face detected!"
- ✅ Ensure camera is enabled
- ✅ Make sure face is well-lit and visible
- ✅ Face should be looking toward the camera
- ✅ Try moving closer to the camera

### Model not loading
- ✅ Verify `best_model_rgb.keras` folder is in the project root
- ✅ Check that all three files are present (config.json, metadata.json, model.weights.h5)
- ✅ Make sure TensorFlow is properly installed

### Port conflicts
If port 5000 or 3000 is already in use:
- Change Python service port in `emotion_detection_service.py` (line: `app.run(host='0.0.0.0', port=5000)`)
- Change Node.js port in `index.js` or set environment variable `PORT`
- Update `EMOTION_SERVICE_URL` in `emotionController.js` if you change the Python port

## Technical Details

### Model Architecture
- **Input**: 128x128x3 (RGB images)
- **Architecture**: Custom CNN with:
  - 4 convolutional blocks
  - Batch normalization
  - MaxPooling
  - Global Average Pooling
  - Dropout (0.4)
  - Dense output layer (7 classes)
- **Output**: 7 emotion classes with confidence scores

### Image Processing Pipeline
1. Capture video frame from participant
2. Convert to base64 encoding
3. Send to Flask service
4. Decode and convert to RGB
5. Detect face using Haar Cascade
6. Crop and resize face to 128x128
7. Normalize pixels to [0, 1]
8. Run through CNN model
9. Return emotion with confidence
10. Display on participant's video

### Performance
- Detection time: ~0.5-1 second per participant
- All 6 participants: ~3-5 seconds total
- Emotion labels auto-hide after 10 seconds

## Files Created/Modified

### New Files:
- ✅ `emotion_detection_service.py` - Python Flask service for emotion detection

### Existing Files (already configured):
- ✅ `participant-meeting.html` - Multi-participant emotion detection
- ✅ `emotionController.js` - Node.js controller for emotion API
- ✅ `index.js` - Routes already configured
- ✅ `requirements.txt` - Python dependencies

## Quick Start Script

You can also use the provided `start.ps1` script:
```powershell
.\start.ps1
```

This will:
1. Check if model exists
2. Start Python service in the background
3. Wait 5 seconds for service to initialize
4. Start Node.js application

Enjoy your emotion-aware video meetings! 😊🎉
