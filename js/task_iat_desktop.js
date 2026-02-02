// ============================================================
// FILE: js/task_iat_desktop.js
// DESCRIZIONE: Task Emozioni - Versione DESKTOP (Tastiera)
// ============================================================

const emotionListDesktop = [
    "Felicità", "Tristezza", "Rabbia", "Sorpresa", "Disgusto",
    "Paura", "Gioia", "Ansia", "Serenità", "Noia"
];

function generateDesktopTask(sampleCode) {
    const timeline = [];

    // 0. INTRODUZIONE AL CLIENTE
    timeline.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div class="instruction-container">
                <h2 class="instruction-title" style="color: #6c5ce7;">Analisi Emozionale Implicita</h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px;">
                    <div>
                        <h4 style="color: #2c3e50; margin-bottom: 15px;">Cosa stiamo misurando?</h4>
                        <p class="instruction-text" style="font-size: 1rem;">
                            A differenza dei questionari tradizionali, qui catturiamo le risposte implicite misurando i tempi di reazione in millisecondi.
                        </p>
                    </div>

                    <div style="background: #fdfefe; border: 1px solid #dfe6e9; padding: 25px; border-radius: 12px;">
                        <h4 style="color: #2c3e50; margin-top: 0;">Come funziona?</h4>
                        <ul class="instruction-text" style="font-size: 1rem; padding-left: 20px; list-style-type: circle;">
                            <li>Assaggia il vino qundo richiesto.</li>
                            <li>Osserva le parole che compaiono.</li>
                            <li>Rispondi (SI/NO) il più velocemente possibile.</li>
                        </ul>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 40px; padding: 15px; background: #fff8e1; border-left: 5px solid #f1c40f; border-radius: 4px; color: #7f6000;">
                    <strong>Obiettivo:</strong> Mappa emotiva non filtrata.
                </div>
            </div>
        `,
        choices: ["Avvia Prova"]
    });

    // 1. ISTRUZIONI OPERATIVE DESKTOP
    let instrHtml =
        `<div class="key-visual-container">
            <div class="key-box green">
                <div class="key-code">F</div>
                <div class="key-desc">SI</div>
            </div>
            <div class="key-box red">
                <div class="key-code">J</div>
                <div class="key-desc">NO</div>
            </div>
        </div>`;

    timeline.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div class="instruction-container" style="text-align: center;">
                <h3 class="instruction-title">Istruzioni</h3>
                ${instrHtml}
                <div style="margin-top: 40px;">
                    <p class="instruction-text">Non pensare troppo. Lasciati guidare dall'istinto.</p>
                </div>
            </div>
        `,
        choices: ["SONO PRONTO"]
    });

    // 2. ASSAGGIO DEL CAMPIONE
    let startInstr = "Premi un tasto qualsiasi per iniziare.";

    let tastingTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
             <div class="instruction-container" style="text-align: center;">
                <h3 class="instruction-title">Degustazione Campione ${sampleCode}</h3>
                <div style="font-size: 1.4rem; margin: 30px auto; text-align: left; max-width: 500px; line-height: 2; background: #fafafa; padding: 30px; border-radius: 16px;">
                    <p>1. 👃 Annusa il campione.</p>
                    <p>2. 🍷 Assaggia il campione.</p>
                    <p>3. 🧠 Concentrati sulle sensazioni.</p>
                </div>
                
                <div class="key-visual-container" style="margin-bottom: 30px; gap: 20px;">
                    <div style="color: #636e72; font-weight: 600;">Posiziona le dita su:</div>
                    <div class="key-cap">F</div>
                    <div class="key-cap">J</div>
                </div>

                <p style="font-size: 1.1rem; color: #636e72;">${startInstr}</p>
            </div>`,
        post_trial_gap: 1000
    };

    timeline.push(tastingTrial);

    // 3. LOOP EMOZIONI
    let currentEmotions = [...emotionListDesktop].sort(() => Math.random() - 0.5);

    const headerHTML = `<div class="iat-header">Il Campione <strong>${sampleCode}</strong> mi fa sentire...</div>`;
    const footerHTML = `
        <div class="iat-footer-desktop">
            <div class="key-hint"><div class="key-cap">F</div><span class="key-label">SI</span></div>
            <div class="key-hint"><div class="key-cap">J</div><span class="key-label">NO</span></div>
        </div>`;

    currentEmotions.forEach(emotion => {
        // A. FIXATION
        timeline.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<div style="height: 100vh; position: relative;">
                ${headerHTML}
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 80px; color: #b2bec3;">+</div>
                ${footerHTML}
            </div>`,
            choices: "NO_KEYS",
            trial_duration: 1000,
            data: { task: 'fixation', sample: sampleCode }
        });

        // B. EMOZIONE (Desktop)
        timeline.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<div style="height: 100vh; position: relative;">
                ${headerHTML}
                <div class="iat-stimulus">${emotion}</div>
                ${footerHTML}
            </div>`,
            choices: ['f', 'j'],
            trial_duration: 3000,
            data: { task: 'iat_emotion', sample: sampleCode, emotion_word: emotion },
            on_finish: function (data) {
                if (data.response === 'f') data.answer_meaning = "SI";
                if (data.response === 'j') data.answer_meaning = "NO";
                if (data.response === null) data.answer_meaning = "TIMEOUT";
            }
        });
    });

    return timeline;
}
