#!/usr/bin/env bash
# Собирает копию dist/ с относительными путями для превью-артефакта claude.ai.
# Запуск: scripts/build-preview.sh <out-dir>   (после npm run build)
set -euo pipefail
out="${1:?usage: scripts/build-preview.sh <out-dir>}"
rm -rf "$out"
cp -r dist "$out"
rm -f "$out/CNAME" "$out/404.html"
# Имена с "_" зарезервированы сервисом артефактов.
mv "$out/_astro" "$out/fonts"
sed -i -E 's#(src|href)="/(logos|favicon|apple)#\1="\2#g; s#url\(/_astro/#url(fonts/#g' "$out/index.html"
echo "preview ready: $out"
