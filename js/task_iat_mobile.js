// ============================================================
// FILE: js/task_iat_mobile.js
// DESCRIZIONE: Task Emozioni - Versione MOBILE (Touch)
// ============================================================

const emotionListMobile = [
    "Felicità", "Tristezza", "Rabbia", "Sorpresa", "Disgusto",
    "Paura", "Gioia", "Ansia", "Serenità", "Noia"
];

function generateMobileTask(sampleCode) {
    const timeline = [];

    // 0. INTRODUZIONE AL CLIENTE
    timeline.push({
        type: jsPsychHtmlButtonResponse,
        on_load: () => { document.body.classList.remove('mobile-buttons-active'); },
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
        choices: ["Avvia Test Emozionale"]
    });

    // 1. ISTRUZIONI OPERATIVE MOBILE
    let instrHtml =
        `<p class="instruction-text" style="text-align: center;">
             Premi <strong style="color: #27ae60">VERDE ( SX )</strong> se l'emozione <strong>TI DESCRIVE</strong>.<br><br>
             Premi <strong style="color: #c0392b">ROSSO ( DX )</strong> se <strong>NON</strong> ti descrive.
         </p>
         <div class="key-visual-container">
            <div class="key-box green" style="background: linear-gradient(145deg, #2ecc71, #27ae60); color: white; border: none;">
                <div class="key-desc">VERDE</div>
                <div style="font-size: 0.8rem;">SI</div>
            </div>
            <div class="key-box red" style="background: linear-gradient(145deg, #e74c3c, #c0392b); color: white; border: none;">
                <div class="key-desc">ROSSO</div>
                <div style="font-size: 0.8rem;">NO</div>
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
    let startInstr = "Premi AVVIA quando sei pronto.";

    let tastingTrial = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div class="instruction-container" style="text-align: center;">
                <h3 class="instruction-title">Degustazione Campione ${sampleCode}</h3>
                <div style="font-size: 1.2rem; margin: 30px auto; text-align: left; max-width: 500px; line-height: 2; background: #fafafa; padding: 30px; border-radius: 16px;">
                    <p>1. 👃 <strong>Annusa</strong> intensamente.</p>
                    <p>2. 🍷 Prendi un piccolo <strong>sorso</strong>.</p>
                    <p>3. 🧠 Concentrati sulle sensazioni.</p>
                </div>
                <p style="font-size: 1.1rem; color: #636e72;">${startInstr}</p>
            </div>`,
        choices: ["AVVIA"]
    };

    timeline.push(tastingTrial);

    // 3. LOOP EMOZIONI
    let currentEmotions = [...emotionListMobile].sort(() => Math.random() - 0.5);

    const headerHTML = `<div class="iat-header">Il Campione <strong>${sampleCode}</strong> mi fa sentire...</div>`;

    currentEmotions.forEach(emotion => {
        // A. FIXATION
        // A. FIXATION (With Persistent Buttons)
        timeline.push({
            type: jsPsychHtmlButtonResponse,
            stimulus: `<div style="height: 100vh; position: relative;">
                ${headerHTML}
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 80px; color: #b2bec3;">+</div>
            </div>`,
            choices: ['SI', 'NO'], // Must render buttons
            button_html: function (choice) {
                var cls = "";
                if (choice.includes("SI")) cls = "mobile-iat-btn btn-left";
                else cls = "mobile-iat-btn btn-right";
                // Add 'disabled' or just ignore clicks in data?
                // response_ends_trial: false handles the flow, but visual feedback might be confusing if they click and nothing happens.
                // User asked for "emotions... change... rest remain".
                // A simple approach: render them disabled? No, disabled buttons often look greyed out. 
                // Render them normal.
                return '<button class="' + cls + '" style="cursor: default;">' + choice + '</button>';
            },
            trial_duration: 1000,
            response_ends_trial: false, // Wait full duration even if clicked
            data: { task: 'fixation', sample: sampleCode }
        });

        // B. EMOZIONE (Mobile)
        timeline.push({
            type: jsPsychHtmlButtonResponse,
            on_load: () => {
                document.body.classList.add('mobile-buttons-active');
            },
            stimulus: `<div style="height: 100vh; width: 100%; position: relative;">
                ${headerHTML}
                <div class="iat-stimulus" style="font-size: 3.5rem;">${emotion}</div>
            </div>`,
            choices: ['SI', 'NO'],
            button_html: function (choice) {
                // Logic based on User Reference: dynamically assign class based on choice text
                // "SI" -> Left (Green), "NO" -> Right (Red)
                // Note: My setup passes "SI" and "NO" (or "SI (Meteo)" in training)
                var cls = "";
                if (choice.includes("SI") || choice.includes("VERDE")) cls = "mobile-iat-btn btn-left";
                else if (choice.includes("NO") || choice.includes("ROSSO")) cls = "mobile-iat-btn btn-right";

                return '<button class="' + cls + '">' + choice + '</button>';
            },
            trial_duration: 3000,
            data: { task: 'iat_emotion', sample: sampleCode, emotion_word: emotion },
            on_finish: function (data) {
                if (data.response == 0) data.answer_meaning = "SI";
                else if (data.response == 1) data.answer_meaning = "NO";
                else data.answer_meaning = "TIMEOUT";
            }
        });
    });

    return timeline;
}
