# Quick Start Script for Meeting Application with Emotion Detection

Write-Host "🚀 Starting Meeting Application with Emotion Detection..." -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found! Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Check if model file exists
$modelPath = "C:\Users\HP\Desktop\best_model.keras"
if (Test-Path $modelPath) {
    Write-Host "✓ Emotion detection model found" -ForegroundColor Green
} else {
    Write-Host "⚠ Warning: Model not found at $modelPath" -ForegroundColor Yellow
    Write-Host "  Please update MODEL_PATH in emotion_detection_service.py" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Cyan
Write-Host ""

# Start Python emotion detection service in background
Write-Host "1️⃣ Starting Python Emotion Detection Service (Port 5000)..." -ForegroundColor Yellow
Start-Process python -ArgumentList "emotion_detection_service.py" -NoNewWindow
Start-Sleep -Seconds 3

# Start Node.js application
Write-Host "2️⃣ Starting Node.js Meeting Application (Port 3000)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Gray
Write-Host ""

npm start
