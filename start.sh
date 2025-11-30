#!/bin/bash

# LokalDrive Quick Start Script
# Run this script to start the server with all necessary info

echo "🚀 Starting LokalDrive Server..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  WARNING: .env file not found!"
    echo "Please create .env file with your VITE_API_KEY"
    echo ""
    echo "Example:"
    echo "VITE_API_KEY=your_gemini_api_key_here"
    echo ""
    read -p "Press Enter to continue anyway, or Ctrl+C to cancel..."
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Get local IP address
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "Unable to detect")

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📱 LokalDrive - Local Network File Sharing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Starting servers..."
echo ""
echo "📍 Access URLs:"
echo ""
echo "   From this device:"
echo "   🔗 http://localhost:3000"
echo ""
echo "   From other devices (HP/Tablet/Laptop):"
echo "   🔗 http://$LOCAL_IP:3000"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Tips:"
echo "   - Make sure all devices are on the same WiFi"
echo "   - Share the link above to access from other devices"
echo "   - Press Ctrl+C to stop the server"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the servers
npm start

