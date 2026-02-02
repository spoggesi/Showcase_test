// ============================================================
// FILE: js/mock_interview.js
// DESCRIZIONE: Simulazione Video Intervista (NO CAM/MIC)
// ============================================================

function generateInterviewIntro() {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div class="sample-block" style="max-width: 800px; margin: 0 auto; text-align: left;">
                <h2 style="color: #16a085; text-align: center;">Fase 4: Deep Insight (Video AI)</h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;">
                    <div>
                        <h4 style="color: #2c3e50;">Oltre le parole</h4>
                        <p>Spesso i consumatori dicono una cosa ma ne pensano un'altra. Il testo trascritto racconta solo metà della storia.</p>
                        <p>La nostra tecnologia video cattura il <strong>Non-Verbale</strong> per validare la veridicità dell'opinione.</p>
                    </div>
                    
                    <div style="background: #e8f6f3; padding: 15px; border-radius: 8px;">
                        <h4 style="color: #16a085; margin-top:0;">Cosa Analizziamo:</h4>
                        <ul style="font-size: 0.9rem;">
                            <li><strong>Micro-espressioni:</strong> Gioia, Sorpresa, Disgusto (millisecondi).</li>
                            <li><strong>Arousal Vocale:</strong> Tono di voce ed esitazioni.</li>
                            <li><strong>Sentiment:</strong> Positività/Negatività del linguaggio.</li>
                        </ul>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #7f8c8d;">Nella prossima schermata vedrai una simulazione (senza registrazione reale).</p>
                </div>
            </div>
        `,
        choices: ["Vedi Demo Video"]
    };
}


function createMockVideoTrial(sampleCode) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div class="sample-block" style="max-width: 900px; margin: 0 auto;">
                
                <div style="margin-bottom: 20px; text-align: left; background: #e8f6f3; padding: 20px; border-radius: 8px; border-left: 5px solid #1abc9c;">
                    <h3 style="margin-top: 0; color: #16a085;">Modulo Video Insight (Demo)</h3>
                    <p>In una sessione reale, qui verrebbe attivata la webcam del partecipante.</p>
                    <p>Il nostro sistema registra e analizza in tempo reale:</p>
                    <ul style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <li>👁️ <strong>Facial Coding:</strong> Felicità, Sorpresa, Disgusto</li>
                        <li>🗣️ <strong>Analisi Vocale:</strong> Tono, pause, velocità</li>
                        <li>📝 <strong>Trascrizione:</strong> Speech-to-Text automatico</li>
                        <li>🧠 <strong>Sentiment:</strong> Positivo / Neutro / Negativo</li>
                    </ul>
                </div>

                <div style="position: relative; width: 640px; height: 360px; margin: 0 auto; background: #2c3e50; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; flex-direction: column;">
                    
                    <div id="camera-placeholder" style="color: white; text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 10px;">📷</div>
                        <p style="font-size: 1.2rem;">Simulazione Camera</p>
                        <p style="font-size: 0.9rem; color: #95a5a6;">(Nessuna registrazione attiva)</p>
                    </div>

                    <div id="recording-overlay" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10; flex-direction: column; align-items: center; justify-content: center;">
                        <div style="color: #e74c3c; font-weight: bold; font-size: 1.5rem; margin-bottom: 20px; animation: pulse 1.5s infinite;">
                            🔴 REC SIMULATA
                        </div>
                        <div style="width: 80%; background: #333; height: 10px; border-radius: 5px; overflow: hidden;">
                            <div id="progress-bar" style="width: 0%; height: 100%; background: #e74c3c; transition: width 0.1s linear;"></div>
                        </div>
                        <p style="color: white; margin-top: 15px;">Acquisizione Dati Biometrici...</p>
                    </div>

                    <div id="results-overlay" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.95); z-index: 20; color: #333; padding: 20px;">
                        <h3 style="color: #27ae60;">Analisi Completata (Esempio)</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: left; margin-top: 20px;">
                            <div style="background: #eee; padding: 10px; border-radius: 5px;">
                                <strong>Dominante Emozionale:</strong><br>
                                <span style="color: #27ae60; font-size: 1.2rem;">Gioia (78%)</span>
                            </div>
                            <div style="background: #eee; padding: 10px; border-radius: 5px;">
                                <strong>Sentiment:</strong><br>
                                <span style="color: #3498db; font-size: 1.2rem;">Molto Positivo</span>
                            </div>
                            <div style="background: #eee; padding: 10px; border-radius: 5px; grid-column: span 2;">
                                <strong>Keywords Estratte:</strong><br>
                                <em>"Fresco", "Estivo", "Piacevole", "Fruttato"</em>
                            </div>
                        </div>
                    </div>

                </div>

                <style>@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }</style>

                <div style="margin-top: 20px;">
                    <button id="btn-start-sim" class="jspsych-btn" style="background-color: #3498db; border: none; padding: 12px 30px; font-weight: bold; color: white; font-size: 1.1rem;">
                        Avvia Simulazione Intervista
                    </button>
                    <button id="btn-finish-sim" class="jspsych-btn" style="display: none; background-color: #27ae60; border: none; padding: 12px 30px; font-weight: bold; color: white; font-size: 1.1rem;">
                        Prosegui
                    </button>
                </div>
            </div>
        `,
        choices: [],
        on_load: function() {
            const btnStart = document.getElementById('btn-start-sim');
            const btnFinish = document.getElementById('btn-finish-sim');
            const overlayRec = document.getElementById('recording-overlay');
            const overlayRes = document.getElementById('results-overlay');
            const progressBar = document.getElementById('progress-bar');
            
            btnStart.addEventListener('click', function() {
                btnStart.style.display = 'none';
                overlayRec.style.display = 'flex';
                
                // Simula 3 secondi di registrazione
                let progress = 0;
                const duration = 3000; // 3 secondi
                const interval = 50;
                
                const timer = setInterval(() => {
                    progress += (interval / duration) * 100;
                    progressBar.style.width = progress + "%";
                    
                    if (progress >= 100) {
                        clearInterval(timer);
                        overlayRec.style.display = 'none';
                        overlayRes.style.display = 'block'; // Mostra finti risultati
                        btnFinish.style.display = 'inline-block';
                    }
                }, interval);
            });

            btnFinish.addEventListener('click', function() {
                jsPsych.finishTrial({ simulated: true });
            });
        }
    };
}