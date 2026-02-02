// ============================================================
// FILE: js/config.js
// GENERATO AUTOMATICAMENTE IL 24/12/2025
// ============================================================

// --- 1. CONFIGURAZIONE CODICI FISSI ---
const FIXED_CODES = {
    "White": {
        "A": [
            665,
            452,
            322,
            407
        ],
        "B": [
            599,
            852,
            358,
            408
        ]
    },
    "Red": {
        "A": [
            731,
            559,
            268,
            981
        ],
        "B": [
            707,
            776,
            750,
            725
        ]
    }
};

// --- 2. FUNZIONI DI UTILITÀ ---

/**
 * Legge l'ordine assegnato dal Login JATOS
 */
function getAssignedOrder() {
    if (typeof jatos !== 'undefined' && jatos.studySessionData && jatos.studySessionData.designOrder) {
        return jatos.studySessionData.designOrder; 
    }
    return "AB"; // Fallback di sicurezza
}

/**
 * Converte la sequenza di lettere (es. ABAC) in codici bicchiere reali
 */
function mapDesignToFixedCodes(designString, categoryName) {
    // Verifica sicurezza
    if (!FIXED_CODES[categoryName]) { 
        console.error("ERRORE CRITICO: Categoria non trovata nel config: " + categoryName); 
        return []; 
    }

    let counters = {}; 
    // Inizializza contatori a zero per ogni prodotto (A, B, C...)
    for(let k in FIXED_CODES[categoryName]) counters[k] = 0;
    
    let sampleOrder = [];
    let mappingLog = {};

    for (let i = 0; i < designString.length; i++) {
        let wineType = designString[i]; // Es. "A"
        let codeList = FIXED_CODES[categoryName][wineType];
        
        if(codeList) {
            let count = counters[wineType];
            
            // Se finiamo i codici (improbabile con questo generatore), cicliamo
            let code = codeList[count % codeList.length];
            
            sampleOrder.push(code);
            
            // Log per analisi dati
            mappingLog[`${categoryName}_Campione_${i+1}_${code}`] = wineType;
            
            counters[wineType]++;
        }
    }

    // Salva mapping in JATOS
    if (typeof jatos !== 'undefined') {
        jatos.addJatosIds(mappingLog);
    }
    
    console.log(`Sessione ${categoryName} - Design: ${designString} - Ordine: ${sampleOrder}`);
    return sampleOrder;
}

// --- 3. INIEZIONE DATI PARTECIPANTE ---
function addParticipantDataToJsPsych(jsPsychInstance) {
    if (typeof jatos !== 'undefined' && jatos.studySessionData) {
        jsPsychInstance.data.addProperties({
            participant_code: jatos.studySessionData.participantCode || "Sconosciuto",
            design_order: jatos.studySessionData.designOrder || "ND"
        });
        console.log("Dati partecipante iniettati.");
    }
}

// --- 4. FUNZIONI DI INIZIALIZZAZIONE (Chiamate dagli HTML) ---
function initWhiteConfig() { return mapDesignToFixedCodes(getAssignedOrder(), "White"); }
function initRedConfig() { return mapDesignToFixedCodes(getAssignedOrder(), "Red"); }