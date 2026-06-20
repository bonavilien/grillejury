const STORAGE_KEY = "jury-evaluation-2026";
const NOTE_SHORTCUTS = {
    "1": "Excellent",
    "2": "Bien",
    "3": "Moyen",
    "4": "Insuffisant"
};

const programmes = {
    bachelor: {
        title: "Attendus - Bachelor",
        description: "Candidats intéressés par l'actualité, l'entreprise et l'international. Ouverts d'esprit et curieux. Un projet défini n'est pas obligatoire.",
        promptContext: "Le candidat postule au programme Bachelor. Attentes : profil intéressé par l'actualité, l'entreprise et l'international. Fait preuve d'ouverture d'esprit et de curiosité. Un projet professionnel non défini est acceptable.",
        brochures: [{ label: "Brochure Bachelor", url: "https://brochure.kedge.edu/bachelor.pdf" }],
        hasRevelateur: false
    },
    ibba: {
        title: "Attendus - IBBA / EBP",
        description: "Motivation pour l'international, les langues et la multiculturalité. Curiosité, adaptabilité, maturité et ouverture d'esprit. L'absence d'expérience internationale n'est pas un frein.",
        promptContext: "Le candidat postule au programme IBBA / EBP. Attentes : forte motivation internationale, attrait pour les langues et la multiculturalité. Démontre de l'adaptabilité, de la maturité et une belle ouverture d'esprit. L'absence d'expérience internationale préalable n'est pas un obstacle.",
        brochures: [
            { label: "Brochure IBBA", url: "https://brochure.kedge.edu/ibba.pdf" },
            { label: "Brochure EBP", url: "https://brochure.kedge.edu/ebp.pdf" }
        ],
        hasRevelateur: false
    },
    pge: {
        title: "Attendus - Programme grande école",
        description: "Adéquation avec les valeurs de l'école : humilité, exigence, ouverture d'esprit, intégrité, engagement et inclusivité. Authenticité, cohérence du projet, sens de l'engagement et goût pour l'international.",
        promptContext: "Le candidat postule au Programme Grande Ecole. Attentes : adéquation avec les valeurs de l'école (humilité, exigence, ouverture d'esprit, intégrité, engagement, inclusivité). Recherche d'authenticité, cohérence du projet, sens de l'engagement et goût pour l'international. Le profil a passé l'épreuve du Révélateur avec les 5 cartes. Évalue sa capacité d'analyse sur cet exercice.",
        brochures: [{ label: "Brochure PGE", url: "https://brochure.kedge.edu/pge.pdf" }],
        hasRevelateur: true
    }
};

const models = [
    { label: "Gemini 3.5 Flash", value: "gemini-3.5-flash" }
];

const GENERATION_MAX_ATTEMPTS = 3;
const GENERATION_RETRY_DELAYS = [700, 1600];
const GENERATION_TIMEOUT_MS = 30000;

const criteresBase = [
    { group: "Parcours", label: "Académique (Prépa EC/BEL, lacunes ?)" },
    { group: "Parcours", label: "Expérience professionnelle (stage, travail d'été ?)" },
    { group: "Parcours", label: "International (déracinement ?)" },
    { group: "Posture", label: "Personnalité" },
    { group: "Posture", label: "Activités extrascolaires" },
    { group: "Posture", label: "RSE (engagements ?)" },
    { group: "Projet et fit", label: "Projet professionnel" },
    { group: "Projet et fit", label: "Connaissance école/programme" },
    { group: "Projet et fit", label: "Question bonus 1" }
];

const criteresRevelateur = [
    { nom: "Autoportrait (mot aléatoire)", img: "https://media.kedge.edu/revelateur/assets/revelateur/autoportrait-recto.png" },
    { nom: "Trait d'union (ODD)", img: "https://media.kedge.edu/revelateur/assets/revelateur/trait-union-recto.png" },
    { nom: "Trait d'action (action concrète)", img: "https://media.kedge.edu/revelateur/assets/revelateur/trait-action-recto.png" },
    { nom: "Trait de pensée (pour ou contre)", img: "https://media.kedge.edu/revelateur/assets/revelateur/trait-pensee-recto.png" },
    { nom: "Trait d'esprit (paradoxe)", img: "https://media.kedge.edu/revelateur/assets/revelateur/trait-esprit-recto.png" }
];

