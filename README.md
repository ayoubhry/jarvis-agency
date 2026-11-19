# ⚡ Jarvis Agency — Studio Multi-Agents IA 100% Local & Privé

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Platform: Windows | Android | Linux](https://img.shields.io/badge/Platform-Windows%20%7C%20Android%20%7C%20Linux-10b981.svg)]()
[![Model Backend: Ollama / Llama.cpp](https://img.shields.io/badge/Backend-Ollama%20%2F%20CUDA-blue.svg)]()
[![Privacy: 100% Offline](https://img.shields.io/badge/Privacy-100%25%20Offline-success.svg)]()

> **Faites tourner une escouade de 11 agents IA d'élite directement sur votre machine.**  
> Détection automatique du matériel, routage d'intention intelligent, exécutable Windows autonome (`.exe`) et application mobile native Android (`.apk`). Zéro abonnement, zéro fuite de données, 100% souverain.

---

## 🌐 Découvrir le site GitHub Pages
Le site web complet de présentation, avec le **simulateur de matériel en direct** et le **configurateur d'agents interactif**, est disponible dans le dossier [`/docs`](docs/index.html).

### 🚀 Activer GitHub Pages sur votre dépôt :
1. Allez dans les **Settings** de votre dépôt GitHub.
2. Cliquez sur l'onglet **Pages** (dans le menu de gauche).
3. Sous **Build and deployment > Source**, choisissez :
   - **Branch :** `main`
   - **Folder :** `/docs`
4. Cliquez sur **Save**. Votre site web sera immédiatement accessible à l'adresse :  
   `https://<votre-compte>.github.io/<nom-du-depot>/`

---

## 🏗️ Architecture & Base de Construction

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ÉCOSYSTÈME CLIENT                               │
│                                                                        │
│   [💻 Bureau Windows]               [📱 Smartphone Android]            │
│   JarvisAgency.exe (StandAlone)     JarvisAgency.apk / PWA (Wi-Fi)     │
└──────────────────┬───────────────────────────────┬─────────────────────┘
                   │                               │
                   ▼ (HTTP / SSE Streaming)        ▼ (LAN 0.0.0.0:9099)
┌────────────────────────────────────────────────────────────────────────┐
│                   SERVEUR BACKEND FASTAPI LOCAL                        │
│                                                                        │
│   • Auto-Routage d'Intention (0 ms de latence, zéro overhead VRAM)     │
│   • Streaming temps réel token par token (Server-Sent Events)          │
│   • Mémoire persistante relationnelle (SQLite)                         │
│   • Télémétrie GPU / VRAM en continu (NVIDIA NVML)                     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼ (API Ollama / Port 11434)
┌────────────────────────────────────────────────────────────────────────┐
│               MOTEUR D'INFÉRENCE MATÉRIELLE LOCALE                     │
│                                                                        │
│   [🎮 GPU Dédié (CUDA)]             [🖥️ CPU Bureautique (AVX2)]        │
│   RTX 3070 / 4060 / 4080            Intel Core / AMD Ryzen (RAM)       │
│   Modèles : Llama 3.1 8B (Q4)       Modèles : Phi-3.5 Mini / Llama 3B  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Auto-Détection Matérielle (Hardware Profiler)
Jarvis Agency est conçu pour être déployable sur n'importe quel ordinateur sans configuration manuelle fastidieuse :

| Configuration Matérielle | Modèle Recommandé | Consommation | Vitesse Estimée |
| :--- | :--- | :--- | :--- |
| **GPU Haute Fin (12 - 16 Go VRAM)** <br> *(RTX 4070 / 4080 / 3080)* | **Qwen 2.5 14B Instruct** (Q4) | ~9.2 Go VRAM | 65 - 85 tok/s |
| **GPU Standard (8 Go VRAM)** <br> *(RTX 3060 / 3070 / 4060)* | **Llama 3.1 8B Instruct** (Q4) | ~5.2 Go VRAM | 55 - 75 tok/s |
| **GPU Entrée de gamme (4 - 6 Go)** <br> *(GTX 1650/1660 / RTX 3050)* | **Phi-3.5 Mini 3.8B** (Q4) | ~2.8 Go VRAM | 45 - 65 tok/s |
| **CPU Uniquement (16 Go RAM)** <br> *(PC portable standard sans GPU)* | **Llama 3.2 3B / Qwen 1.5B** | ~1.8 Go RAM | 20 - 35 tok/s |

---

## 👥 Les 11 Agents Spécialisés

| Catégorie | Agent | Spécialité & Rôle |
| :--- | :--- | :--- |
| **⚡ Routage Dynamique** | **Auto** | Analyse en direct votre requête et attribue automatiquement la tâche à l'expert. |
| **🛡️ Cybersécurité & Audit** | **Sentinel** 🥷 | Détection des failles OWASP, pentest éthique, durcissement Active Directory/Linux. |
| | **Auditor** 🛡️ | Contrôle qualité de code, vérification de conformité et validation d'étapes. |
| **🌐 Réseaux & SISR** | **NetAdmin** 🌐 | VLAN 802.1Q, sous-réseaux CIDR, routage OSPF, analyse Wireshark, DHCP, DNS, Samba. |
| | **DevOps** ⚙️ | Administration Windows Server & Linux, scripts PowerShell/Bash, services systemctl. |
| **💻 Développement** | **Developer** 💻 | Ingénieur full-stack (Python, FastAPI, JS, Bash). Écriture et exécution de code. |
| | **Architect** 🏛️ | Schémas d'architecture Mermaid, modélisation UML, conception de systèmes évolutifs. |
| **📊 Données & Rédaction** | **Data Analyst** 📊 | Analyse de fichiers CSV, bases SQLite, tableaux comparatifs et statistiques. |
| | **Researcher** 🔍 | Synthèse documentaire approfondie, exploration de RFC et bases techniques. |
| | **Executive Writer** ✍️ | Rédaction de comptes-rendus de stage, fiches techniques et synthèses exécutives. |
| **🎖️ Stratégie & Veille** | **Captain** 🎖️ | Chef de projet suprême. Découpe les objectifs complexes et coordonne l'équipe. |
| | **Web Scout** 📡 | Veille technologique active, consultation de documentation officielle et recherche web. |

---

## 🚀 Installation Rapide

### Option 1 : Exécutable Windows Autonome (Recommandé)
1. Installez [Ollama](https://ollama.com).
2. Lancez le modèle de base :
   ```bash
   ollama run llama3.1:8b
   ```
3. Double-cliquez sur `JarvisAgency.exe`. L'application démarre immédiatement sur le port `9099`.

### Option 2 : Application Mobile Android (APK)
1. Installez [`JarvisAgency.apk`](docs/downloads/JarvisAgency.apk) sur votre smartphone.
2. Connectez votre téléphone au même réseau Wi-Fi que votre PC.
3. Entrez l'IP locale de votre ordinateur (affichée dans le menu **📱 Mobile & APK** du PC).

---

## 📜 Licence
Distribué sous licence **MIT**. Libre d'utilisation, de modification et de distribution.
Projet créé par **Ayoub** pour les étudiants en BTS SIO SISR et les passionnés d'IA souveraine.
