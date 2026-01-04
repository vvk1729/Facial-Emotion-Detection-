# 🚀 Quick Start Guide - All Services

## Option 1: Automated Startup (Recommended)

Simply run this one command to start everything:

```powershell
cd C:\Users\HP\Desktop\gg
.\start_all.ps1
```

This will automatically start:
- ✅ Python Emotion Detection API (Port 5000)
- ✅ Node.js Meeting Application (Port 3000)
- ✅ MongoDB (if not running)
- ✅ Cloudflared tunnel (optional)

---

## Option 2: Manual Startup

### Step 1: Start MongoDB

**Option A - As Windows Service:**
```powershell
net start MongoDB
```

**Option B - Manual:**
```powershell
mongod
```

### Step 2: Start Python Emotion API

Open **Terminal 1**:
```powershell
cd C:\Users\HP\Desktop\gg
python emotion_detection_api.py
```

Should show:
```
🚀 Emotion Detection API Server Starting...
📍 Server: http://localhost:5000
```

### Step 3: Start Node.js Meeting App

Open **Terminal 2**:
```powershell
cd C:\Users\HP\Desktop\gg\Meeting-Application-main\Meeting-Application-main
npm start
```

Should show:
```
Server (Main) running on port 3000
DB Connected
```

### Step 4: Start Cloudflared Tunnel (Optional)

Open **Terminal 3** (for public access):
```powershell
cloudflared tunnel --url http://localhost:3000
```

Should show a public URL like:
```
https://xyz123.trycloudflare.com
```

---

## 🌐 Access URLs

| Service | Local URL | Description |
|---------|-----------|-------------|
| **Meeting App** | http://localhost:3000 | Main application |
| **Emotion API** | http://localhost:5000 | Emotion detection service |
| **Health Check** | http://localhost:5000/health | API status |
| **Public Tunnel** | (see Terminal 3) | Cloudflared public URL |

---

## 📋 First-Time Setup Checklist

### Prerequisites Installation:

1. **Python 3.8+**
   ```powershell
   python --version
   ```

2. **Node.js 14+**
   ```powershell
   node --version
   ```

3. **MongoDB**
   - Download: https://www.mongodb.com/try/download/community
   - Install as Windows Service

4. **Python Packages**
   ```powershell
   cd C:\Users\HP\Desktop\gg
   pip install -r requirements_emotion_api.txt
   ```

5. **Node.js Packages**
   ```powershell
   cd C:\Users\HP\Desktop\gg\Meeting-Application-main\Meeting-Application-main
   npm install
   ```

6. **Cloudflared (Optional - for public access)**
   - Download: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
   - Or use: `winget install cloudflare.cloudflared`

---

## 🎯 Using the Application

### 1. Open Browser
```
http://localhost:3000
```

### 2. Create Account
- Click **Signup**
- Enter email and password
- Click **Create Account**

### 3. Start a Meeting
- Click **New Meeting**
- Or enter Meeting ID to join existing

### 4. Enable Emotion Detection
- Click **😊 Emotion Detection** button (turns green)
- Emotions appear on your video

### 5. Switch Detection Mode
- Click **📝 Mode Toggle** button
- Choose:
  - **Individual Mode** → Shows specific emotions
  - **Interest Mode** → Shows Interest/Non-Interest %

---

## 🛑 Stopping Services

### Automated Script:
- Close all PowerShell terminal windows
- Or press `Ctrl+C` in each terminal

### Manual:
1. **Python API**: Press `Ctrl+C` in Terminal 1
2. **Node.js App**: Press `Ctrl+C` in Terminal 2
3. **Cloudflared**: Press `Ctrl+C` in Terminal 3
4. **MongoDB** (if manually started): Press `Ctrl+C`

---

## 🐛 Troubleshooting

### Port Already in Use

**Port 3000 (Node.js):**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Port 5000 (Python):**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### MongoDB Not Connected
```powershell
# Check if MongoDB is running
Get-Process -Name mongod

# Start MongoDB service
net start MongoDB

# Or start manually
mongod
```

### Emotion API Not Responding
```powershell
# Test health endpoint
curl http://localhost:5000/health

# If fails, restart Python API
cd C:\Users\HP\Desktop\gg
python emotion_detection_api.py
```

### Webcam Not Working
- Check browser permissions (allow camera access)
- Close other apps using webcam (Zoom, Teams, etc.)
- Refresh browser page

---

## 🌍 Public Access with Cloudflared

### Install Cloudflared:
```powershell
winget install cloudflare.cloudflared
```

### Start Tunnel:
```powershell
cloudflared tunnel --url http://localhost:3000
```

### Share URL:
- Copy the `https://xyz.trycloudflare.com` URL
- Share with others
- They can access your meeting from anywhere!

**Note:** Free Cloudflare tunnels are temporary and change each time.

---

## 📊 Service Status Check

```powershell
# Check all services
Get-Process python, node, mongod

# Check ports
netstat -ano | findstr "3000 5000 27017"
```

---

## ⚙️ Configuration

### Change Ports

**Node.js App** - Edit [.env](Meeting-Application-main/Meeting-Application-main/.env):
```env
express_port=3000  # Change to your port
```

**Python API** - Edit [emotion_detection_api.py](emotion_detection_api.py):
```python
app.run(host='0.0.0.0', port=5000)  # Change to your port
```

**Update Meeting UI** - Edit [meeting.ejs](Meeting-Application-main/Meeting-Application-main/public/views/meeting.ejs):
```javascript
const EMOTION_API_URL = 'http://localhost:5000';  // Update if changed
```

---

## 📚 Documentation

- **[EMOTION_DETECTION_README.md](EMOTION_DETECTION_README.md)** - Complete emotion detection guide
- **[BUTTON_GUIDE.md](BUTTON_GUIDE.md)** - UI button reference
- **[Meeting App README](Meeting-Application-main/Meeting-Application-main/README.md)** - Original meeting app docs

---

## 🎓 Advanced Usage

### Custom Emotion Categories

Edit [emotion_detection_api.py](emotion_detection_api.py):
```python
INTEREST_EMOTIONS = {'happy', 'neutral', 'surprise'}  # Modify as needed
NON_INTEREST_EMOTIONS = {'angry', 'disgust', 'fear', 'sad'}
```

### Detection Frequency

Edit [meeting.ejs](Meeting-Application-main/Meeting-Application-main/public/views/meeting.ejs):
```javascript
emotionDetectionInterval = setInterval(captureFrameAndDetect, 500);  // milliseconds
```

### Database Change

Edit [.env](Meeting-Application-main/Meeting-Application-main/.env):
```env
# Local MongoDB
db_url=mongodb://localhost:27017/meeting-application

# Or MongoDB Atlas
db_url=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

---

## 🔒 Security Tips

- Don't commit `.env` files to Git
- Use strong passwords for production
- Enable HTTPS for public deployment
- Restrict CORS in production
- Use MongoDB authentication

---

**Happy Meeting with Emotion Detection! 🎉😊**

*For issues, check the troubleshooting section or review terminal logs*
