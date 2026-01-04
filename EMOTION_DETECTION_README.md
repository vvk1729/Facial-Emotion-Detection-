# Emotion Detection Integration for Meeting Application

This integration adds real-time emotion detection to your video meeting application with two modes:
1. **Individual Emotion Detection** - Shows specific emotions (happy, sad, angry, etc.)
2. **Interest/Non-Interest Detection** - Categorizes emotions into Interest (happy, neutral, surprise) and Non-Interest (angry, disgust, fear, sad)

## 🎯 Features

- ✅ Real-time emotion detection during video meetings
- ✅ Toggle between Individual and Interest/Non-Interest modes
- ✅ Live overlay on video feed with emotion labels
- ✅ Percentage confidence scores
- ✅ Color-coded emotion indicators
- ✅ Flask API backend for Python model
- ✅ Node.js/Express integration
- ✅ Button controls in meeting interface

## 📋 Prerequisites

- Python 3.8+ installed
- Node.js 14+ installed
- MongoDB running
- Webcam access

## 🚀 Setup Instructions

### Step 1: Install Python Dependencies

```bash
cd C:\Users\HP\Desktop\gg
pip install -r requirements_emotion_api.txt
```

### Step 2: Install Node.js Dependencies

```bash
cd Meeting-Application-main\Meeting-Application-main
npm install
```

### Step 3: Start the Emotion Detection API (Flask)

Open a new terminal and run:

```bash
cd C:\Users\HP\Desktop\gg
python emotion_detection_api.py
```

You should see:
```
============================================================
🚀 Emotion Detection API Server Starting...
============================================================
📍 Server: http://localhost:5000
💚 Health Check: http://localhost:5000/health
🎭 Detect Endpoint: POST http://localhost:5000/detect_emotion
============================================================
```

### Step 4: Start the Node.js Meeting Application

Open another terminal and run:

```bash
cd C:\Users\HP\Desktop\gg\Meeting-Application-main\Meeting-Application-main
npm start
```

The meeting application will start on http://localhost:3000

### Step 5: Start the Meeting

1. Open browser and go to http://localhost:3000
2. Login or signup
3. Create a new meeting
4. Join the meeting

## 🎮 Using Emotion Detection

### In the Meeting Interface

You'll see two new buttons in the meeting controls:

1. **😊 Emotion Detection Button** (Smiley face icon)
   - Click to START/STOP emotion detection
   - Turns GREEN when active
   - Displays emotion overlays on your video

2. **📝 Mode Toggle Button** (Edit icon)
   - Click to switch between modes:
     - **Individual Mode**: Shows specific emotions with confidence %
     - **Interest Mode**: Shows Interest/Non-Interest categories with percentages

### Visual Indicators

**Individual Mode:**
- Green box = Happy
- Red box = Sad/Angry
- Purple box = Disgust
- Magenta box = Fear
- Gray box = Neutral
- Cyan box = Surprise

**Interest Mode:**
- Green box = Interest (happy, neutral, surprise)
- Red box = Non-Interest (angry, disgust, fear, sad)
- Shows both Interest % and Non-Interest %

## 🔧 Buttons in Meeting Application

### Bottom Control Bar Buttons:

1. **🎤 Microphone Button** - Mute/Unmute audio
2. **📹 Camera Button** - Turn video on/off
3. **😊 Emotion Detection** - Toggle emotion detection (NEW)
4. **📝 Mode Switch** - Switch detection mode (NEW)
5. **😀 Feedback Button** - Share feedback
6. **⚙️ Settings Button** - Video settings
7. **📞 Hang Up Button** - End the meeting

### Right Side Buttons:

1. **👥 Participants** - Show participants list
2. **🔊 Volume** - Adjust volume
3. **ℹ️ Information** - Show meeting info

## 📡 API Endpoints

### Flask API (Python - Port 5000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Check if service is running |
| `/detect_emotion` | POST | Detect emotions from base64 image |
| `/toggle_mode` | POST | Switch between individual/interest modes |

### Node.js API (Port 3000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/detect-emotion` | POST | Proxy to Flask emotion detection |
| `/emotion-service-health` | GET | Check emotion service health |

## 🎯 How It Works

1. **Video Capture**: JavaScript captures video frames from webcam every 500ms
2. **Frame Processing**: Converts frame to base64 and sends to Flask API
3. **Face Detection**: MediaPipe detects faces in the frame
4. **Emotion Analysis**: TensorFlow model predicts emotions for each face
5. **Mode Processing**:
   - **Individual**: Returns primary emotion with confidence
   - **Interest**: Calculates Interest vs Non-Interest percentages
6. **Display**: Overlays results on video with bounding boxes and labels

## 📊 Emotion Categories

### Interest Emotions (Positive Engagement):
- 😊 Happy
- 😐 Neutral
- 😮 Surprise

### Non-Interest Emotions (Negative Engagement):
- 😠 Angry
- 🤢 Disgust
- 😨 Fear
- 😢 Sad

## 🐛 Troubleshooting

### "Emotion detection service is not running"
- Make sure Flask server is running on port 5000
- Check: http://localhost:5000/health

### No emotion overlay appears
- Ensure webcam is enabled
- Click the Emotion Detection button (should turn green)
- Check browser console for errors (F12)

### Wrong emotions detected
- Ensure good lighting
- Face the camera directly
- Try switching modes

### Port conflicts
- Flask default: 5000 (change in emotion_detection_api.py)
- Node.js default: 3000 (change in index.js or .env)

## 📝 Configuration

### Change API Port (Flask)

Edit `emotion_detection_api.py`:
```python
app.run(host='0.0.0.0', port=5000, debug=True)  # Change 5000 to your port
```

Edit `meeting.ejs`:
```javascript
const EMOTION_API_URL = 'http://localhost:5000';  // Update port here too
```

### Adjust Detection Frequency

Edit `meeting.ejs`:
```javascript
emotionDetectionInterval = setInterval(captureFrameAndDetect, 500);  // 500ms = 0.5 seconds
```

## 🎨 Customization

### Change Emotion Colors

Edit `emotion_detection_api.py`:
```python
EMOTION_COLORS = {
    'happy': '#00FF00',     # Green
    'sad': '#FF0000',       # Red
    'angry': '#0000FF',     # Blue
    # Add your custom colors
}
```

### Adjust Interest Categories

Edit `emotion_detection_api.py`:
```python
INTEREST_EMOTIONS = {'happy', 'neutral', 'surprise', 'excited'}  # Add more
NON_INTEREST_EMOTIONS = {'angry', 'disgust', 'fear', 'sad', 'bored'}  # Add more
```

## 🔒 Security Notes

- CORS is enabled for local development
- For production, restrict CORS origins
- Add authentication to emotion detection endpoints
- Use HTTPS for video transmission

## 📚 Tech Stack

### Backend (Python)
- Flask - Web framework
- TensorFlow/Keras - Deep learning
- MediaPipe - Face detection
- OpenCV - Image processing

### Backend (Node.js)
- Express - Web framework
- Socket.io - Real-time communication
- MongoDB - Database

### Frontend
- EJS - Templating
- Tailwind CSS - Styling
- WebRTC - Video streaming

## 🎓 Model Information

- Model: CNN trained on FER2013 dataset
- Input: 128x128 RGB images
- Output: 7 emotion classes
- Accuracy: ~65-70% on test set

## 📄 License

This integration follows the same license as the original Meeting Application.

## 👨‍💻 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console (F12)
3. Check Flask server logs
4. Verify all services are running

---

**Happy Meeting! 😊🎉**
