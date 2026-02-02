// ============================================================
// FILE: js/training_iat_desktop.js
// DESCRIZIONE: Training IAT - Versione DESKTOP (Tastiera)
// ============================================================

function generateDesktopTraining() {
    const timeline = [];

    // A. INTRODUZIONE METODOLOGICA
    timeline.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div class="instruction-container">
                <h2 class="instruction-title">Fase 1: Calibrazione Neurale</h2>
                
                <div style="background: #eaf2f8; padding: 20px; border-radius: 12px; border-left: 6px solid #3498db; margin: 30px 0;">
                    <p style="margin:0; font-size: 1.1rem; color: #34495e;"><strong>Perché facciamo questo training?</strong></p>
                    <p style="margin-top: 10px; color: #555;">L'Implicit Association Task (IAT) misura la forza delle connessioni automatiche nel cervello. Per garantire dati affidabili, dobbiamo prima "calibrare" i tuoi tempi di reazione.</p>
                </div>

                <p class="instruction-text">In questa breve prova imparerai a usare i tasti di risposta:</p>
                <ul class="instruction-text" style="padding-left: 40px;">
                    <li>Associerai parole a categorie semplici (Meteo vs Oggetti).</li>
                    <li>L'obiettivo è rispondere il più <strong>velocemente</strong> possibile.</li>
                    <li>Questo serve come allenamento per comprendere la tipologia di task.</li>
                </ul>

                <div style="text-align: center; margin-top: 40px;">
                    <p style="color: #b2bec3; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Premi "Inizia" quando sei pronto</p>
                </div>
            </div>
        `,
        choices: ["Inizia"]
    });

    // B. ISTRUZIONI TASTI (Desktop Only)
    let instrText =
        `<ul class="instruction-text" style="padding-left: 40px;">
            <li>Premi <strong>F</strong> se la parola è un <strong>Evento Meteorologico</strong>.</li>
            <li>Premi <strong>J</strong> se la parola <strong>NON</strong> c'entra nulla.</li>
         </ul>`;

    let visualKeys =
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
            <div class="instruction-container">
                <h2 class="instruction-title">Istruzioni Tasti</h2>
                ${instrText}
                ${visualKeys}
            </div>
        `,
        choices: ["Ho Capito, Inizia"]
    });

    const trainWords = [
        { word: "Pioggia", type: "SI", key: 'f' },
        { word: "Sole", type: "SI", key: 'f' },
        { word: "Tavolo", type: "NO", key: 'j' },
        { word: "Sedia", type: "NO", key: 'j' }
    ];
    const shuffledTrain = trainWords.sort(() => Math.random() - 0.5);

    const headerHTML = `<div class="iat-header">È un evento meteorologico?</div>`;

    // Footer Desktop
    const footerHTML = `
        <div class="iat-footer-desktop">
            <div class="key-hint"><div class="key-cap">F</div><span class="key-label">SI (Meteo)</span></div>
            <div class="key-hint"><div class="key-cap">J</div><span class="key-label">NO (Altro)</span></div>
        </div>`;

    shuffledTrain.forEach(item => {
        // 1. FIXATION
        timeline.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<div style="height: 100vh; width: 100%; position: relative;">
                ${headerHTML}
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 80px; color: #b2bec3;">+</div>
                ${footerHTML}
            </div>`,
            choices: "NO_KEYS",
            trial_duration: 800
        });

        // 2. TRIAL (Desktop)
        timeline.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<div style="height: 100vh; width: 100%; position: relative;">
                ${headerHTML}
                <div class="iat-stimulus">${item.word}</div>
                ${footerHTML}
            </div>`,
            choices: ['f', 'j'],
            trial_duration: 3000,
            data: { task: 'iat_training', correct_key: item.key },
            on_finish: function (data) {
                if (jsPsych.pluginAPI.compareKeys(data.response, data.correct_key)) {
                    data.correct = true;
                } else {
                    data.correct = false;
                }
            }
        });
    });

    // C. FEEDBACK
    timeline.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: function () {
            const trials = jsPsych.data.get().filter({ task: 'iat_training' });
            const correct_trials = trials.filter({ correct: true });
            const count = trials.count();
            const accuracy = count > 0 ? Math.round((correct_trials.count() / count) * 100) : 0;

            let color = accuracy > 70 ? "#27ae60" : "#c0392b";
            return `
                <div class="instruction-container" style="text-align: center;">
                    <h3 class="instruction-title">Calibrazione Completata</h3>
                    <p class="instruction-text">Accuratezza Rilevata</p>
                    <div style="font-size: 4rem; color: ${color}; font-weight: 800; margin: 20px 0;">${accuracy}%</div>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                    <p class="instruction-text">Il sistema è pronto per acquisire i dati reali.</p>
                </div>`;
        },
        choices: ["Continua"]
    });

    return timeline;
}