const pgeNotationCriteria = [
    {
        "label": "Carte Trait d'union - ODD",
        "objective": "Utiliser un ODD comme cadre structurant et transversal de réflexion, et mesurer la culture ODD.",
        "levels": [
            {
                "range": "1-2",
                "min": 1,
                "max": 2,
                "description": "Compréhension très limitée de l'ODD, carte peu ou pas mobilisée même avec aide."
            },
            {
                "range": "3-4",
                "min": 3,
                "max": 4,
                "description": "ODD compris de manière basique, mobilisé uniquement après sollicitation explicite du jury."
            },
            {
                "range": "5-6",
                "min": 5,
                "max": 6,
                "description": "Bonne compréhension générale, ODD utilisé de façon pertinente mais principalement sur invitation."
            },
            {
                "range": "7-8",
                "min": 7,
                "max": 8,
                "description": "ODD mobilisé spontanément à plusieurs moments, liens clairs avec le parcours ou les actions."
            },
            {
                "range": "9-10",
                "min": 9,
                "max": 10,
                "description": "ODD pleinement intégré comme fil conducteur naturel, mobilisé de manière autonome, transversale et structurante."
            }
        ]
    },
    {
        "label": "Carte Autoportrait",
        "objective": "Construire un récit personnel cohérent et réfléchi à partir d'un mot imposé.",
        "levels": [
            {
                "range": "1-2",
                "min": 1,
                "max": 2,
                "description": "Difficulté à s'approprier le mot, récit confus ou absence de pertinence avec la présentation."
            },
            {
                "range": "3-4",
                "min": 3,
                "max": 4,
                "description": "Lien établi avec le mot, mais discours descriptif et peu personnel."
            },
            {
                "range": "5-6",
                "min": 5,
                "max": 6,
                "description": "Récit clair et cohérent, mot utilisé correctement dans la présentation."
            },
            {
                "range": "7-8",
                "min": 7,
                "max": 8,
                "description": "Mot exploité spontanément pour structurer le récit personnel de manière réfléchie."
            },
            {
                "range": "9-10",
                "min": 9,
                "max": 10,
                "description": "Appropriation très fine et autonome du mot, carte autoportrait incarnée avec sens."
            }
        ]
    },
    {
        "label": "Carte Trait d'actions",
        "objective": "Illustrer ses idées par des actions concrètes, réelles ou projetées.",
        "levels": [
            {
                "range": "1-2",
                "min": 1,
                "max": 2,
                "description": "Actions absentes ou hors sujet, difficulté à utiliser la carte même avec aide."
            },
            {
                "range": "3-4",
                "min": 3,
                "max": 4,
                "description": "Actions évoquées de manière vague, mobilisation de la carte uniquement sur sollicitation."
            },
            {
                "range": "5-6",
                "min": 5,
                "max": 6,
                "description": "Actions concrètes et pertinentes, mais présentées surtout après relance du jury."
            },
            {
                "range": "7-8",
                "min": 7,
                "max": 8,
                "description": "Carte mobilisée spontanément pour illustrer des actions cohérentes et bien expliquées."
            },
            {
                "range": "9-10",
                "min": 9,
                "max": 10,
                "description": "Utilisation très autonome et stratégique, actions structurées, impactantes et reliées aux enjeux."
            }
        ]
    },
    {
        "label": "Carte Trait de pensée",
        "objective": "Prendre position et argumenter de manière logique et nuancée.",
        "levels": [
            {
                "range": "1-2",
                "min": 1,
                "max": 2,
                "description": "Position floue, arguments faibles, difficulté à entrer dans l'exercice même avec aide."
            },
            {
                "range": "3-4",
                "min": 3,
                "max": 4,
                "description": "Position identifiable après guidance, argumentation limitée ou déséquilibrée."
            },
            {
                "range": "5-6",
                "min": 5,
                "max": 6,
                "description": "Argumentation structurée, mais développée principalement à partir des relances du jury."
            },
            {
                "range": "7-8",
                "min": 7,
                "max": 8,
                "description": "Carte mobilisée spontanément, prise de position claire, arguments solides et nuancés."
            },
            {
                "range": "9-10",
                "min": 9,
                "max": 10,
                "description": "Excellente autonomie argumentative, raisonnement critique fin, débat enrichi au-delà de l'énoncé."
            }
        ]
    },
    {
        "label": "Carte Trait d'esprit",
        "objective": "Réagir avec adaptabilité et vivacité intellectuelle face à un paradoxe ou oxymore.",
        "levels": [
            {
                "range": "1-2",
                "min": 1,
                "max": 2,
                "description": "Blocage ou incompréhension, besoin d'un accompagnement fort du jury."
            },
            {
                "range": "3-4",
                "min": 3,
                "max": 4,
                "description": "Compréhension partielle du paradoxe, réaction hésitante malgré des relances."
            },
            {
                "range": "5-6",
                "min": 5,
                "max": 6,
                "description": "Réponse pertinente mais prudente, construite essentiellement à partir des questions du jury."
            },
            {
                "range": "7-8",
                "min": 7,
                "max": 8,
                "description": "Réaction spontanée, compréhension rapide du paradoxe, réflexion fluide."
            },
            {
                "range": "9-10",
                "min": 9,
                "max": 10,
                "description": "Très grande vivacité d'esprit, paradoxe reformulé et utilisé pour nourrir une réflexion riche."
            }
        ]
    },
    {
        "label": "Qualité oratoire",
        "levels": [
            {
                "range": "1-3",
                "min": 1,
                "max": 3,
                "description": "Expression confuse, vocabulaire limité, discours difficile à suivre, manque d'aisance."
            },
            {
                "range": "4-6",
                "min": 4,
                "max": 6,
                "description": "Expression globalement claire, vocabulaire correct, quelques hésitations ou maladresses."
            },
            {
                "range": "7-8",
                "min": 7,
                "max": 8,
                "description": "Discours fluide et structuré, vocabulaire précis, bonne présence et capacité à capter l'attention."
            },
            {
                "range": "9-10",
                "min": 9,
                "max": 10,
                "description": "Excellente maîtrise orale, grande clarté, aisance naturelle, discours engageant et convaincant."
            }
        ]
    },
    {
        "label": "Esprit d'analyse",
        "levels": [
            {
                "range": "1-3",
                "min": 1,
                "max": 3,
                "description": "Raisonnement peu structuré, idées juxtaposées, difficultés à identifier les enjeux."
            },
            {
                "range": "4-6",
                "min": 4,
                "max": 6,
                "description": "Analyse correcte mais partielle, structuration présente mais parfois incomplète."
            },
            {
                "range": "7-8",
                "min": 7,
                "max": 8,
                "description": "Problématique bien décomposée, arguments logiques et cohérents, raisonnement maîtrisé."
            },
            {
                "range": "9-10",
                "min": 9,
                "max": 10,
                "description": "Analyse très rigoureuse, articulation fine des idées, excellente cohérence logique."
            }
        ]
    },
    {
        "label": "Pensée critique",
        "levels": [
            {
                "range": "1-3",
                "min": 1,
                "max": 3,
                "description": "Discours descriptif ou convenu, peu de recul, absence de questionnement."
            },
            {
                "range": "4-6",
                "min": 4,
                "max": 6,
                "description": "Premiers questionnements, certaines nuances, mais réflexion encore limitée."
            },
            {
                "range": "7-8",
                "min": 7,
                "max": 8,
                "description": "Prise de recul claire, remise en question des évidences, jugement argumenté et nuancé."
            },
            {
                "range": "9-10",
                "min": 9,
                "max": 10,
                "description": "Pensée très mature, capacité à problématiser, forte nuance, reconnaissance de la complexité."
            }
        ]
    },
    {
        "label": "Esprit concret",
        "levels": [
            {
                "range": "1-3",
                "min": 1,
                "max": 3,
                "description": "Discours abstrait, peu relié à la réalité, absence d'exemples ou de solutions."
            },
            {
                "range": "4-6",
                "min": 4,
                "max": 6,
                "description": "Quelques exemples concrets, propositions parfois générales ou peu opérationnelles."
            },
            {
                "range": "7-8",
                "min": 7,
                "max": 8,
                "description": "Bon ancrage dans le réel, exemples pertinents, propositions réalistes et applicables."
            },
            {
                "range": "9-10",
                "min": 9,
                "max": 10,
                "description": "Excellente capacité de projection, solutions très concrètes, faisables et contextualisées."
            }
        ]
    },
    {
        "label": "Motivation à intégrer le PGE",
        "levels": [
            {
                "range": "1-3",
                "min": 1,
                "max": 3,
                "description": "Motivation floue ou générique, méconnaissance du PGE ou réponses stéréotypées."
            },
            {
                "range": "4-6",
                "min": 4,
                "max": 6,
                "description": "Motivation réelle mais encore générale, liens partiels avec le PGE, arguments peu approfondis."
            },
            {
                "range": "7-8",
                "min": 7,
                "max": 8,
                "description": "Motivation claire et cohérente, bonne compréhension du PGE, articulation pertinente avec le projet personnel."
            },
            {
                "range": "9-10",
                "min": 9,
                "max": 10,
                "description": "Motivation très solide, réfléchie et incarnée, excellente connaissance du PGE et fort alignement."
            }
        ]
    }
];

