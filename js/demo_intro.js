// ==================================================================================
// FILE: js/demo_intro.js
// DESCRIZIONE: Intro "Vetrina" con Dichiarazione di Consenso e Firma Legale (Layout Ampio)
// ==================================================================================

const STUDY_CONFIG = {
    logoURL: "files/logo.png",
    companyEmail: "sensoriale@giottoconsulting.it",
    companyPhone: " +39 0438 971719"
};

// --- GENERATORE LISTA (Invariato) ---
function generateDemoTaskList() {
    return `
    <ul style="text-align: left; font-size: 1rem; line-height: 1.6; margin: 15px 0 15px 20px; color: #2c3e50;">
        <li style="margin-bottom: 15px;">
            <strong>1. Implicit Association Task (IAT)</strong><br>
            <em style="font-size: 0.9rem; color: #555;">Neuroscienze applicate</em><br>
            Il 95% delle decisioni d'acquisto avviene nell'inconscio. Utilizziamo un task a tempo limitato per bypassare la razionalità.
        </li>
        <li style="margin-bottom: 15px;">
            <strong>2. Profilo Sensoriale (RATA)</strong><br>
            <em style="font-size: 0.9rem; color: #555;">Rapidità ed Efficienza</em><br>
            Metodo <em>Rate-All-That-Apply</em> per ridurre l'affaticamento del giudice e massimizzare la precisione.
        </li>
        <li style="margin-bottom: 15px;">
            <strong>3. Video Intervista AI</strong><br>
            <em style="font-size: 0.9rem; color: #555;">Oltre le parole</em><br>
            Simulazione di analisi avanzata: Micro-espressioni facciali e Sentiment Analysis.
        </li>
        <li style="margin-bottom: 15px;">
            <strong>4. Big 5 Personality Traits</strong><br>
            <em style="font-size: 0.9rem; color: #555;">Segmentazione Psicografica</em><br>
            Correlazione tra preferenze di gusto e tratti psicologici del consumatore.
        </li>
    </ul>`;
}

// --- PAGINA 1: INTRODUZIONE ---
const introPage = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <div class="sample-block" style="text-align: left; max-width: 900px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
                <img src="${STUDY_CONFIG.logoURL}" alt="Logo" style="max-width: 180px; margin-bottom: 15px;">
                <div style="font-size: 0.9rem; color: #7f8c8d; display: flex; justify-content: center; gap: 20px;">
                    <span>✉️ ${STUDY_CONFIG.companyEmail}</span>
                    <span>📞 ${STUDY_CONFIG.companyPhone}</span>
                </div>
            </div>
            <div style="text-align: center;">
                <h1 style="color: #2c3e50; margin-bottom: 5px;">Giotto Wine Listener</h1>
                <h3 style="color: #e67e22; margin-top: 0;">Sensory experience Demo</h3>
            </div>
            <p style="font-size: 1.1rem; text-align: center;">
                Benvenuto nella dimostrazione della nostra piattaforma di analisi sensoriale integrata.<br>
                In questa sessione simuleremo un test con <strong>1 Campione Demo</strong>.
            </p>
            <div style="background: #fff; padding: 20px; border-radius: 8px; border-left: 5px solid #3498db; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-top: 20px;">
                ${generateDemoTaskList()}
            </div>
        </div>
    `,
    choices: ["Procedi al Consenso"]
};

// --- PAGINA 2: DICHIARAZIONE DI CONSENSO E FIRMA ---
const signaturePage = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <div class="sample-block" style="text-align: left; max-width: 900px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="${STUDY_CONFIG.logoURL}" alt="Logo" style="max-width: 100px; margin-bottom: 10px; opacity: 0.7;">
                <h2 style="color: #2c3e50; margin-top: 0;">Dichiarazione di Consenso</h2>
            </div>

            <div style="margin-bottom: 20px; padding: 15px; background: #fff8e1; border: 1px dashed #f1c40f; border-radius: 5px; text-align: center; color: #7f6000; font-size: 0.95rem;">
                <strong>PROVA DIMOSTRATIVA:</strong> Questa sessione è a solo scopo illustrativo. 
                Nessun dato personale o sensoriale verrà collezionato, salvato o analizzato.
            </div>

            <div style="background: #fdfdfd; padding: 25px; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 4px 10px rgba(0,0,0,0.05); font-size: 0.95rem; line-height: 1.5; color: #333;">
                
                <p>Procedendo con il test e cliccando sul tasto <strong>"Inizia"</strong>, dichiaro di:</p>
                
                <ul style="margin-bottom: 20px;">
                    <li style="margin-bottom: 8px;">Avere almeno <strong>18 anni</strong>.</li>
                    <li style="margin-bottom: 8px;">Avere compreso le finalità e le modalità del trattamento dei dati descritte nell'informativa.</li>
                    <li style="margin-bottom: 8px;">Acconsentire liberamente al trattamento dei miei dati personali per gli scopi della ricerca.</li>
                    <li style="margin-bottom: 8px;">Essere consapevole che posso interrompere il test in qualsiasi momento senza alcuna penalità.</li>
                    <li style="margin-bottom: 8px; color: #c0392b;"><strong>Essere consapevole che il consumo di campioni alcolici può alterare la capacità di guida e di assumermi la responsabilità di non pormi alla guida fino al completo smaltimento.</strong></li>
                </ul>

                <p style="font-style: italic; border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px;">
                    Il sottoscritto dichiara di aver letto e compreso la presente informativa e presta liberamente il proprio consenso al trattamento dei dati personali, inclusi quelli sensoriali e demografici, per le finalità di ricerca descritte.
                </p>

                <div style="margin-top: 30px;">
                    <div style="margin-bottom: 25px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 8px; color: #2c3e50;">Nome e Cognome:</label>
                        <input type="text" id="full-name" placeholder="Mario Rossi" 
                            style="width: 100%; max-width: 400px; padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem;">
                    </div>

                    <div style="margin-bottom: 10px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 8px; color: #2c3e50;">Firma Digitale:</label>
                        <div style="border: 2px dashed #bbb; background: #fff; height: 180px; position: relative; border-radius: 4px;">
                            <canvas id="signature-canvas" style="width: 100%; height: 100%; display: block; touch-action: none;"></canvas>
                        </div>
                        <div style="text-align: right; margin-top: 8px;">
                            <button type="button" id="clear-btn" style="padding: 6px 15px; font-size: 0.85rem; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                Cancella e rifai la firma
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    choices: ["Inizia"],

    on_load: function () {
        const canvas = document.getElementById("signature-canvas");
        const clearBtn = document.getElementById("clear-btn");

        function resizeCanvas() {
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
        }

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const signaturePad = new SignaturePad(canvas, {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            penColor: 'rgb(0, 0, 0)'
        });

        clearBtn.addEventListener("click", () => {
            signaturePad.clear();
        });
    }
};

// --- ESPORTAZIONE ---
const consentTrial = {
    timeline: [introPage, signaturePage]
};