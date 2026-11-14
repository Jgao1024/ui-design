#!/usr/bin/env bash
# Screenshots the connected iPhone every few seconds while someone operates it, and drops a
# frame when it looks the same as the last kept one. Stop with Ctrl-C. See docs/device-capture.md.
#
# Usage: ./design/device-watch.sh doubao dark        -> design/.ref/doubao/device/dark/raw/<time>.png
#        EVERY=3 THRESHOLD=1.5 DEVICE=<udid> ./design/device-watch.sh ...
#
# THRESHOLD is the mean pixel difference (0-255) below which two frames count as duplicates.
# The status bar (top 180 px) is ignored because its clock and battery always change.
set -euo pipefail
cd "$(dirname "$0")"

[ $# -eq 2 ] || { echo "usage: $0 <app> <dark|light>" >&2; exit 1; }
app=$1 mode=$2
EVERY=${EVERY:-3}
THRESHOLD=${THRESHOLD:-1.5}

if [ -z "${DEVICE:-}" ]; then
  DEVICE=$(xcrun devicectl list devices --json-output - 2>/dev/null | python3 -c '
import json, sys
for d in json.load(sys.stdin)["result"]["devices"]:
    if d["hardwareProperties"].get("reality") == "physical" and d["hardwareProperties"].get("platform") == "iOS":
        print(d["hardwareProperties"]["udid"]); break')
fi
[ -n "$DEVICE" ] || { echo "no paired iPhone found" >&2; exit 1; }

out="$PWD/.ref/$app/device/$mode/raw"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
mkdir -p "$out"

# A small grey thumbnail without the status bar, for comparing frames.
thumb() {
  local h w
  h=$(sips -g pixelHeight "$1" | awk '/pixelHeight/{print $2}')
  w=$(sips -g pixelWidth "$1" | awk '/pixelWidth/{print $2}')
  sips --cropOffset 180 0 -c $((h - 180)) "$w" "$1" --out "$tmp/crop.png" >/dev/null
  sips -s format bmp -z 120 54 "$tmp/crop.png" --out "$2" >/dev/null
}

diff_of() {
  python3 - "$1" "$2" <<'PY'
import sys
a, b = (open(p, "rb").read() for p in sys.argv[1:3])
start = int.from_bytes(a[10:14], "little")  # BMP pixel data offset
a, b = a[start:], b[start:]
print(f"{sum(abs(x - y) for x, y in zip(a, b)) / max(1, min(len(a), len(b))):.2f}")
PY
}

echo "capturing every ${EVERY}s into design/.ref/$app/device/$mode/raw (Ctrl-C to stop)"
while true; do
  name=$(date +%H%M%S)
  if xcrun devicectl device capture screenshot --device "$DEVICE" --destination "$tmp/new.png" -q 2>/dev/null; then
    thumb "$tmp/new.png" "$tmp/new.bmp"
    if [ -f "$tmp/last.bmp" ]; then
      d=$(diff_of "$tmp/last.bmp" "$tmp/new.bmp")
      if python3 -c "import sys; sys.exit(0 if $d < $THRESHOLD else 1)"; then
        echo "$name  same (diff $d)"
        sleep "$EVERY"; continue
      fi
    else
      d="-"
    fi
    mv "$tmp/new.png" "$out/$name.png"
    mv "$tmp/new.bmp" "$tmp/last.bmp"
    echo "$name  kept (diff $d)"
  fi
  sleep "$EVERY"
done