const state = {
    programme: "bachelor",
    candidateName: "",
    candidateOrigin: "",
    result: "",
    modelName: models[0].value,
    darkMode: false,
    lastSavedAt: null,
    evaluations: {}
};

let temps = 0;
let intervalChrono = null;
const elements = {};

function cacheElements() {
    Object.assign(elements, {
        root: document.documentElement,
        body: document.body,
        infoTitle: document.getElementById("info-title"),
        infoDesc: document.getElementById("info-desc"),
        infoLinks: document.getElementById("info-links"),
        evaluation: document.getElementById("evaluation"),
        candidateName: document.getElementById("candidate-name"),
        candidateOrigin: document.getElementById("candidate-origin"),
        result: document.getElementById("result"),
        resultOutput: document.getElementById("result-output"),
        apiForm: document.getElementById("api-form"),
        apiKey: document.getElementById("api-key"),
        modelName: document.getElementById("model-name"),
        status: document.getElementById("status-message"),
        saveState: document.getElementById("save-state"),
        themeToggle: document.getElementById("theme-toggle"),
        helpToggle: document.getElementById("help-toggle"),
        helpPanel: document.getElementById("api-help"),
        generateSummary: document.getElementById("generate-summary"),
        retrySummary: document.getElementById("retry-summary"),
        nextCandidate: document.getElementById("next-candidate"),
        generationReadiness: document.getElementById("generation-readiness"),
        confirmDialog: document.getElementById("confirm-dialog"),
        confirmTitle: document.getElementById("confirm-title"),
        confirmMessage: document.getElementById("confirm-message"),
        confirmCancel: document.getElementById("confirm-cancel"),
        confirmAccept: document.getElementById("confirm-accept"),
        chrono: document.getElementById("chrono")
    });
}

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed, {
            evaluations: parsed.evaluations || {},
            programme: programmes[parsed.programme] ? parsed.programme : "bachelor",
            modelName: models.some((model) => model.value === parsed.modelName) ? parsed.modelName : models[0].value
        });
    } catch {
        localStorage.removeItem(STORAGE_KEY);
    }
}

