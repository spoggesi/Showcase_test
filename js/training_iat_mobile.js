// ============================================================
// FILE: js/training_iat_mobile.js
// DESCRIZIONE: Training IAT - Versione MOBILE (Touch)
// ============================================================

function generateMobileTraining() {
    const timeline = [];

    // A. INTRODUZIONE METODOLOGICA
    timeline.push({
        type: jsPsychHtmlButtonResponse,
        on_load: () => { document.body.classList.remove('mobile-buttons-active'); },
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

    // B. ISTRUZIONI TASTI (Mobile Only)
    let instrText =
        `<p class="instruction-text" style="text-align: center;">
            Premi il pulsante <strong style="color:#27ae60">VERDE (Sinistra)</strong> se la parola è un <strong>Evento Meteorologico</strong>.<br><br>
            Premi il pulsante <strong style="color:#c0392b">ROSSO (Destra)</strong> se NON c'entra nulla (Altro).
         </p>`;

    let visualKeys =
        `<div class="key-visual-container">
            <!-- Mobile Preview (Non cliccabili qui, solo visuali) -->
            <div class="key-box green" style="background: linear-gradient(145deg, #2ecc71, #27ae60); color: white; border: none; box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);">
                <div class="key-desc">VERDE</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">METEO</div>
            </div>
            <div class="key-box red" style="background: linear-gradient(145deg, #e74c3c, #c0392b); color: white; border: none; box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);">
                <div class="key-desc">ROSSO</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">ALTRO</div>
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
        { word: "Pioggia", type: "SI", btn_idx: 0 },
        { word: "Sole", type: "SI", btn_idx: 0 },
        { word: "Tavolo", type: "NO", btn_idx: 1 },
        { word: "Sedia", type: "NO", btn_idx: 1 }
    ];
    const shuffledTrain = trainWords.sort(() => Math.random() - 0.5);

    const headerHTML = `<div class="iat-header">È un evento meteorologico?</div>`;

    shuffledTrain.forEach(item => {
        // A. FIXATION (Persistent Buttons)
        timeline.push({
            type: jsPsychHtmlButtonResponse,
            on_load: () => {
                document.body.classList.add('mobile-buttons-active');
            },
            stimulus: `<div style="height: 100vh; position: relative;">
                ${headerHTML}
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 80px; color: #b2bec3;">+</div>
            </div>`,
            choices: ['SI', 'NO'],
            button_html: function (choice) {
                var cls = "";
                if (choice.includes("SI")) cls = "mobile-iat-btn btn-left";
                else cls = "mobile-iat-btn btn-right";
                return '<button class="' + cls + '" style="cursor: default;">' + choice + '</button>';
            },
            trial_duration: 1000,
            response_ends_trial: false,
            data: { task: 'fixation' }
        });
        // 2. TRIAL (Mobile)
        timeline.push({
            type: jsPsychHtmlButtonResponse,
            stimulus: `<div style="height: 100vh; width: 100%; position: relative;">
                ${headerHTML}
                <div class="iat-stimulus">${item.word}</div>
            </div>`,
            choices: ['SI', 'NO'],
            button_html: function (choice) {
                var cls = "";
                if (choice.includes("SI") || choice.includes("Meteo")) cls = "mobile-iat-btn btn-left";
                else cls = "mobile-iat-btn btn-right";

                return '<button class="' + cls + '">' + choice + '</button>';
            },
            data: { task: 'iat_training', correct_btn: item.btn_idx },
            on_finish: function (data) {
                data.correct = (data.response == data.correct_btn);
            }
        });
    });

    // C. FEEDBACK
    timeline.push({
        type: jsPsychHtmlButtonResponse,
        on_load: () => { document.body.classList.remove('mobile-buttons-active'); },
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
