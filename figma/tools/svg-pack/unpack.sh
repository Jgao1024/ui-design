#!/bin/sh
# 解开 Figma SVG 分类包（figma/svg-packed*/<kit>-<分类>.tar.zst）。
#
# 用法：
#   ./unpack.sh <包路径> <目标目录>          解开单包 → <目标目录>/<分类>/{svg,img}
#   ./unpack.sh --all <打包目录> <目标目录>  全部解开 → <目标目录>/<kit>/<分类>/{svg,img}
#
# 解出来的 svg 用 ../img/ 引用位图，两层必须保持同级，否则图会全丢。
set -eu

usage() { sed -n '2,9p' "$0" | sed 's/^# \{0,1\}//'; exit 1; }
[ $# -ge 2 ] || usage

if [ "$1" = "--all" ]; then
  [ $# -eq 3 ] || usage
  srcdir=$2; dest=$3
  [ -d "$srcdir" ] || { echo "没有这个目录: $srcdir" >&2; exit 1; }
  mkdir -p "$dest"
  for pkg in "$srcdir"/*.tar.zst; do
    [ -e "$pkg" ] || { echo "$srcdir 里没有 .tar.zst" >&2; exit 1; }
    name=$(basename "$pkg" .tar.zst)          # ios27-03-controls
    kit=${name%%-*}; cat=${name#*-}
    mkdir -p "$dest/$kit/$cat"
    tar --zstd -xf "$pkg" -C "$dest/$kit/$cat"
    echo "$kit/$cat"
  done
  exit 0
fi

pkg=$1; dest=$2
[ -f "$pkg" ] || { echo "没有这个包: $pkg" >&2; exit 1; }
name=$(basename "$pkg" .tar.zst)
cat=${name#*-}
mkdir -p "$dest/$cat"
tar --zstd -xf "$pkg" -C "$dest/$cat"
echo "$dest/$cat"
