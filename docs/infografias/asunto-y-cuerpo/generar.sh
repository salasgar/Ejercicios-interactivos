#!/bin/sh
# Pasa infografia.html a asunto-y-cuerpo.png con Chrome sin ventana.
cd "$(dirname "$0")"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1400,1440 --screenshot="$PWD/asunto-y-cuerpo.png" "file://$PWD/infografia.html"
