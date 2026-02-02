// ============================================================
// FILE: js/interview_chooser.js
// VERSIONE: Standard (Usa il tuo CSS per il bottone Continua)
// ============================================================

function generateInterviewSelection(sampleCode) {
    
    // Variabile per salvare la scelta
    let selection = "";

    // 1. Schermata di Scelta
    const choiceTrial = {
        type: jsPsychHtmlButtonResponse,
        // Usiamo un solo bottone. Il tuo CSS lo metterà in basso a destra.
        choices: ['Continua'], 
        
        // HTML dei riquadri di scelta
        stimulus: `
            <style>
                /* Layout base per affiancare i box */
                .chooser-container {
                    display: flex;
                    flex-wrap: wrap; /* Va a capo su schermi piccoli */
                    justify-content: center;
                    gap: 20px;
                    margin-bottom: 30px;
                    width: 100%;
                }
                
                /* Stile dei riquadri (neutro) */
                .option-card {
                    flex: 1;
                    min-width: 250px;
                    padding: 20px;
                    border: 2px solid #ccc;
                    border-radius: 8px;
                    background: #fff;
                    cursor: pointer;
                    transition: border-color 0.2s, background-color 0.2s;
                }

                /* Effetto Hover */
                .option-card:hover {
                    border-color: #888;
                }

                /* Classe che applicheremo quando selezionato */
                .option-card.active {
                    border-color: #3498db;
                    background-color: #eaf6ff;
                    box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
                }

                .card-title { font-weight: bold; font-size: 1.2rem; margin-bottom: 10px; color: #333; }
                .card-body { font-size: 0.95rem; color: #666; }
            </style>

            <div>
                <h2>Seleziona Modalità</h2>
                <p>Clicca su un riquadro per selezionarlo.</p>

                <div class="chooser-container">
                    
                    <div id="opt-mock" class="option-card" onclick="setSelection('mock')">
                        <div class="card-title">🎬 Versione Demo</div>
                        <div class="card-body">
                            Simulazione grafica.<br>
                            Nessun accesso a webcam/mic.
                        </div>
                    </div>

                    <div id="opt-real" class="option-card" onclick="setSelection('real')">
                        <div class="card-title">🤖 Versione Live AI</div>
                        <div class="card-body">
                            Analisi reale.<br>
                            Richiede Webcam e Microfono.
                        </div>
                    </div>

                </div>
            </div>
        `,
        
        on_load: function() {
            // Troviamo il bottone "Continua" generato da jsPsych
            const btn = document.querySelector('.jspsych-btn');
            
            // Lo disabilitiamo finché non si sceglie
            if(btn) {
                btn.disabled = true;
                btn.style.opacity = "0.5";
            }

            // Funzione globale per gestire il click sui box
            window.setSelection = function(type) {
                selection = type;

                // Gestione grafica (Rimuovi classe active dagli altri, aggiungi a questo)
                document.querySelectorAll('.option-card').forEach(el => el.classList.remove('active'));
                document.getElementById('opt-' + type).classList.add('active');

                // Abilita il bottone
                if(btn) {
                    btn.disabled = false;
                    btn.style.opacity = "1";
                }
            };
        },

        on_finish: function(data) {
            data.selection = selection;
        }
    };

    // 2. Logica Condizionale
    const ifMock = {
        timeline: [createMockVideoTrial(sampleCode)],
        conditional_function: function() {
            const data = jsPsych.data.get().last(1).values()[0];
            return data && data.selection === 'mock';
        }
    };

    const ifReal = {
        timeline: [createRealVideoTrial(sampleCode)],
        conditional_function: function() {
            const data = jsPsych.data.get().last(1).values()[0];
            return data && data.selection === 'real';
        }
    };

    return [choiceTrial, ifMock, ifReal];
}