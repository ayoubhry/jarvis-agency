// ==============================================================================
// JARVIS AGENCY — GITHUB PAGES INTERACTIVE ENGINE
// Handles: Hardware Profiler, Team Configurator, Installation Tabs, Chat Demo
// ==============================================================================

document.addEventListener("DOMContentLoaded", () => {
    initHardwareCalculator();
    initAgentConfigurator();
    initInstallationTabs();
    initCopyButtons();
    initHeroDemo();
});

// ------------------------------------------------------------------------------
// 1. HARDWARE PROFILER & MODEL CALCULATOR
// ------------------------------------------------------------------------------
const HARDWARE_PRESETS = {
    high_gpu: {
        badge: "CONFIG HAUTE PERFORMANCE (GPU 12 - 16 GB VRAM)",
        model: "Qwen 2.5 14B Instruct (Q4_K_M)",
        desc: "Raisonnement de classe entreprise, maîtrise parfaite de l'architecture logicielle, pentest avancé et analyse multilingue complexe. Déchargement total sur vos cœurs Tensor.",
        speed: "65 - 85",
        vram: "9.2 Go",
        offload: "100% GPU CUDA",
        command: "ollama run qwen2.5:14b"
    },
    mid_gpu: {
        badge: "OPTIMAL POUR GPU 8GB (RTX 3070 / 4060 / LAPTOPS)",
        model: "Llama 3.1 8B Instruct (Q4_K_M)",
        desc: "L'équilibre parfait entre vitesse et intelligence. Spécialiste des scripts PowerShell, configurations réseau Cisco/Samba et analyse de sécurité sans saturation de VRAM.",
        speed: "55 - 75",
        vram: "5.2 Go",
        offload: "100% GPU CUDA",
        command: "ollama run llama3.1:8b"
    },
    low_gpu: {
        badge: "ENTRY LEVEL GPU (4 - 6 GB VRAM • GTX 1650/1660)",
        model: "Phi-3.5 Mini 3.8B / Qwen 2.5 3B",
        desc: "Modèle ultra-compact et percutant de Microsoft. Tourne avec une fluidité exceptionnelle même sur les ordinateurs portables équipés de cartes graphiques d'entrée de gamme.",
        speed: "45 - 65",
        vram: "2.8 Go",
        offload: "100% GPU CUDA",
        command: "ollama run phi3.5:latest"
    },
    cpu_only: {
        badge: "BUREAUTIQUE & CPU ONLY (16 GO RAM STANDARD)",
        model: "Llama 3.2 3B / Qwen 2.5 1.5B (Quantisé CPU)",
        desc: "Pour les ordinateurs sans carte graphique dédiée. L'inférence est exécutée sur les cœurs CPU via les instructions vectorielles AVX2 avec une consommation de mémoire minimale.",
        speed: "20 - 35",
        vram: "1.8 Go (RAM)",
        offload: "CPU Multi-Thread",
        command: "ollama run llama3.2:3b"
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

    presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            presetBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const key = btn.dataset.preset;
            const data = HARDWARE_PRESETS[key];
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
// 2. AGENTS CONFIGURATOR & PROFILE PRESETS
// ------------------------------------------------------------------------------
const PROFILE_PRESETS = {
    all: ["sentinel", "reviewer", "netadmin", "devops", "coder", "architect", "data_analyst", "researcher", "writer", "captain", "web_scout"],
    sisr: ["netadmin", "devops", "sentinel", "reviewer", "architect", "captain"],
    cyber: ["sentinel", "reviewer", "netadmin", "devops", "web_scout", "captain"],
    dev: ["coder", "architect", "reviewer", "devops", "data_analyst", "captain"],
    data: ["data_analyst", "researcher", "writer", "web_scout", "captain"]
};

function initAgentConfigurator() {
    const profileChips = document.querySelectorAll(".profile-chip");
    const agentCheckboxes = document.querySelectorAll(".agent-checkbox");
    const activeCountEl = document.getElementById("activeAgentsCount");
    const btnExportConfig = document.getElementById("btnExportConfig");

    function updateActiveCount() {
        let count = 0;
        agentCheckboxes.forEach(cb => {
            const card = cb.closest(".agent-card");
            if (cb.checked) {
                count++;
                if (card) card.classList.remove("disabled");
            } else {
                if (card) card.classList.add("disabled");
            }
        });
        if (activeCountEl) activeCountEl.textContent = count;
    }

    profileChips.forEach(chip => {
        chip.addEventListener("click", () => {
            profileChips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            const profile = chip.dataset.profile;
            const allowedList = PROFILE_PRESETS[profile] || PROFILE_PRESETS.all;

            agentCheckboxes.forEach(cb => {
                const agentKey = cb.dataset.agent;
                cb.checked = allowedList.includes(agentKey);
            });

            updateActiveCount();
        });
    });

    agentCheckboxes.forEach(cb => {
        cb.addEventListener("change", () => {
            // Uncheck any preset chip if manual edits are made
            profileChips.forEach(c => c.classList.remove("active"));
            updateActiveCount();
        });
    });

    if (btnExportConfig) {
        btnExportConfig.addEventListener("click", () => {
            const activeAgents = [];
            agentCheckboxes.forEach(cb => {
                if (cb.checked) {
                    const card = cb.closest(".agent-card");
                    const name = card.querySelector(".agent-name")?.textContent || cb.dataset.agent;
                    const role = card.querySelector(".agent-role")?.textContent || "";
                    const category = card.dataset.category || "";
                    activeAgents.push({
                        id: cb.dataset.agent,
                        name: name,
                        role: role,
                        category: category,
                        enabled: true
                    });
                }
            });

            const configJson = {
                app: "Jarvis Agency",
                version: "2.0",
                created_at: new Date().toISOString(),
                routing_mode: "auto",
                active_agents_count: activeAgents.length,
                agents: activeAgents
            };

            const blob = new Blob([JSON.stringify(configJson, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "agents_config.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    updateActiveCount();
}

// ------------------------------------------------------------------------------
// 3. INSTALLATION TABS SWITCHING
// ------------------------------------------------------------------------------
function initInstallationTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = "tab_" + btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            const targetEl = document.getElementById(targetId);
            if (targetEl) targetEl.classList.add("active");
        });
    });
}

// ------------------------------------------------------------------------------
// 4. COPY CODE BUTTONS
// ------------------------------------------------------------------------------
function initCopyButtons() {
    document.querySelectorAll(".code-box-clean, .terminal-copy-card").forEach(box => {
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
// 5. HERO CHAT INTERACTIVE ROTATING DEMO
// ------------------------------------------------------------------------------
const DEMO_TURNS = [
    {
        user: "Peux-tu analyser ce fichier de capture Wireshark capture.pcap et vérifier s'il y a une attaque de type ARP spoofing sur le VLAN 10 ?",
        agent: "NetAdmin",
        avatar: "🌐",
        category: "Réseaux & Systèmes (SISR)",
        text: "Analyse de la trame <code>capture.pcap</code> initiée. Détection des adresses MAC et broadcast ARP en cours sur le VLAN 10...",
        codeHeader: "Analyse Wireshark & Tshark",
        code: 'tshark -r capture.pcap -Y "arp.duplicate-address-frame" -T fields -e arp.src.proto_ipv4 -e arp.src.hw_mac',
        alert: "✓ <strong>Diagnostic :</strong> Détection de 2 réponses ARP conflictuelles pour l'IP passerelle <code>192.168.10.1</code>. Recommandation : activer le <strong>Dynamic ARP Inspection (DAI)</strong> sur le switch Cisco."
    },
    {
        user: "Fais l'audit de sécurité de ce script PowerShell d'intégration des utilisateurs Active Directory.",
        agent: "Sentinel",
        avatar: "🥷",
        category: "Cybersécurité & Audit",
        text: "Examen de conformité ANSSI & durcissement PowerShell en cours sur le script <code>New-AdUsers.ps1</code>...",
        codeHeader: "Vérification des vulnérabilités de credentials",
        code: 'Select-String -Path .\\New-AdUsers.ps1 -Pattern "ConvertTo-SecureString.*-AsPlainText"',
        alert: "⚠️ <strong>Vulnérabilité critique détectée :</strong> Le mot de passe initial est passé en clair dans les logs d'événements. Remplacement immédiat par un jeton d'authentification temporaire à usage unique."
    },
    {
        user: "Écris-moi une fonction asynchrone FastAPI pour streamer une réponse SSE token par token.",
        agent: "Developer",
        avatar: "💻",
        category: "Développement & Architecture",
        text: "Génération de la route FastAPI avec <code>StreamingResponse</code> et protocole <code>text/event-stream</code>...",
        codeHeader: "Endpoint FastAPI Asynchrone",
        code: '@app.post("/api/chat")\nasync def stream_chat(req: ChatRequest):\n    return StreamingResponse(event_generator(req), media_type="text/event-stream")',
        alert: "✓ <strong>Performance validée :</strong> Zéro mise en mémoire tampon (Buffer Flushing instantané) compatible avec tous les navigateurs et clients mobiles."
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
            chatBody.innerHTML = `
                <div class="mockup-msg user">
                    <div class="msg-avatar-chip">👤</div>
                    <div class="msg-bubble">
                        <strong>Consigne utilisateur :</strong> ${d.user}
                    </div>
                </div>

                <div class="mockup-msg assistant">
                    <div class="msg-avatar-chip">${d.avatar}</div>
                    <div class="msg-bubble">
                        <div class="auto-route-badge-demo">
                            <span class="bolt">⚡</span>
                            <span>Routage Automatique : <strong>${d.agent}</strong> • ${d.category}</span>
                        </div>
                        <p>${d.text}</p>
                        <div class="code-box-preview">
                            <div class="code-header"><span>${d.codeHeader}</span><span class="code-lang">powershell / python</span></div>
                            <code>${d.code}</code>
                        </div>
                        <p class="alert-success">${d.alert}</p>
                    </div>
                </div>
            `;
            chatBody.style.opacity = "1";
            chatBody.style.transform = "translateY(0)";
        }, 260);
    }, 7000);
}
