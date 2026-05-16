#!/bin/bash
cd "$(dirname "$0")"
git add .
git commit -m "fix: improve portfolio upload, responsive design, and authentication"
git push origin main
echo "✅ Push completed!"
