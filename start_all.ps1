# ============================================================
# Emotion Detection Meeting Application - Complete Startup
# Starts: Python API, Node.js App, and optional Cloudflared
# ============================================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Emotion Detection Meeting Application   " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found! Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✓ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found! Please install Node.js 14+" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoRunning = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongoRunning) {
    Write-Host "✓ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠ MongoDB not detected. Starting MongoDB service..." -ForegroundColor Yellow
    try {
        net start MongoDB 2>&1 | Out-Null
        Write-Host "✓ MongoDB service started" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Could not start MongoDB. Please start it manually: mongod" -ForegroundColor Yellow
    }
}

# Check for Cloudflared
Write-Host "Checking Cloudflared (optional)..." -ForegroundColor Yellow
try {
    $cloudflaredVersion = cloudflared --version 2>&1
    $useCloudflared = Read-Host "Cloudflared detected. Start tunnel? (y/N)"
    if ($useCloudflared -eq "y" -or $useCloudflared -eq "Y") {
        $startTunnel = $true
        Write-Host "✓ Will start Cloudflared tunnel" -ForegroundColor Green
    } else {
        $startTunnel = $false
        Write-Host "⊘ Skipping Cloudflared" -ForegroundColor Gray
    }
} catch {
    $startTunnel = $false
    Write-Host "⊘ Cloudflared not installed (optional)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Starting Services...                     " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Start Flask Emotion Detection API
Write-Host "[1/3] Starting Python Emotion Detection API..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Python Emotion API Server' -ForegroundColor Green; cd '$PSScriptRoot'; python emotion_detection_api.py"
Write-Host "✓ Flask API starting on http://localhost:5000" -ForegroundColor Green
Start-Sleep -Seconds 3

# 2. Start Node.js Meeting Application
Write-Host "[2/3] Starting Node.js Meeting Application..." -ForegroundColor Cyan
$meetingPath = Join-Path $PSScriptRoot "Meeting-Application-main\Meeting-Application-main"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Node.js Meeting Application' -ForegroundColor Green; cd '$meetingPath'; npm start"
Write-Host "✓ Node.js server starting on http://localhost:3000" -ForegroundColor Green
Start-Sleep -Seconds 5

# 3. Start Cloudflared Tunnel (if selected)
if ($startTunnel) {
    Write-Host "[3/3] Starting Cloudflared Tunnel..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Cloudflared Tunnel' -ForegroundColor Magenta; cloudflared tunnel --url http://localhost:3000"
    Write-Host "✓ Cloudflared tunnel starting (check tunnel window for URL)" -ForegroundColor Green
    $tunnelEnabled = $true
} else {
    Write-Host "[3/3] Cloudflared tunnel skipped" -ForegroundColor Gray
    $tunnelEnabled = $false
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "   All Services Started Successfully! 🎉   " -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Local Access:" -ForegroundColor Cyan
Write-Host "   Emotion API:  http://localhost:5000" -ForegroundColor White
Write-Host "   Meeting App:  http://localhost:3000" -ForegroundColor White
if ($tunnelEnabled) {
    Write-Host "   Public URL:   Check Cloudflared window" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "🎯 Quick Start Guide:" -ForegroundColor Yellow
Write-Host "   1. Open browser to http://localhost:3000" -ForegroundColor White
Write-Host "   2. Signup/Login to create account" -ForegroundColor White
Write-Host "   3. Click 'New Meeting' to create a meeting" -ForegroundColor White
Write-Host "   4. Click 😊 button to enable emotion detection" -ForegroundColor White
Write-Host "   5. Click 📝 button to switch Interest/Individual mode" -ForegroundColor White
Write-Host ""
Write-Host "⚙️  Running Services:" -ForegroundColor Cyan
Write-Host "   • Python Emotion API (Terminal 1)" -ForegroundColor White
Write-Host "   • Node.js Meeting App (Terminal 2)" -ForegroundColor White
if ($tunnelEnabled) {
    Write-Host "   • Cloudflared Tunnel (Terminal 3)" -ForegroundColor White
}
Write-Host ""
Write-Host "Press any key to open browser..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open browser
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "✓ Browser opened!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 To Stop Services:" -ForegroundColor Yellow
Write-Host "   • Close all PowerShell terminal windows" -ForegroundColor White
Write-Host "   • Or press Ctrl+C in each terminal" -ForegroundColor White
Write-Host ""
