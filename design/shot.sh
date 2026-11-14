#!/usr/bin/env bash
# Screenshots built pages into design/shots/, mirroring design/pages/.
#
# Usage: ./design/shot.sh ios27/12-materials-tokens/liquid-glass   one or more pages (no .html)
#        ./design/shot.sh ios27                                    every page of a kit
#
# Chrome runs headless with a window of WIDTH x HEIGHT; a taller page is cut off, so raise
# HEIGHT (default 2400) for long pages. Set CHROME to use another Chromium.
set -euo pipefail
cd "$(dirname "$0")"

CHROME=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
WIDTH=${WIDTH:-1280}
HEIGHT=${HEIGHT:-2400}
[ -x "$CHROME" ] || { echo "chrome not found: $CHROME" >&2; exit 1; }

targets() {
  for name in "$@"; do
    name=${name%.html}
    if [ -f "pages/$name.html" ]; then echo "pages/$name.html"
    elif [ -d "pages/$name" ]; then find "pages/$name" -name "*.html" ! -name index.html | sort
    else echo "no such page: $name" >&2
    fi
  done
}

PROFILE="$PWD/.chrome-tmp"
targets "$@" | while read -r file; do
  name=${file#pages/}; name=${name%.html}
  mkdir -p "shots/$(dirname "$name")"
  "$CHROME" --headless=new --no-sandbox --disable-gpu --disable-breakpad --disable-crash-reporter \
    --no-first-run --no-default-browser-check --hide-scrollbars --user-data-dir="$PROFILE" \
    --window-size="$WIDTH,$HEIGHT" --screenshot="$PWD/shots/$name.png" "file://$PWD/$file" 2>/dev/null
  echo "shots/$name.png"
done