function saveState() {
    state.lastSavedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    renderSaveState();
}

function setStatus(message, canRetry = false) {
    elements.status.textContent = message;
    elements.retrySummary.hidden = !canRetry;
}

function updateGenerationReadiness(isGenerating = false) {
    if (!elements.generationReadiness || !elements.generateSummary) return;

    const hasApiKey = Boolean(elements.apiKey.value.trim());
    elements.generateSummary.disabled = isGenerating || !hasApiKey;
    elements.generateSummary.textContent = isGenerating ? "Génération..." : "Créer la synthèse";
    elements.generationReadiness.textContent = hasApiKey
        ? "Prêt à générer avec la clé renseignée."
        : "Clé API requise pour générer.";
    elements.generationReadiness.dataset.state = isGenerating ? "loading" : hasApiKey ? "ready" : "missing";
}

function requestConfirmation({ title, message, acceptLabel = "Confirmer", danger = true }) {
    return new Promise((resolve) => {
        if (!elements.confirmDialog?.showModal) {
            resolve(window.confirm(message));
            return;
        }

        elements.confirmTitle.textContent = title;
        elements.confirmMessage.textContent = message;
        elements.confirmAccept.textContent = acceptLabel;
        elements.confirmAccept.className = danger ? "btn-danger" : "btn-primary";

        const cleanup = (result) => {
            elements.confirmCancel.removeEventListener("click", onCancel);
            elements.confirmAccept.removeEventListener("click", onAccept);
            elements.confirmDialog.removeEventListener("cancel", onCancel);
            if (elements.confirmDialog.open) elements.confirmDialog.close();
            resolve(result);
        };

        const onCancel = () => cleanup(false);
        const onAccept = () => cleanup(true);

        elements.confirmCancel.addEventListener("click", onCancel, { once: true });
        elements.confirmAccept.addEventListener("click", onAccept, { once: true });
        elements.confirmDialog.addEventListener("cancel", onCancel, { once: true });
        elements.confirmDialog.showModal();
    });
}

