#!/usr/bin/env bash
# Deploy minilab-ui to the App Park on LAB_8GB.
# Edit on LAB-256; the binary (dist) is hosted on LAB_8GB, served by
# launchd com.minilab.control-ui (vite preview :4173) behind cloudflared
# at https://control.minilab.work. The build runs ON lab-8gb so the dist
# never travels between machines half-built.
set -Eeuo pipefail

SSH=/usr/bin/ssh
echo "== sync source =="
rsync -a --delete -e "$SSH" \
  --exclude node_modules --exclude dist --exclude .git \
  --exclude .DS_Store --exclude tsconfig.tsbuildinfo \
  "$(cd "$(dirname "$0")/.." && pwd)/" lab-8gb:minilab-ui/

echo "== build on lab-8gb (the spec gates run: validate:ui) =="
$SSH lab-8gb 'cd ~/minilab-ui && export PATH=/opt/homebrew/bin:$PATH && npm install --no-audit --no-fund --loglevel=error && npm run build' 

echo "== restart the keeper =="
$SSH lab-8gb 'launchctl kickstart -k gui/$(id -u)/com.minilab.control-ui'
sleep 3

echo "== verify both doors =="
$SSH lab-8gb 'curl -s -o /dev/null -w "local:4173 -> %{http_code}\n" http://127.0.0.1:4173/'
curl -s -o /dev/null -w "https://control.minilab.work -> %{http_code}\n" --max-time 20 https://control.minilab.work/
