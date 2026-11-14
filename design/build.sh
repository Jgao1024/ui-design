#!/usr/bin/env bash
# Builds design/system/<kit>/pages/**/*.tsx into design/pages/<kit>/**/*.html.
#
# Usage: ./design/build.sh            every kit
#        ./design/build.sh ios27      one kit (the iOS and macOS sessions never touch each other)
#
# Deno lives in design/.bin/ and its cache in design/.deno/, so nothing is installed globally.
# The first run needs network (Deno binary + npm:tailwindcss); HTTPS_PROXY defaults to the
# local proxy on 7897 when it is not already set.
set -euo pipefail
cd "$(dirname "$0")"

DENO=".bin/deno"
export HTTPS_PROXY="${HTTPS_PROXY:-http://127.0.0.1:7897}"
if [ ! -x "$DENO" ]; then
  version=$(curl -fsSL -x "$HTTPS_PROXY" https://dl.deno.land/release-latest.txt | tr -d '[:space:]')
  case "$(uname -m)" in
    arm64 | aarch64) target=aarch64-apple-darwin ;;
    x86_64) target=x86_64-apple-darwin ;;
    *) echo "unsupported architecture: $(uname -m)" >&2; exit 1 ;;
  esac
  mkdir -p .bin
  curl -fsSL -x "$HTTPS_PROXY" "https://dl.deno.land/release/$version/deno-$target.zip" -o .bin/deno.zip
  unzip -q -o .bin/deno.zip -d .bin
  rm .bin/deno.zip
  chmod +x "$DENO"
fi

export DENO_DIR="${DESIGN_DENO_DIR:-$PWD/.deno}"
exec "$PWD/$DENO" task build "$@"
