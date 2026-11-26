# ⚡ J.A.R.V.I.S. — Agent OS Local v3.0

> **Un Agent OS Windows 100 % local qui voit l'écran et agit réellement sur la machine.**  
> Capture instantanée `mss` + UI Automation, boucle ReAct asynchrone avec 17 outils modulaires, voix hors-ligne CPU (`Faster-Whisper` + `Piper` / `Windows SAPI5`), contrôle HITL et Kill Switch matériel (`Ctrl+Shift+X`). Zéro cloud, zéro fuite de données.

---

## 🌐 Site Vitrine (GitHub Pages / Local)

Ce dossier contient le site web complet refondu pour présenter **J.A.R.V.I.S. Agent OS Local v3.0** :

- `index.html` — Présentation Agent OS & aperçu interactif du HUD OLED
- `vision.html` — Virage architectural & cas d'usage quotidiens
- `architecture.html` — Modules `src/` (`core/`, `vision/`, `tools/`, `voice/`, `backend/`, `frontend/`)
- `materiel.html` — Simulateur GPU / VRAM & modèles (`qwen2.5:7b` / `qwen2.5vl:7b` / `qwen2.5vl:3b`)
- `outils.html` — Boucle ReAct, catalogue des 17 outils & générateur interactif de `.env` / sécurité HITL
- `installation.html` — Déploiement `JarvisAgency.exe`, lancement Python et build PyInstaller

---

## 🏗️ Vue d'ensemble de l'architecture

```text
IA Local/
├── JarvisAgency.exe   # Application Windows PyWebView autonome (~204 Mo)
├── .env               # Paramètres Ollama / LM Studio, modèles, voix et HITL
├── data/              # agency.db (SQLite WAL), macros.json, webview_cache, tts_cache
├── models/            # Poids locaux Ollama (ex: qwen2.5:7b, qwen2.5vl:7b)
└── src/
    ├── app.py         # Lanceur PyWebView séquentiel + cache WebView2 persistant
    ├── core/          # config.py, llm_client.py, react_loop.py, safety.py, hud_control.py
    ├── vision/        # screen.py (mss < 30 ms) + accessibility.py (UIA Z-order)
    ├── tools/         # 17 outils : desktop_tool, system_tool, browser_tool, macros_tool
    ├── voice/         # stt.py (Faster-Whisper CPU int8) + tts.py (Piper / SAPI5)
    ├── backend/       # FastAPI + WebSocket (/ws/agent), memory.py, telemetry.py (nvml.dll)
    └── frontend/      # Interface HUD OLED compacte & plein écran
```

---

## 🚀 Déploiement rapide

1. Installez [Ollama](https://ollama.com) et récupérez un modèle local (`ollama pull qwen2.5:7b`, ou `qwen2.5vl:7b` pour la Vision écran complète).
2. Double-cliquez sur `JarvisAgency.exe` : le serveur FastAPI (`127.0.0.1:9099`) démarre automatiquement avec Ollama pointé sur `models/`.
3. Utilisez `Ctrl+Espace` pour dicter à la voix (0 Mo VRAM) et `Ctrl+Shift+X` à tout moment pour déclencher l'arrêt d'urgence.

---

## 📜 Licence

Distribué sous licence **MIT** (`LICENSE`).