function renderSaveState() {
    if (!elements.saveState) return;
    if (!state.lastSavedAt) {
        elements.saveState.textContent = "Non enregistré";
        return;
    }

    const savedAt = new Date(state.lastSavedAt);
    const time = savedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    elements.saveState.textContent = `Enregistré localement à ${time}`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function normaliseGeneratedJson(text) {
    const trimmed = text.trim();
    const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    return fenced ? fenced[1].trim() : trimmed;
}

function parseGeneratedResult(text) {
    if (!text.trim()) return null;

    try {
        const parsed = JSON.parse(normaliseGeneratedJson(text));
        if (parsed && typeof parsed === "object") return parsed;
    } catch {
        return null;
    }

    return null;
}

function renderFallbackResult(text) {
    return `<article class="result-section">
            <h3>Synthèse</h3>
            <p>${escapeHtml(text).replaceAll("\n", "<br>")}</p>
        </article>`;
}

function renderStructuredResult(text) {
    if (!elements.resultOutput) return;

    if (!text.trim()) {
        elements.resultOutput.innerHTML = '<p class="result-empty">L\'appréciation finale apparaîtra ici.</p>';
        return;
    }

    const parsed = parseGeneratedResult(text);
    if (!parsed) {
        elements.resultOutput.innerHTML = renderFallbackResult(text);
        return;
    }

    const appreciation = parsed.appreciation || parsed["Appréciation"] || "";
    const scores = Array.isArray(parsed.scores) ? parsed.scores : [];
    const globalRange = parsed.globalRange || parsed.fourchetteGlobale || "";

    let html = "";
    if (appreciation) {
        html += `<article class="result-section result-appreciation">
                <h3>Appréciation générale</h3>
                <p>${escapeHtml(appreciation)}</p>
            </article>`;
    }

    if (scores.length) {
        html += `<article class="result-section">
                <h3>Notation PGE estimée</h3>
                <div class="score-output-list">
                    ${scores.map((score) => `
                        <section class="score-output-item">
                            <div>
                                <h4>${escapeHtml(score.criterion || score.critere || "Critère")}</h4>
                                <p>${escapeHtml(score.justification || "Justification non fournie.")}</p>
                            </div>
                            <strong>${escapeHtml(score.range || score.fourchette || "Non estimable")}</strong>
                        </section>
                    `).join("")}
                </div>
            </article>`;
    }

    if (globalRange) {
        html += `<article class="result-section result-global-score">
                <h3>Fourchette globale estimée PGE</h3>
                <strong>${escapeHtml(globalRange)}</strong>
            </article>`;
    }

    elements.resultOutput.innerHTML = html || renderFallbackResult(text);
}

function renderModelOptions() {
    elements.modelName.innerHTML = models.map((model) => `<option value="${model.value}">${model.label}</option>`).join("");
    elements.modelName.value = state.modelName;
}

function renderInfo() {
    const programme = programmes[state.programme];
    elements.infoTitle.textContent = programme.title;
    elements.infoDesc.textContent = programme.description;
    elements.infoLinks.innerHTML = programme.brochures
        .map((brochure) => `<a href="${brochure.url}" target="_blank" rel="noreferrer">${brochure.label}</a>`)
        .join("");
}

function renderTabs() {
    document.querySelectorAll("[data-programme]").forEach((tab) => {
        const isActive = tab.dataset.programme === state.programme;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
    });

    elements.root.classList.toggle("theme-pge", state.programme === "pge");
}

function evaluationKey(type, index) {
    return `${type}_${index}`;
}

function getEvaluation(type, index) {
    return state.evaluations[evaluationKey(type, index)] || { note: "", score: "", comment: "" };
}

function renderCriteriaRow(sujet, index, type, imgSrc = null) {
    const saved = getEvaluation(type, index);
    const selectId = `app-${type}-${index}`;
    const commentId = `com-${type}-${index}`;
    const imgHtml = imgSrc ? `<img src="${imgSrc}" class="card-icon" alt="" loading="lazy" onerror="this.hidden=true">` : "";
    const noteState = saved.note || "Non noté";

    return `
        <div class="grid-row" data-row-type="${type}" data-row-index="${index}" data-note="${escapeHtml(noteState)}">
            <div class="topic">${imgHtml}<span>${sujet}</span></div>
            <div class="field">
                <label for="${selectId}">Note</label>
                <select id="${selectId}" data-eval-type="${type}" data-eval-index="${index}" data-eval-field="note">
                    <option value="">Non noté</option>
                    <option value="Excellent" ${saved.note === "Excellent" ? "selected" : ""}>Excellent</option>
                    <option value="Bien" ${saved.note === "Bien" ? "selected" : ""}>Bien</option>
                    <option value="Moyen" ${saved.note === "Moyen" ? "selected" : ""}>Moyen</option>
                    <option value="Insuffisant" ${saved.note === "Insuffisant" ? "selected" : ""}>Insuffisant</option>
                </select>
            </div>
            <div class="field">
                <label for="${commentId}">Commentaire</label>
                <input type="text" id="${commentId}" value="${escapeHtml(saved.comment)}" data-eval-type="${type}" data-eval-index="${index}" data-eval-field="comment" placeholder="Observation factuelle">
            </div>
        </div>
    `;
}

function getProgress(criteria, type) {
    const noted = criteria.filter((_, index) => getEvaluation(type, index).note).length;
    return `${noted}/${criteria.length} notés`;
}

function updateProgressIndicators() {
    const baseProgress = document.getElementById("base-progress");
    if (baseProgress) {
        baseProgress.textContent = `${getProgress(criteresBase, "base")}`;
    }

    const revelateurProgress = document.getElementById("revelateur-progress");
    if (revelateurProgress) revelateurProgress.textContent = getProgress(criteresRevelateur, "rev");

}


function renderCriteriaGroups(criteria, type) {
    const groups = new Map();
    criteria.forEach((critere, index) => {
        if (!groups.has(critere.group)) groups.set(critere.group, []);
        groups.get(critere.group).push({ ...critere, index });
    });

    return [...groups.entries()].map(([group, groupCriteria]) => `
        <section class="criteria-group" aria-label="${group}">
            <h3>${group}</h3>
            <div class="criteria-list">
                ${groupCriteria.map((critere) => renderCriteriaRow(critere.label, critere.index, type)).join("")}
            </div>
        </section>
    `).join("");
}

function renderBaseGroups() {
    return renderCriteriaGroups(criteresBase, "base");
}


function renderEvaluation() {
    let html = `
        <section class="evaluation-section" aria-labelledby="base-title">
            <div class="section-heading-row">
                <h2 id="base-title">Critères généraux</h2>
                <p class="shortcut-hint" id="base-progress">${getProgress(criteresBase, "base")}</p>
            </div>
            <details class="shortcut-help">
                <summary>Raccourcis clavier</summary>
                <p>Alt+1 Excellent, Alt+2 Bien, Alt+3 Moyen, Alt+4 Insuffisant.</p>
            </details>
            ${renderBaseGroups()}
        </section>
    `;

    if (programmes[state.programme].hasRevelateur) {
        html += `
            <section class="evaluation-section" aria-labelledby="revelateur-title">
                <div class="section-heading-row">
                    <h2 id="revelateur-title">Épreuve du révélateur</h2>
                    <p class="shortcut-hint" id="revelateur-progress">${getProgress(criteresRevelateur, "rev")}</p>
                </div>
                <div class="criteria-list">
                    ${criteresRevelateur.map((carte, index) => renderCriteriaRow(carte.nom, index, "rev", carte.img)).join("")}
                </div>
            </section>
        `;
    }

    elements.evaluation.innerHTML = html;
}

function renderTheme() {
    elements.body.classList.toggle("dark-mode", state.darkMode);
    elements.themeToggle.setAttribute("aria-pressed", String(state.darkMode));
    elements.themeToggle.innerHTML = state.darkMode
        ? '<span aria-hidden="true">☀</span><span>Mode clair</span>'
        : '<span aria-hidden="true">☾</span><span>Mode sombre</span>';
}

function renderFormValues() {
    elements.candidateName.value = state.candidateName;
    elements.candidateOrigin.value = state.candidateOrigin;
    elements.result.value = state.result;
    renderStructuredResult(state.result);
}

function render() {
    renderTabs();
    renderInfo();
    renderEvaluation();
    renderTheme();
    renderModelOptions();
    renderFormValues();
    renderSaveState();
    updateGenerationReadiness();
}

function hasEnteredData() {
    return Boolean(
        state.candidateName.trim() ||
        state.candidateOrigin.trim() ||
        state.result.trim() ||
        Object.values(state.evaluations).some((item) => item.note || item.score || (item.comment || "").trim())
    );
}

function resetCandidateData() {
    state.candidateName = "";
    state.candidateOrigin = "";
    state.result = "";
    state.evaluations = {};
    zeroChrono();
}

async function startNextCandidate() {
    const confirmed = !hasEnteredData() || await requestConfirmation({
        title: "Nouveau candidat",
        message: "Préparer un nouveau candidat effacera les notes, commentaires et la synthèse en cours.",
        acceptLabel: "Préparer"
    });
    if (!confirmed) return;

    resetCandidateData();
    saveState();
    render();
    setStatus("Nouveau candidat prêt. Les saisies précédentes ont été effacées.");
    elements.candidateName.focus();
}

async function switchProgramme(programme) {
    if (!programmes[programme] || programme === state.programme) return;

    if (hasEnteredData()) {
        const confirmed = await requestConfirmation({
            title: "Changer de programme",
            message: "Changer de programme effacera les notes, commentaires et la synthèse du candidat actuel.",
            acceptLabel: "Changer"
        });
        if (!confirmed) return;
    }

    resetCandidateData();
    state.programme = programme;
    saveState();
    render();
    setStatus("Programme changé. La grille est prête.");
}

function affichageChrono() {
    temps += 1;
    const minutes = Math.floor(temps / 60).toString().padStart(2, "0");
    const secondes = (temps % 60).toString().padStart(2, "0");
    elements.chrono.textContent = `${minutes}:${secondes}`;
}

function demarrerChrono() {
    if (!intervalChrono) intervalChrono = setInterval(affichageChrono, 1000);
}

function demarrerChronoAuPremierNom() {
    if (temps === 0 && elements.candidateName.value.trim()) demarrerChrono();
}

function pauseChrono() {
    clearInterval(intervalChrono);
    intervalChrono = null;
}

function zeroChrono() {
    pauseChrono();
    temps = 0;
    if (elements.chrono) elements.chrono.textContent = "00:00";
}

function collectEvaluations() {
    const lines = [];

    criteresBase.forEach((critere, index) => {
        const item = getEvaluation("base", index);
        if (item.note || item.comment) lines.push("- " + critere.label + " : " + (item.note || "Non noté") + " / " + (item.comment || "Sans commentaire"));
    });

    if (programmes[state.programme].hasRevelateur) {
        criteresRevelateur.forEach((carte, index) => {
            const item = getEvaluation("rev", index);
            if (item.note || item.comment) lines.push("- " + carte.nom + " : " + (item.note || "Non noté") + " / " + (item.comment || "Sans commentaire"));
        });

    }

    return lines.join("\n");
}

function buildPgeNotationContext() {
    return pgeNotationCriteria.map((critere) => {
        const objective = critere.objective ? " Objectif : " + critere.objective : "";
        const levels = critere.levels.map((level) => level.range + " : " + level.description).join(" ");
        return "- " + critere.label + "." + objective + " Repères : " + levels;
    }).join("\n");
}

function buildPgeCriterionOutputList() {
    return pgeNotationCriteria
        .map((critere) => '{ "criterion": "' + critere.label + '", "range": "[fourchette estimée]/10 ou non estimable", "justification": "[justification courte fondée sur les commentaires]" }')
        .join("\n");
}

function buildProgrammePromptContext() {
    const programmeContext = programmes[state.programme].promptContext;
    if (state.programme !== "pge") return programmeContext;
    return programmeContext + "\nBase de notation PGE issue de Grille Evaluation Le Revelateur.docx :\n" + buildPgeNotationContext();
}

function buildRubricInstruction() {
    if (state.programme !== "pge") return "";
    return "- Pour le PGE, ne suppose pas que le jury a déjà complété la notation PGE : c'est toi qui dois estimer les fourchettes à partir des commentaires des Critères généraux et de l'Épreuve du révélateur, en t'appuyant sur la grille de notation PGE fournie.\n"
        + "- Pour le PGE, réponds uniquement en JSON valide, sans Markdown, sans bloc de code, sans texte avant ou après.\n"
        + "- Le JSON doit suivre exactement cette forme : { \"appreciation\": \"2 à 3 lignes\", \"scores\": [ ... ], \"globalRange\": \"X-Y/10 ou non estimable\" }.\n"
        + "- Dans scores, donne un objet pour chacun des critères ci-dessous, exactement dans cet ordre. Chaque objet doit contenir criterion, range et justification. Si les commentaires ne suffisent pas pour un critère, mets \"non estimable\" dans range et explique brièvement pourquoi dans justification.\n"
        + buildPgeCriterionOutputList() + "\n"
        + "- Ne regroupe pas les critères : chacun doit avoir sa propre fourchette et sa propre justification.\n";
}

function buildGeneralOutputInstruction() {
    if (state.programme === "pge") return "";
    return "- Réponds uniquement en JSON valide, sans Markdown, sans bloc de code, sous la forme { \"appreciation\": \"texte final\" }.\n";
}

function buildPrompt() {
    return `Agis comme un membre du jury d'admission KEDGE. Rédige une appréciation finale stricte sur le profil évalué.
Consignes impératives :
- Parle du candidat à la 3ème personne (il/elle). Ne t'adresse jamais à la personne.
- Reste factuel, neutre et analytique. Ne fais pas de promesse de réussite future.
- Interdiction absolue de faire la promotion de l'école.
- Base-toi uniquement sur les informations saisies dans la grille et sur le contexte d'évaluation fourni.
${buildRubricInstruction()}${buildGeneralOutputInstruction()}- N'invente pas d'éléments non renseignés. Si une dimension est absente, n'en parle pas.
- Pour Bachelor et IBBA / EBP, si l'évaluation globale est très bonne, limite-toi à 2 lignes maximum.
- Pour Bachelor et IBBA / EBP, si le candidat présente des notes insuffisantes ou moyennes, étends la synthèse jusqu'à 3 lignes maximum pour justifier ses lacunes de façon détaillée.
Contexte du programme : ${buildProgrammePromptContext()}
Nom : ${state.candidateName || "Non renseigné"}
Origine : ${state.candidateOrigin || "Non renseignée"}
Évaluations :
${collectEvaluations() || "Aucune évaluation détaillée renseignée."}`;
}

function extractGeneratedText(data) {
    return data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function createGenerationError(message, { status = null, retryable = false } = {}) {
    const error = new Error(message);
    error.status = status;
    error.retryable = retryable;
    return error;
}

function isRetryableGenerationError(error) {
    if (error.retryable) return true;

    const status = error.status;
    if ([408, 429, 500, 502, 503, 504].includes(status)) return true;

    const lower = (error.message || "").toLowerCase();
    return lower.includes("failed to fetch")
        || lower.includes("network")
        || lower.includes("timeout")
        || lower.includes("aborted")
        || lower.includes("overloaded")
        || lower.includes("temporarily")
        || lower.includes("unavailable")
        || lower.includes("internal");
}

async function requestGeneration(apiKey, prompt) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(state.modelName)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.2 }
            })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.error) {
            throw createGenerationError(data.error?.message || `Erreur HTTP ${response.status}`, {
                status: response.status,
                retryable: [408, 429, 500, 502, 503, 504].includes(response.status)
            });
        }

        const generatedText = extractGeneratedText(data);
        if (!generatedText) {
            throw createGenerationError("Aucun texte n'a été retourné par le modèle.", { retryable: true });
        }

        return generatedText;
    } catch (error) {
        if (error.name === "AbortError") {
            throw createGenerationError("Délai de génération dépassé.", { retryable: true });
        }
        throw error;
    } finally {
        window.clearTimeout(timeout);
    }
}

