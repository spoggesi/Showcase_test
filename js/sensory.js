// ============================================================
// FILE: js/sensory.js
// DESCRIZIONE: Libreria di funzioni per generare i trial sensoriali (AGGIORNATO CON RETRO-OLFATTO)
// ============================================================


// --- 1. FUNZIONI DI SUPPORTO (RATA LABELS) ---

function generateSensoryIntro() {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div class="sample-block" style="max-width: 800px; margin: 0 auto; text-align: left;">
                <h2 style="color: #e67e22; text-align: center;">Fase 3: Profilazione Sensoriale (Rata)</h2>
                
                <div style="background: #fff3e0; padding: 20px; border-radius: 8px; border-left: 5px solid #e67e22; margin: 20px 0;">
                    <p style="margin-top:0;"><strong>Il Problema dei Test Classici:</strong></p>
                    <p>L'Analisi Descrittiva Quantitativa (QDA) è lenta e affatica il giudice, riducendo l'affidabilità dei dati dopo pochi campioni.</p>
                </div>

                <p><strong>La Nostra Soluzione: Metodo RATA (Rate-All-That-Apply)</strong></p>
                <ul style="font-size: 1.1rem; line-height: 1.6;">
                    <li>Il consumatore seleziona <em>solo</em> gli attributi che percepisce.</li>
                    <li>Ne valuta l'intensità (0-5) in modo rapido e intuitivo.</li>
                    <li><strong>Risultato:</strong> Otteniamo profili organolettici complessi in metà del tempo, permettendo di testare più prodotti senza il bias dell'affatticamento.</li>
                </ul>

                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #7f8c8d; font-style: italic;">Prova ora l'interfaccia di degustazione rapida.</p>
                </div>
            </div>
        `,
        choices: ["Inizia Degustazione"]
    };
}

function createRATALabels() {
    return [
        `<span class="anchor-text">Assente<br>(0)</span>`,
        `<span class="rata-num">1</span>`,
        `<span class="rata-num">2</span>`,
        `<span class="rata-num">3</span>`,
        `<span class="rata-num">4</span>`,
        `<span class="anchor-text">Molto<br>intenso (5)</span>`
    ];
}


// --- 2. GENERAZIONE PROVE SENSORIALI ---

function generateSensoryTrials(sampleIndex, currentCode, attributesConfig) {

    // Configurazione di default (fallback)
    const config = attributesConfig || {
        visual: ["Limpidezza"],
        olfactory: ["Intensità"],
        gustatory: ["Acidità"],
        retroOlfactory: ["Persistenza Aromatica"] // Default se manca
    };

    const trials = [];

    // A. BLOCCO VISIVO
    if (config.visual && config.visual.length > 0) {
        trials.push({
            type: jsPsychSurveyLikert,
            preamble: `
                <div class="sample-block">
                    <h4>Analisi VISIVA - Campione ${currentCode}</h4>
                    <p>Indica l'intensità di ogni attributo (0-5).</p>
                </div>`,
            questions: config.visual.map(attr => ({
                prompt: attr, labels: createRATALabels(), required: true
            })),
            button_label: "Avanti",
            scale_width: 600,
            css_classes: ['rata-visiva-scale'],
            data: { sample: currentCode, phase: 'visual' }
        });
    }

    // B. BLOCCO OLFATTIVO
    if (config.olfactory && config.olfactory.length > 0) {
        trials.push({
            type: jsPsychSurveyLikert,
            preamble: `
                <div class="sample-block">
                    <h4>Analisi OLFATTIVA - Campione ${currentCode}</h4>
                    <p>Annusa il campione senza agitarlo, poi agita e annusa di nuovo.</p>
                </div>`,
            questions: config.olfactory.map(attr => ({
                prompt: attr, labels: createRATALabels(), required: true
            })),
            button_label: "Avanti",
            scale_width: 600,
            css_classes: ['rata-visiva-scale'],
            data: { sample: currentCode, phase: 'olfactory' }
        });
    }

    // C. BLOCCO GUSTATIVO
    if (config.gustatory && config.gustatory.length > 0) {
        trials.push({
            type: jsPsychSurveyLikert,
            preamble: `
                <div class="sample-block">
                    <h4>Analisi GUSTATIVA - Campione ${currentCode}</h4>
                    <p>Assaggia il campione (sapore e sensazioni tattili).</p>
                </div>`,
            questions: config.gustatory.map(attr => ({
                prompt: attr, labels: createRATALabels(), required: true
            })),
            button_label: "Avanti",
            scale_width: 600,
            css_classes: ['rata-visiva-scale'],
            data: { sample: currentCode, phase: 'gustatory' }
        });
    }

    // D. BLOCCO RETRO-OLFATTIVO (NUOVO!)
    if (config.retroOlfactory && config.retroOlfactory.length > 0) {
        trials.push({
            type: jsPsychSurveyLikert,
            preamble: `
                <div class="sample-block">
                    <h4>Analisi RETRO-OLFATTIVA - Campione ${currentCode}</h4>
                    <p>Dopo aver deglutito o sputato, espira dal naso (aromi di bocca).</p>
                </div>`,
            questions: config.retroOlfactory.map(attr => ({
                prompt: attr, labels: createRATALabels(), required: true
            })),
            button_label: "Avanti",
            scale_width: 600,
            css_classes: ['rata-visiva-scale'],
            data: { sample: currentCode, phase: 'retro_olfactory' }
        });
    }

    // E. OVERALL LIKING
    trials.push({
        type: jsPsychHtmlSliderResponse,
        stimulus: `
            <div class="liking-block" style="margin-bottom: 20px;">
                <h4>Giudizio Complessivo</h4>
                <p>Indica la qualità oggettiva del campione <strong>${currentCode}</strong></p>
            </div>`,
        min: 0, max: 100, start: 50, step: 1, require_movement: true,
        labels: ["Bassa", "Media", "Alta"],
        button_label: "Continua",

        prompt: `
            <div style="margin-top: 50px; max-width: 800px; margin-left: auto; margin-right: auto; text-align: left;">
                <label for="comment-box" style="display:block; margin-bottom: 10px; font-weight: 600; color: #2c3e50;">
                    Hai qualche osservazione aggiuntiva? (opzionale):
                </label>
                <textarea id="comment-box" rows="2" placeholder="Scrivi qui..." 
                    style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-family: inherit;"></textarea>
            </div>
        `,
        on_finish: function (data) {
            var commentElement = document.getElementById("comment-box");
            data.comment = commentElement ? commentElement.value : "";
            data.sample = currentCode;
            data.phase = 'liking_overall';
        }
    });

    return trials;
}


// --- 3. FUNZIONE COUNTDOWN ---

function generateCountdownTrial(seconds) {
    return {
        type: jsPsychHtmlButtonResponse,
        trial_duration: (seconds * 1000) + 200,
        response_ends_trial: false,
        stimulus: function () {
            return `
            <div style="max-width:600px; margin: 0 auto;">
                <h3 style="margin-bottom:20px; color:#2c3e50;">Pausa</h3>
                <p style="font-size:1.5rem;">Bevi un sorso d'acqua e mangia un pezzo di cracker.</p>
                <p style="font-size:1.2rem; margin-top:20px;">
                    Prossimo vino tra <span id="clock" style="font-weight:bold; color:#3498db; font-size:1.4rem;">${seconds}</span> secondi.
                </p>
                <button class="jspsych-btn" disabled style="margin-top:30px; opacity:0.5; cursor:not-allowed;">
                    Attendi...
                </button>
            </div>`;
        },
        choices: [],
        on_load: function () {
            let waitTime = parseInt(seconds);
            const clock = document.getElementById("clock");
            const interval = setInterval(() => {
                waitTime--;
                if (clock) clock.textContent = waitTime > 0 ? waitTime : 0;
                if (waitTime <= 0) clearInterval(interval);
            }, 1000);
            window.countdownInterval = interval;
        },
        on_finish: function () {
            if (window.countdownInterval) clearInterval(window.countdownInterval);
        }
    };
}