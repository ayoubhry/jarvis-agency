// ==============================================================================
// J.A.R.V.I.S. — AGENT OS LOCAL v3.0 SHOWCASE ENGINE
// Handles: Hardware Simulator, 17-Tools & HITL Filter, .env Configurator,
//          Installation Tabs, Copy Code, Interactive HUD Demo, Mobile Menu
// ==============================================================================

document.addEventListener("DOMContentLoaded", () => {
    initHardwareCalculator();
    initToolsCatalog();
    initEnvConfigurator();
    initInstallationTabs();
    initCopyButtons();
    initHeroDemo();
    initMobileMenu();
});

// ------------------------------------------------------------------------------
// 1. HARDWARE PROFILER & VRAM SIMULATOR (Ollama / LM Studio + Whisper CPU int8)
// ------------------------------------------------------------------------------
const HARDWARE_PRESETS = {
    mid_gpu: {
        badge: "CONFIGURATION ACTIVE RTX 3070 / 4060 (8 GO VRAM)",
        model: "qwen2.5:7b (Texte + UIA) ou qwen2.5vl:7b (Vision Unifiée)",
        desc: "qwen2.5:7b (~4,7 Go) répond instantanément avec UI Automation pour piloter les applications Windows. Pour l'analyse visuelle de captures mss, installez qwen2.5vl:7b (~5,6 Go) en 1 clic dans ⚙️ Config. Faster-Whisper reste sur CPU int8 (0 Mo VRAM).",
        speed: "55 - 75",
        vram: "4,7 - 5,6 Go",
        offload: "100% GPU + Whisper CPU",
        command: "ollama pull qwen2.5:7b   # ou qwen2.5vl:7b pour la Vision"
    },
    high_gpu: {
        badge: "HAUTE PERFORMANCE GPU (12 - 16 GO VRAM • RTX 4070 / 3080+)",
        model: "Architecture Hybride : qwen2.5vl:7b + qwen2.5:14b",
        desc: "Sépare FAST_MODEL et VISION_MODEL dans .env sans débordement mémoire : raisonnement complexe 14B et vision multimodale haute résolution simultanés dans la VRAM.",
        speed: "60 - 80",
        vram: "9,5 - 11 Go",
        offload: "100% GPU CUDA",
        command: "ollama pull qwen2.5vl:7b && ollama pull qwen2.5:14b"
    },
    low_gpu: {
        badge: "GPU COMPACT (4 - 6 GO VRAM • GTX 1650 / RTX 3050)",
        model: "qwen2.5vl:3b (Vision Unifiée Légère)",
        desc: "Modèle multimodal ultra-compact tenant intégralement dans 4 Go de VRAM avec OLLAMA_FLASH_ATTENTION=1. Idéal pour PC portables bureautiques avec petit GPU NVIDIA.",
        speed: "45 - 65",
        vram: "3,0 Go",
        offload: "100% GPU + CPU Whisper",
        command: "ollama pull qwen2.5vl:3b"
    },
    cpu_only: {
        badge: "PC PORTABLE SANS GPU DÉDIÉ (16 GO RAM)",
        model: "qwen2.5:3b (Mode Texte + UI Automation)",
        desc: "Sans GPU dédié, J.A.R.V.I.S. exploite l'arbre d'accessibilité Windows (UIA) via comtypes plutôt que les captures image afin de rester réactif sur processeur AVX2.",
        speed: "18 - 30",
        vram: "2,0 Go (RAM)",
        offload: "CPU Multi-Thread",
        command: "ollama pull qwen2.5:3b"
    }
};