function generationErrorMessage(error) {
    const message = error.message || "Erreur inconnue";
    const lower = message.toLowerCase();

    if (lower.includes("api key") || lower.includes("permission") || lower.includes("unauthorized") || lower.includes("forbidden")) {
        return `Erreur de génération : clé API refusée. Vérifie la clé Google AI Studio, puis clique sur Réessayer.`;
    }

    if (lower.includes("quota") || lower.includes("rate") || lower.includes("429")) {
        return "Erreur de génération : quota ou limite temporaire atteint après plusieurs tentatives. Les saisies sont conservées.";
    }

    if (lower.includes("model") || lower.includes("404")) {
        return "Erreur de génération : modèle indisponible. Choisis un autre modèle, puis clique sur Réessayer.";
    }

    if (lower.includes("network") || lower.includes("failed to fetch")) {
        return "Erreur de génération : connexion impossible après plusieurs tentatives. Les saisies sont conservées.";
    }

    if (lower.includes("délai") || lower.includes("timeout") || lower.includes("aborted")) {
        return "Erreur de génération : délai dépassé après plusieurs tentatives. Les saisies sont conservées.";
    }

    return `Erreur de génération : ${message}. Corrige le problème, puis clique sur Réessayer.`;
}

async function genererAppreciation() {
    const apiKey = elements.apiKey.value.trim();

    if (!apiKey) {
        updateGenerationReadiness();
        setStatus("Renseigne la clé API avant de créer la synthèse.");
        elements.apiKey.focus();
        return;
    }

    const previousResult = state.result;
    state.modelName = elements.modelName.value;
    const prompt = buildPrompt();
    state.result = "Analyse des critères et rédaction...";
    elements.result.value = state.result;
    renderStructuredResult(state.result);
    updateGenerationReadiness(true);
    setStatus("Génération en cours.");

    try {
        let generatedText = "";
        for (let attempt = 1; attempt <= GENERATION_MAX_ATTEMPTS; attempt += 1) {
            try {
                generatedText = await requestGeneration(apiKey, prompt);
                break;
            } catch (error) {
                const canRetry = attempt < GENERATION_MAX_ATTEMPTS && isRetryableGenerationError(error);
                if (!canRetry) throw error;

                setStatus(`Génération interrompue, nouvelle tentative ${attempt + 1}/${GENERATION_MAX_ATTEMPTS}...`);
                await wait(GENERATION_RETRY_DELAYS[attempt - 1] || GENERATION_RETRY_DELAYS.at(-1));
            }
        }

        state.result = generatedText;
        elements.result.value = generatedText;
        renderStructuredResult(generatedText);
        setStatus("Synthèse créée.");
        saveState();
    } catch (error) {
        state.result = previousResult;
        elements.result.value = previousResult;
        renderStructuredResult(previousResult);
        setStatus(generationErrorMessage(error), true);
    } finally {
        updateGenerationReadiness();
    }
}

