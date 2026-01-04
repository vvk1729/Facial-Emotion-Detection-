# Quick Start Guide - LiveKit Meeting

## 🚀 Getting Started in 3 Steps

### 1️⃣ Get LiveKit Credentials (2 minutes)
Visit: **https://cloud.livekit.io**
- Sign up (free)
- Create a project
- Copy: API Key, API Secret, and WebSocket URL

### 2️⃣ Update .env File
Open `.env` and add your credentials:
```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxxx
LIVEKIT_API_SECRET=secretxxxxxxxxx
```

### 3️⃣ Start & Test
```bash
npm start
```

Visit: http://localhost:3000/livekit-meeting?room=test&name=YourName

## 📝 Meeting URL Format
```
http://localhost:3000/livekit-meeting?room=ROOM_NAME&name=YOUR_NAME
```

**Example:**
- Host creates: `?room=daily-standup&name=John`
- Others join: `?room=daily-standup&name=Sarah`

## 🌍 Share with Others

### Same WiFi (Local Testing):
1. Find your IP: Run `ipconfig` → Look for IPv4 Address (e.g., 192.168.1.5)
2. Share: `http://192.168.1.5:3000/livekit-meeting?room=test&name=Guest`

### Internet (Remote Users):
**✅ With LiveKit Cloud:** Already works! Just deploy your app or use ngrok:
```bash
ngrok http 3000
```
Share the ngrok URL: `https://abc123.ngrok.io/livekit-meeting?room=test&name=Guest`

## 👥 How Many Can Join?
- **LiveKit Free Tier:** 50 participants
- **LiveKit Pro:** 100+ participants  
- **Much better than PeerJS** (which only handles 4-5)

## 🎛️ Features
- ✅ Video & Audio
- ✅ Screen Sharing
- ✅ Mute/Unmute
- ✅ Camera On/Off
- ✅ Works on Mobile & Desktop
- ✅ Adaptive Quality

## ❓ Troubleshooting

**"Failed to connect"**
→ Check if `.env` has correct LiveKit credentials

**"No camera/microphone"**
→ Grant browser permissions when prompted

**"Others can't join"**
→ Make sure you're using the same room name

## 📚 Full Documentation
See `LIVEKIT_SETUP.md` for detailed instructions

---
**Ready to go!** 🎉