function initHardwareCalculator() {
    const presetBtns = document.querySelectorAll(".preset-btn");
    const tierBadge = document.getElementById("calcTierBadge");
    const modelName = document.getElementById("calcModelName");
    const modelDesc = document.getElementById("calcModelDesc");
    const speed = document.getElementById("calcSpeed");
    const vram = document.getElementById("calcVramUsage");
    const offload = document.getElementById("calcOffload");
    const commandText = document.getElementById("calcCommandText");
    const btnCopy = document.getElementById("btnCopyCalcCmd");

    if (!presetBtns.length || !tierBadge) return;

    presetBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            presetBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const data = HARDWARE_PRESETS[btn.dataset.preset];
            if (!data) return;

            tierBadge.textContent = data.badge;
            modelName.textContent = data.model;
            modelDesc.textContent = data.desc;
            speed.textContent = data.speed;
            vram.textContent = data.vram;
            offload.textContent = data.offload;
            commandText.textContent = data.command;
        });
    });

    if (btnCopy) {
        btnCopy.addEventListener("click", () => {
            navigator.clipboard.writeText(commandText.textContent.trim()).then(() => {
                btnCopy.textContent = "✓ Copié !";
                setTimeout(() => { btnCopy.textContent = "📋 Copier"; }, 2000);
            });
        });
    }
}

// ------------------------------------------------------------------------------
// 2. TOOLS & SECURITY FILTER (17 Modular ReAct Tools)
// ------------------------------------------------------------------------------
function initToolsCatalog() {
    const filterChips = document.querySelectorAll(".profile-chip[data-filter]");
    const toolCards = document.querySelectorAll(".agent-card[data-category]");
    const activeCountEl = document.getElementById("activeToolsCount");

    if (!filterChips.length || !toolCards.length) return;

    function applyFilter(cat) {
        let visible = 0;
        toolCards.forEach((card) => {
            const match = cat === "all" || card.dataset.category === cat || card.dataset.risk === cat;
            card.style.display = match ? "flex" : "none";
            if (match) visible++;
        });
        if (activeCountEl) activeCountEl.textContent = String(visible);
    }

    filterChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            filterChips.forEach((c) => c.classList.remove("active"));
            chip.classList.add("active");
            applyFilter(chip.dataset.filter || "all");
        });
    });

    applyFilter("all");
}