function focusNextComment(currentInput) {
    const comments = [...elements.evaluation.querySelectorAll('input[data-eval-field="comment"]')];
    const index = comments.indexOf(currentInput);
    const next = comments[index + 1];
    if (next) next.focus();
}

function applyNoteShortcut(target, key) {
    const note = NOTE_SHORTCUTS[key];
    if (!note) return false;

    const row = target.closest(".grid-row");
    const select = row?.querySelector('select[data-eval-field="note"]');
    if (!select) return false;

    select.value = note;
    select.dispatchEvent(new Event("input", { bubbles: true }));
    setStatus(`Note rapide appliquée : ${note}.`);
    return true;
}

function bindEvents() {
    document.querySelectorAll("[data-programme]").forEach((tab) => {
        tab.addEventListener("click", () => switchProgramme(tab.dataset.programme));
    });

    document.getElementById("timer-start").addEventListener("click", demarrerChrono);
    document.getElementById("timer-pause").addEventListener("click", pauseChrono);
    document.getElementById("timer-reset").addEventListener("click", zeroChrono);

    elements.apiForm.addEventListener("submit", (event) => event.preventDefault());

    elements.apiKey.addEventListener("input", () => {
        updateGenerationReadiness();
    });

    elements.themeToggle.addEventListener("click", () => {
        state.darkMode = !state.darkMode;
        renderTheme();
        saveState();
    });

    elements.helpToggle.addEventListener("click", () => {
        const isOpen = !elements.helpPanel.hidden;
        elements.helpPanel.hidden = isOpen;
        elements.helpToggle.setAttribute("aria-expanded", String(!isOpen));
    });

    elements.candidateName.addEventListener("input", () => {
        state.candidateName = elements.candidateName.value;
        demarrerChronoAuPremierNom();
        saveState();
    });

    elements.candidateOrigin.addEventListener("input", () => {
        state.candidateOrigin = elements.candidateOrigin.value;
        saveState();
    });

    elements.modelName.addEventListener("change", () => {
        state.modelName = elements.modelName.value;
        saveState();
    });

    elements.evaluation.addEventListener("input", (event) => {
        const target = event.target;
        if (!target.dataset.evalType) return;

        const key = evaluationKey(target.dataset.evalType, target.dataset.evalIndex);
        const current = state.evaluations[key] || { note: "", comment: "" };
        current[target.dataset.evalField] = target.value;
        state.evaluations[key] = current;
        if (target.dataset.evalField === "note") {
            target.closest(".grid-row").dataset.note = target.value || "Non noté";
            updateProgressIndicators();
        }
        saveState();
    });

    elements.evaluation.addEventListener("keydown", (event) => {
        const target = event.target;
        if (!target.dataset.evalType) return;

        if (event.altKey && applyNoteShortcut(target, event.key)) {
            event.preventDefault();
            return;
        }

        if (event.key === "Enter" && target.dataset.evalField === "comment") {
            event.preventDefault();
            focusNextComment(target);
        }
    });

    document.getElementById("clear-form").addEventListener("click", async () => {
        const confirmed = !hasEnteredData() || await requestConfirmation({
            title: "Effacer les saisies",
            message: "Cette action effacera le candidat, les notes, les commentaires et la synthèse affichée.",
            acceptLabel: "Tout effacer"
        });
        if (!confirmed) return;

        resetCandidateData();
        saveState();
        render();
        setStatus("Saisies effacées.");
    });

    elements.nextCandidate.addEventListener("click", startNextCandidate);
    elements.generateSummary.addEventListener("click", genererAppreciation);
    elements.retrySummary.addEventListener("click", genererAppreciation);
}

function applyUrlProgramme() {
    const urlProgramme = new URLSearchParams(window.location.search).get("concours");
    if (programmes[urlProgramme]) state.programme = urlProgramme;
}

function initPreferredTheme() {
    if (!localStorage.getItem(STORAGE_KEY) && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        state.darkMode = true;
    }
}

function init() {
    cacheElements();
    loadState();
    applyUrlProgramme();
    initPreferredTheme();
    render();
    bindEvents();
}

init();
