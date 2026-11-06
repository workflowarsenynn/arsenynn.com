#!/bin/zsh
# Создаёт публичный склад видео глав @arsenynn на GitHub Pages. Запускает владелец, один раз.
# Адрес файлов задан в src/content/stream/arsenynn.json.
set -e

MEDIA="$HOME/Library/Caches/claude-scratch/arsenynn-media"
REPO="workflowarsenynn/arsenynn-media"

cd "$MEDIA"
touch .nojekyll
git init -q -b main
git config http.postBuffer 1048576000
git add -A
git commit -q -m "Chapter videos for arsenynn.com"
gh repo create "$REPO" --public --description "Video files for arsenynn.com" --source=. --push
gh api -X POST "repos/$REPO/pages" -f 'source[branch]=main' -f 'source[path]=/'
echo "Готово: https://workflowarsenynn.github.io/arsenynn-media/0.1.mp4 (Pages включается за несколько минут)"
