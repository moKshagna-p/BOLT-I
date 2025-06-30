#!/bin/bash

# Auto-pull script for continuous synchronization
echo "🔄 Starting auto-pull monitor for BOLT-I fork..."
echo "📍 Monitoring: https://github.com/moKshagna-p/BOLT-I"
echo "⏱️  Check interval: 30 seconds"
echo "🛑 Press Ctrl+C to stop"
echo "----------------------------------------"

while true; do
    # Fetch latest changes from remote
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Checking for updates..."
    
    # Fetch remote changes without merging
    git fetch origin main 2>/dev/null
    
    # Check if local is behind remote
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    
    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "🆕 New changes detected! Pulling updates..."
        git pull origin main
        echo "✅ Successfully updated to latest version"
        echo "📊 Changes applied:"
        git log --oneline $LOCAL..$REMOTE
        echo "----------------------------------------"
    else
        echo "✅ Already up to date"
    fi
    
    # Wait 30 seconds before next check
    sleep 30
done 