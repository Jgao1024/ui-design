#!/usr/bin/env bash
# Screenshots the connected iPhone into design/.ref/<app>/device/<mode>/<name>.png, using the
# official CoreDevice tool (Xcode DeviceHub). No proxy is needed. See docs/device-capture.md.
#
# Usage: ./design/device-shot.sh doubao dark 01-home
#        DEVICE=<udid> ./design/device-shot.sh ...     pick a phone (default: first paired iPhone)
set -euo pipefail
cd "$(dirname "$0")"

[ $# -eq 3 ] || { echo "usage: $0 <app> <dark|light> <name>" >&2; exit 1; }
app=$1 mode=$2 name=$3

if [ -z "${DEVICE:-}" ]; then
  DEVICE=$(xcrun devicectl list devices --json-output - 2>/dev/null | python3 -c '
import json, sys
for d in json.load(sys.stdin)["result"]["devices"]:
    if d["hardwareProperties"].get("reality") == "physical" and d["hardwareProperties"].get("platform") == "iOS":
        print(d["hardwareProperties"]["udid"]); break')
fi
[ -n "$DEVICE" ] || { echo "no paired iPhone found" >&2; exit 1; }

out=".ref/$app/device/$mode"
mkdir -p "$out"
xcrun devicectl device capture screenshot --device "$DEVICE" --destination "$PWD/$out/$name.png" -q
echo "design/$out/$name.png"
