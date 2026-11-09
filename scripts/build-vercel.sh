#!/usr/bin/env bash
# Produz os mesmos arquivos estáticos usados pelo GitHub Pages.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "[Aura] Reconstruindo vídeo de fundo"
cat media-source/hero-video/part-*.b64 | base64 --decode > site/assets/hero-background.mp4
test "$(wc -c < site/assets/hero-background.mp4 | tr -d ' ')" -eq 3704475
printf '%s\n' '2e0ea345cd5efcc9bd59859d298e36edc2db654e71d4e33412ab035b9b4f234c  site/assets/hero-background.mp4' | sha256sum -c -

echo "[Aura] Preparando fotografias do estúdio"
python3 -m venv /tmp/aura-vercel-python
/tmp/aura-vercel-python/bin/python -m pip install --disable-pip-version-check --quiet 'Pillow>=10,<13'
/tmp/aura-vercel-python/bin/python scripts/prepare_studio_images.py

test -s site/index.html
test -s site/assets/studio/studio-09.webp
echo "[Aura] Publicação pronta em ./site"
