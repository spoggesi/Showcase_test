// Configurazione del tuo Webhook (creeremo questo URL nel passaggio 2)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz7rFrBoesc4oQRFgG6k3J_TUs7odqOiqyh5xZ5ujbYS9UsaiMPLHS4Zi1RgGyQhM1VbQ/exec";

function generateContactPage() {
    return {
        type: jsPsychSurveyHtmlForm,
        html: `
            <div class="sample-block" style="max-width: 800px; margin: 0 auto; text-align: center;">
                <img src="files/logo.png" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
                <h2 style="color: #2c3e50;">Ti è piaciuta la prova?</h2>
                <p style="font-size: 1.1rem; color: #7f8c8d; margin-bottom: 30px;">
                    Vorresti essere contattato da noi per approfondire come integrare queste tecnologie nel tuo business?
                </p>

                <div id="selection-buttons" style="display: flex; justify-content: center; gap: 20px; margin-bottom: 30px;">
                    <button type="button" id="btn-no" class="jspsych-btn" style="background: #95a5a6; border-radius: 30px; padding: 10px 40px;">NO, grazie</button>
                    <button type="button" id="btn-si" class="jspsych-btn" style="background: #27ae60; border-radius: 30px; padding: 10px 40px;">SÌ, volentieri</button>
                </div>

                <div id="contact-form" style="display: none; background: #f9f9f9; padding: 25px; border-radius: 10px; text-align: left; transition: all 0.3s ease;">
                    <div style="margin-bottom: 15px;">
                        <label style="display:block; font-weight:bold; margin-bottom:5px;">Nome e Cognome *</label>
                        <input name="fullname" type="text" id="input-name" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:5px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display:block; font-weight:bold; margin-bottom:5px;">E-mail *</label>
                        <input name="email" type="email" id="input-email" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:5px;">
                    </div>
                    <p style="font-size: 0.8rem; color: #999;">* Campi obbligatori. Cliccando su invia autorizzi il trattamento dei dati per la richiesta di contatto.</p>
                </div>
            </div>
        `,
        button_label: "Continua",
        on_load: function () {
            // Nascondiamo il tasto "Continua" di jsPsych all'inizio
            const submitBtn = document.getElementById('jspsych-survey-html-form-next');
            submitBtn.style.display = 'none';

            document.getElementById('btn-no').onclick = function () {
                // Se clicca NO, salva la risposta e prosegue
                jsPsych.finishTrial({ want_contact: "NO" });
            };

            document.getElementById('btn-si').onclick = function () {
                // Se clicca SI, mostra il form e il tasto per inviare
                document.getElementById('contact-form').style.display = 'block';
                document.getElementById('selection-buttons').style.display = 'none';
                submitBtn.style.display = 'inline-block';
                submitBtn.innerHTML = "Invia e Concludi";
            };
        },
        on_finish: function (data) {
            // Se l'utente ha lasciato i dati, mandali a Google
            if (data.response && data.response.email) {
                const payload = {
                    nome: data.response.fullname,
                    email: data.response.email,
                    data: new Date().toLocaleString(),
                    studio: "Giotto Demo"
                };

                // Invio asincrono a Google Sheets (Webhook)
                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }
        }
    };
}

function generateFinalPage() {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div class="sample-block" style="max-width: 800px; margin: 0 auto; padding-top: 40px; text-align: center;">
                <img src="files/logo.png" alt="Giotto Wine Listener" style="max-width: 200px; margin-bottom: 30px;">
                <h1 style="color: #2c3e50; margin-bottom: 10px;">Grazie per aver provato la Demo</h1>
                <p style="font-size: 1.3rem; color: #7f8c8d;">Hai appena sperimentato il futuro dell'analisi sensoriale in enologia.</p>
                <hr style="width: 60%; margin: 40px auto; border-top: 1px solid #ddd;">
                <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
                    <h3 style="margin-top: 0; color: #2c3e50;">Team Giotto Consulting</h3>
                    <div style="margin-top: 30px; display: flex; flex-direction: column; gap: 15px; align-items: center;">
                        <a href="mailto:info@giottoconsulting.it" style="background-color: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 1.1rem;">
                            ✉️ info@giottoconsulting.it
                        </a>
                        <a href="tel:+390438971719" style="color: #2c3e50; text-decoration: none; font-weight: bold; font-size: 1.1rem;">
                            📞 +39 0438 971719
                        </a>
                    </div>
                </div>
            </div>
        `,
        choices: ["Fine Demo"] // Aggiungiamo un tasto per chiudere lo studio in JATOS
    };
}