// ------------------------------------------------------------------------------
// 3. LIVE .ENV & HITL PERMISSION CONFIGURATOR
// ------------------------------------------------------------------------------
function initEnvConfigurator() {
    const providerEl = document.getElementById("envProvider");
    const fastModelEl = document.getElementById("envFastModel");
    const visionModelEl = document.getElementById("envVisionModel");
    const permModeEl = document.getElementById("envPermMode");
    const ttsEl = document.getElementById("envTts");
    const cdpEl = document.getElementById("envCdp");
    const hideHudEl = document.getElementById("envHideHud");
    const topHudEl = document.getElementById("envTopHud");
    const outputEl = document.getElementById("envPreviewCode");
    const btnDownload = document.getElementById("btnDownloadEnv");
    const btnCopyEnv = document.getElementById("btnCopyEnv");

    if (!outputEl || !providerEl) return;

    function buildEnvText() {
        const prov = providerEl.value;
        const baseUrl = prov === "lmstudio" ? "http://127.0.0.1:1234/v1" : "http://127.0.0.1:11434/v1";
        const apiKey = prov === "lmstudio" ? "lm-studio" : "ollama";
        const fast = (fastModelEl.value || "qwen2.5:7b").trim();
        const vision = (visionModelEl.value || "qwen2.5vl:7b").trim();
        const perm = permModeEl.value;
        const tts = ttsEl.value;
        const cdp = (cdpEl.value || "").trim();
        const hideHud = hideHudEl.checked ? "true" : "false";
        const topHud = topHudEl.checked ? "true" : "false";

        return [
            `LLM_PROVIDER=${prov}`,
            `LLM_BASE_URL=${baseUrl}`,
            `LLM_API_KEY=${apiKey}`,
            ``,
            `# Modèles Fast & Vision (RTX 3070 8 Go)`,
            `FAST_MODEL=${fast}`,
            `VISION_MODEL=${vision}`,
            `LLM_TEMPERATURE=0.2`,
            `LLM_MAX_TOKENS=2048`,
            `LLM_TIMEOUT_SEC=120`,
            `MAX_REACT_STEPS=10`,
            ``,
            `# Perception Écran (mss < 30 ms + UIA)`,
            `VISION_MAX_WIDTH=1280`,
            `VISION_MAX_HEIGHT=720`,
            `VISION_JPEG_QUALITY=78`,
            `UIA_MAX_ELEMENTS=45`,
            ``,
            `# Voix Locale (STT CPU int8 = 0 Mo VRAM)`,
            `WHISPER_MODEL=tiny`,
            `WHISPER_DEVICE=cpu`,
            `WHISPER_COMPUTE_TYPE=int8`,
            `TTS_ENGINE=${tts}`,
            `PIPER_VOICE_PATH=`,
            ``,
            `# Sécurité HITL & HUD PyWebView`,
            `KILL_SWITCH_HOTKEY=<ctrl>+<shift>+x`,
            `HUD_ALWAYS_ON_TOP=${topHud}`,
            `HUD_HIDE_DURING_ACTION=${hideHud}`,
            `PERMISSION_MODE=${perm}`,
            ``,
            `# Navigateur Chrome CDP (Optionnel)`,
            `CHROME_CDP_URL=${cdp}`
        ].join("\n");
    }

    function refreshEnv() {
        outputEl.textContent = buildEnvText();
    }

    [providerEl, fastModelEl, visionModelEl, permModeEl, ttsEl, cdpEl, hideHudEl, topHudEl].forEach((el) => {
        if (!el) return;
        el.addEventListener("input", refreshEnv);
        el.addEventListener("change", refreshEnv);
    });

    if (btnDownload) {
        btnDownload.addEventListener("click", () => {
            const blob = new Blob([buildEnvText() + "\n"], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = ".env";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    if (btnCopyEnv) {
        btnCopyEnv.addEventListener("click", () => {
            navigator.clipboard.writeText(buildEnvText()).then(() => {
                btnCopyEnv.textContent = "✓ Copié !";
                setTimeout(() => { btnCopyEnv.textContent = "📋 Copier .env"; }, 2000);
            });
        });
    }

    refreshEnv();
}

// ------------------------------------------------------------------------------
// 4. INSTALLATION TABS SWITCHING
// ------------------------------------------------------------------------------
function initInstallationTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    if (!tabBtns.length) return;

    tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = "tab_" + btn.dataset.tab;
            tabBtns.forEach((b) => b.classList.remove("active"));
            tabContents.forEach((c) => c.classList.remove("active"));

            btn.classList.add("active");
            const targetEl = document.getElementById(targetId);
            if (targetEl) targetEl.classList.add("active");
        });
    });
}

// ------------------------------------------------------------------------------
// 5. COPY CODE BUTTONS
// ------------------------------------------------------------------------------
function initCopyButtons() {
    document.querySelectorAll(".code-box-clean, .terminal-copy-card").forEach((box) => {
        const header = box.querySelector(".code-box-header, .terminal-header");
        const code = box.querySelector("code");
        if (header && code && !box.querySelector(".btn-copy-code")) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "btn-copy-code";
            btn.textContent = "📋 Copier";
            btn.style.marginLeft = "auto";
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(code.innerText.trim()).then(() => {
                    btn.textContent = "✓ Copié !";
                    setTimeout(() => { btn.textContent = "📋 Copier"; }, 2000);
                });
            });
            header.style.display = "flex";
            header.style.alignItems = "center";
            header.appendChild(btn);
        }
    });
}

