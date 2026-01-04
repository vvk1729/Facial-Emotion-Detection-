# Meeting Application Button Guide

## 🎮 Meeting Interface Control Buttons

### Bottom Control Bar (Center)
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [🎤]  [📹]  [😊]  [📝]  [😀]  [⚙️]  [📞 Hang Up]             │
│   1     2     3     4     5     6        7                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

1. **🎤 Microphone** - Mute/Unmute audio
   - Green = Unmuted
   - Red = Muted

2. **📹 Camera** - Turn video on/off
   - Green = Camera on
   - Red = Camera off

3. **😊 Emotion Detection** ⭐ NEW!
   - Click to START emotion detection
   - Green = Active (detecting emotions)
   - Gray = Inactive
   
4. **📝 Mode Toggle** ⭐ NEW!
   - Click to switch between:
     - Individual Emotions (default)
     - Interest/Non-Interest Mode
   - Orange = Interest mode
   - Gray = Individual mode

5. **😀 Feedback** - Share feedback

6. **⚙️ Settings** - Video settings

7. **📞 Hang Up** - End the meeting (RED button)

---

### Right Side Controls
```
┌──────┐
│ 👥  │  - Show participants
├──────┤
│ 🔊  │  - Adjust volume
├──────┤
│ ℹ️   │  - Meeting info
└──────┘
```

---

## 🎯 Emotion Detection Workflow

### Step-by-Step Usage:

**1. Start Meeting**
   - Join or create a meeting
   - Ensure camera is ON (📹 button should be green)

**2. Enable Emotion Detection**
   - Click the 😊 button
   - Button turns GREEN
   - Emotion overlay appears on your video

**3. Choose Detection Mode**
   - Click the 📝 button to toggle modes
   
   **Individual Mode (Default):**
   ```
   ┌─────────────────┐
   │  happy (85.3%)  │ ← Emotion label
   │                 │
   │                 │
   │   Your Face     │
   │                 │
   └─────────────────┘
   ```
   
   **Interest Mode:**
   ```
   ┌────────────────────────┐
   │  Interest (72.5%)      │ ← Category
   │                        │
   │   Your Face            │
   │                        │
   │  Interest: 72.5%       │ ← Breakdown
   │  Non-Interest: 27.5%   │
   └────────────────────────┘
   ```

**4. Real-Time Updates**
   - Emotions update every 0.5 seconds
   - Different colors for different emotions
   - Percentage shows confidence level

**5. Stop Detection**
   - Click 😊 button again
   - Button returns to gray
   - Overlay disappears

---

## 🎨 Emotion Color Codes

### Individual Mode Colors:

| Emotion  | Color   | RGB Code | Box Border |
|----------|---------|----------|------------|
| Happy    | Green   | #00FF00  | 🟢 Green   |
| Sad      | Red     | #FF0000  | 🔴 Red     |
| Angry    | Blue    | #0000FF  | 🔵 Blue    |
| Disgust  | Purple  | #800080  | 🟣 Purple  |
| Fear     | Magenta | #FF00FF  | 🟣 Magenta |
| Neutral  | Gray    | #C8C8C8  | ⚪ Gray    |
| Surprise | Cyan    | #00FFFF  | 🔵 Cyan    |

### Interest Mode Colors:

| Category      | Color | Box Border |
|---------------|-------|------------|
| Interest      | Green | 🟢 Green   |
| Non-Interest  | Red   | 🔴 Red     |

---

## 📊 Display Examples

### Example 1: Happy Face (Individual Mode)
```
Your Video Window:
┌─────────────────────────────┐
│ happy (87.2%)               │ ← Green label
│ ┌───────────────────────┐   │
│ │                       │   │
│ │    😊 Your Face       │   │ ← Green border
│ │                       │   │
│ └───────────────────────┘   │
└─────────────────────────────┘
```

### Example 2: Multiple Faces
```
Your Video Window:
┌──────────────────────────────────────┐
│ happy (85%)        sad (92%)         │
│ ┌──────────┐      ┌──────────┐      │
│ │ Person 1 │      │ Person 2 │      │
│ └──────────┘      └──────────┘      │
└──────────────────────────────────────┘
```

### Example 3: Interest Mode
```
Your Video Window:
┌─────────────────────────────────┐
│ Interest (68.5%)                │ ← Green label
│ ┌─────────────────────────┐     │
│ │                         │     │ ← Green border
│ │    😊 Your Face         │     │
│ │                         │     │
│ │  Interest: 68.5%        │     │ ← Breakdown
│ │  Non-Interest: 31.5%    │     │
│ └─────────────────────────┘     │
└─────────────────────────────────┘
```

---

## ⚡ Quick Reference

### Keyboard Shortcuts (if enabled):
- **Space** - Toggle emotion detection (if configured)
- **M** - Toggle mode (if configured)
- **Q** - Quit/Leave meeting

### Button States:

| Button | Off/Inactive | On/Active |
|--------|-------------|-----------|
| 😊 Emotion | Gray bg | 🟢 Green bg |
| 📝 Mode | Gray bg | 🟠 Orange bg (Interest mode) |
| 🎤 Audio | Normal | 🔴 Red (muted) |
| 📹 Video | Normal | 🔴 Red (off) |

---

## 🔄 Common Actions

### To Start Emotion Detection:
1. Click 😊 button
2. Wait for green indicator
3. See emotions appear on video

### To Switch Modes:
1. Click 📝 button
2. Alert shows current mode
3. Overlay updates immediately

### To Stop Everything:
1. Click 😊 button to stop detection
2. Click 📞 to leave meeting

---

## 💡 Tips

✅ **Best Practices:**
- Ensure good lighting for better detection
- Face the camera directly
- Keep face visible (no hands covering)
- Use in well-lit environment

⚠️ **Troubleshooting:**
- If no overlay appears → Check 😊 button is green
- If wrong emotions → Try better lighting
- If lag → Reduce detection frequency
- If no faces detected → Check camera angle

---

## 📱 Mobile/Tablet Support

The emotion detection buttons work on mobile devices:
- Touch to activate/deactivate
- May have slower performance
- Better on tablets than phones

---

**🎉 Enjoy your emotion-aware meetings!**
