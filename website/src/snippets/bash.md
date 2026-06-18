```bash
#!/usr/bin/env bash
set -euo pipefail

PROJECT="astro-arborium"
LANGUAGES=(rust typescript bash yaml cpp java markdown)

build_all() {
  local start
  start=$(date +%s)

  for lang in "${LANGUAGES[@]}"; do
    echo "→ Compiling ${lang} grammar..."
    cargo build --release -p "@arborium/${lang}" || exit 1
  done

  echo "✓ Built ${#LANGUAGES[@]} grammars in $(( $(date +%s) - start ))s"
}

if [[ "${1:-}" == "--watch" ]]; then
  watchexec -e rs,js -- build_all
else
  build_all "$@"
fi
```