// ------------------------------------------------------------------------------
// 6. HERO HUD INTERACTIVE ROTATING DEMO (Agent OS ReAct + HITL + J.A.R.V.I.S.)
// ------------------------------------------------------------------------------
const DEMO_TURNS = [
    {
        user: "Ouvre Cisco Packet Tracer",
        badge: "Boucle ReAct • Étape 1/2",
        actionLogTitle: "Journal d'actions • Résolution raccourci Windows",
        actionLogDetail: "open_application(app_name=\"Cisco Packet Tracer\") → C:\\Users\\Public\\Desktop\\Cisco Packet Tracer.lnk",
        hitl: null,
        reply: "Cisco Packet Tracer est lancé. Tu veux que je t'aide à ouvrir un projet réseau en particulier ?"
    },
    {
        user: "Vérifie l'adresse IP et la passerelle par défaut du PC",
        badge: "Boucle ReAct + HITL • Étape 1/2",
        actionLogTitle: "Journal d'actions • Exécution PowerShell autorisée",
        actionLogDetail: "run_terminal_command(command=\"ipconfig | Select-String 'IPv4|Passerelle'\") → 192.168.1.42 / 192.168.1.1",
        hitl: "Action sensible : run_terminal_command",
        reply: "Ton poste est en 192.168.1.42 avec la passerelle par défaut sur 192.168.1.1."
    },
    {
        user: "Observe la fenêtre ouverte et enregistre le fichier en cours",
        badge: "Vision mss + UIA • Étape 1/2",
        actionLogTitle: "Journal d'actions • Capture WDA Exclu (24 ms)",
        actionLogDetail: "observe_screen() → press_hotkey(['ctrl', 's']) → Vérification post-action OK",
        hitl: null,
        reply: "C'est fait, ton fichier a bien été enregistré sur la fenêtre active."
    }
];

function initHeroDemo() {
    const chatBody = document.getElementById("heroChatBody");
    if (!chatBody) return;

    let currentTurn = 0;
    setInterval(() => {
        currentTurn = (currentTurn + 1) % DEMO_TURNS.length;
        const d = DEMO_TURNS[currentTurn];

        chatBody.style.opacity = "0";
        chatBody.style.transform = "translateY(4px)";
        chatBody.style.transition = "all 0.25s ease";

        setTimeout(() => {
            const hitlHtml = d.hitl
                ? `<div class="hitl-banner-demo">
                       <span>🛡️ <strong>Validation HITL :</strong> ${d.hitl}</span>
                       <span class="hitl-pills"><span class="hitl-btn-ok">✓ Autoriser</span><span class="hitl-btn-no">✕ Refuser</span></span>
                   </div>`
                : "";

            chatBody.innerHTML = `
                <div class="mockup-msg user">
                    <div class="msg-avatar-chip">👤</div>
                    <div class="msg-bubble">${d.user}</div>
                </div>
                <div class="mockup-msg assistant">
                    <div class="msg-avatar-chip">⚡</div>
                    <div class="msg-bubble">
                        <div class="auto-route-badge-demo">
                            <span class="bolt">●</span>
                            <span><strong>${d.badge}</strong></span>
                        </div>
                        ${hitlHtml}
                        <div class="action-log-preview">
                            <div class="action-log-head"><span>${d.actionLogTitle}</span><span>OK</span></div>
                            <div>${d.actionLogDetail}</div>
                        </div>
                        <p class="alert-success">${d.reply}</p>
                    </div>
                </div>
            `;
            chatBody.style.opacity = "1";
            chatBody.style.transform = "translateY(0)";
        }, 250);
    }, 6500);
}

// ------------------------------------------------------------------------------
// 7. MOBILE MENU
// ------------------------------------------------------------------------------
function initMobileMenu() {
    const toggle = document.getElementById("btnMobileToggle");
    const menu = document.getElementById("mobileNav");
    if (!toggle || !menu) return;

    function setOpen(open) {
        menu.hidden = !open;
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    }

    toggle.addEventListener("click", () => setOpen(menu.hidden));
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !menu.hidden) {
            setOpen(false);
            toggle.focus();
        }
    });
}
