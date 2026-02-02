// ============================================================
// FILE: js/real_interview.js
// DESCRIZIONE: Video Intervista con AI REALE (Face-API)
// ============================================================

// Carichiamo la libreria face-api da CDN
const FACE_API_CDN = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";

function loadScript(url) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${url}"]`)) return resolve();
        let script = document.createElement("script");
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function createRealVideoTrial(sampleCode) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div class="sample-block" style="max-width: 900px; margin: 0 auto;">
                <h3 style="color: #16a085;">Analisi Biometrica in Tempo Reale</h3>
                
                <div id="intro-info" style="background: #e8f8f5; border-left: 5px solid #16a085; padding: 20px; text-align: left; margin-bottom: 20px; border-radius: 5px; color: #2c3e50;">
                    <p style="margin-top: 0; font-weight: bold;">Nota Tecnica:</p>
                    <p>Quello che vedete ora è una versione leggera dell'algoritmo che gira direttamente nel browser per darvi un feedback istantaneo.</p>
                    <p style="margin-bottom: 0;">Il sistema registrerà per massimo <strong>30 secondi</strong>.</p>
                </div>

                <!-- CONTENITORE VIDEO (visibile durante la registrazione) -->
                <div id="video-container" style="position: relative; width: 640px; height: 480px; margin: 0 auto; background: #000; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                    <video id="inputVideo" autoplay muted playsinline style="width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1);"></video>
                    
                    <canvas id="overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; transform: scaleX(-1);"></canvas>

                    <!-- Feedback Emozione Real-time -->
                    <div style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 10px; border-radius: 5px; font-size: 0.9rem; text-align: left; transform: scaleX(1) !important;">
                        <strong>Dominante:</strong> <span id="emotion-label" style="color: #f1c40f;">Attesa...</span><br>
                        <strong>Confidence:</strong> <span id="emotion-conf">0%</span>
                    </div>

                     <!-- Timer -->
                    <div style="position: absolute; top: 10px; right: 10px; background: rgba(255, 0, 0, 0.7); color: white; padding: 10px; border-radius: 50%; width: 40px; height: 40px; line-height: 40px; text-align: center; font-weight: bold; font-size: 1.2rem; transform: scaleX(1) !important;">
                        <span id="timer-display">30</span>
                    </div>

                    <!-- Feedback Testo Real-time -->
                    <div style="position: absolute; bottom: 10px; width: 90%; left: 5%; background: rgba(0,0,0,0.6); color: white; padding: 10px; border-radius: 5px; text-align: center; min-height: 40px;">
                        🗣️ <span id="speech-text" style="font-style: italic;">Parla per vedere il testo...</span>
                    </div>
                </div>

                <!-- CONTENITORE RISULTATI (visibile dopo la registrazione) -->
                <div id="results-container" style="display: none; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-top: 20px;">
                    <h4 style="color: #2c3e50; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px;">Riepilogo Sessione</h4>
                    
                    <div style="display: flex; gap: 20px; align-items: flex-start; text-align: left;">
                        <!-- Colonna Trascrizione -->
                        <div style="flex: 1;">
                            <h5 style="margin-top: 0;">Trascrizione Parlato</h5>
                            <div id="final-transcript" style="background: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #ddd; max-height: 300px; overflow-y: auto; font-style: italic; color: #555;">
                                Nessun parlato rilevato.
                            </div>
                        </div>

                        <!-- Colonna Emozioni -->
                        <div style="flex: 1;">
                            <h5 style="margin-top: 0;">Media Emozioni</h5>
                            <div id="emotions-chart" style="width: 100%;">
                                <!-- Qui verranno inserite le barre via JS -->
                            </div>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 20px;">
                    <button id="btn-start-ai" class="jspsych-btn" style="background-color: #3498db; border: none; padding: 12px 30px; font-weight: bold; color: white;">
                        Avvia Camera & AI
                    </button>
                    <button id="btn-stop-ai" class="jspsych-btn" style="display: none; background-color: #c0392b; border: none; padding: 12px 30px; font-weight: bold; color: white;">
                        Termina Registrazione
                    </button>
                    <button id="btn-finish-trial" class="jspsych-btn" style="display: none; background-color: #27ae60; border: none; padding: 12px 30px; font-weight: bold; color: white;">
                        Concludi e Prosegui >>
                    </button>
                </div>
                <p id="loading-text" style="display:none; color: #e67e22; font-weight: bold;">Caricamento Modelli Neurali... (può richiedere qualche secondo)</p>
            </div>
        `,
        choices: [],

        on_load: async function () {
            // Elementi DOM
            const btnStart = document.getElementById('btn-start-ai');
            const btnStop = document.getElementById('btn-stop-ai');
            const btnFinish = document.getElementById('btn-finish-trial');

            const videoContainer = document.getElementById('video-container');
            const resultsContainer = document.getElementById('results-container');

            const video = document.getElementById('inputVideo');
            const canvas = document.getElementById('overlay');
            const emotionLabel = document.getElementById('emotion-label');
            const emotionConf = document.getElementById('emotion-conf');

            const speechText = document.getElementById('speech-text');
            const finalTranscriptDiv = document.getElementById('final-transcript');
            const emotionsChartDiv = document.getElementById('emotions-chart');

            const loadingText = document.getElementById('loading-text');
            const timerDisplay = document.getElementById('timer-display');
            const introInfo = document.getElementById('intro-info');

            // Variabili di stato
            let streamObj = null;
            let intervalId = null;
            let recognition = null;
            let timerInterval = null;

            const MAX_SECONDS = 30;
            let secondsLeft = MAX_SECONDS;

            let accumulatedTranscript = "";
            let emotionSums = {
                neutral: 0, happy: 0, sad: 0, angry: 0, fearful: 0, disgusted: 0, surprised: 0
            };
            let frameCount = 0;

            const LABELS_IT = {
                neutral: "Neutro", happy: "Felice", sad: "Triste",
                angry: "Arrabbiato", fearful: "Impaurito",
                disgusted: "Disgustato", surprised: "Sorpreso"
            };

            const EMOTION_COLORS = {
                neutral: "#95a5a6", happy: "#2ecc71", sad: "#3498db",
                angry: "#e74c3c", fearful: "#9b59b6", disgusted: "#2c3e50", surprised: "#f1c40f"
            };

            await loadScript(FACE_API_CDN);

            // --- FUNZIONE DI STOP E GENERAZIONE REPORT ---
            const stopRecording = () => {
                if (intervalId) clearInterval(intervalId);
                if (timerInterval) clearInterval(timerInterval);
                if (recognition) recognition.stop();
                if (streamObj) streamObj.getTracks().forEach(track => track.stop());

                // UI Update
                btnStop.style.display = 'none';
                videoContainer.style.display = 'none';
                introInfo.style.display = 'none'; // Nascondiamo info iniziali per pulizia
                resultsContainer.style.display = 'block';
                btnFinish.style.display = 'inline-block';

                // 1. Popola Trascrizione
                if (accumulatedTranscript.trim().length > 0) {
                    finalTranscriptDiv.innerText = accumulatedTranscript;
                } else {
                    finalTranscriptDiv.innerText = "Nessun parlato rilevato (oppure browser non supportato).";
                }

                // 2. Calcola e Mostra Medie Emozioni
                emotionsChartDiv.innerHTML = "";
                if (frameCount > 0) {
                    // Ordina le emozioni per media decrescente
                    const resultStats = Object.keys(emotionSums).map(emo => {
                        return {
                            emotion: emo,
                            avg: (emotionSums[emo] / frameCount) * 100
                        };
                    }).sort((a, b) => b.avg - a.avg);

                    resultStats.forEach(item => {
                        const pct = item.avg.toFixed(1);
                        if (item.avg > 1) { // Mostra solo se rilevante (> 1%)
                            const row = document.createElement('div');
                            row.style.marginBottom = "8px";
                            row.innerHTML = `
                                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 2px;">
                                    <span>${LABELS_IT[item.emotion]}</span>
                                    <span>${pct}%</span>
                                </div>
                                <div style="width: 100%; background: #eee; height: 10px; border-radius: 5px; overflow: hidden;">
                                    <div style="width: ${pct}%; background: ${EMOTION_COLORS[item.emotion]}; height: 100%;"></div>
                                </div>
                            `;
                            emotionsChartDiv.appendChild(row);
                        }
                    });
                } else {
                    emotionsChartDiv.innerText = "Nessun volto rilevato per calcolare le statistiche.";
                }
            };

            // --- AVVIO REGISTRAZIONE ---
            btnStart.addEventListener('click', async () => {
                btnStart.style.display = 'none';
                loadingText.style.display = 'block';

                try {
                    await faceapi.nets.tinyFaceDetector.loadFromUri('files/models');
                    await faceapi.nets.faceExpressionNet.loadFromUri('files/models');

                    streamObj = await navigator.mediaDevices.getUserMedia({ video: {}, audio: true });
                    video.srcObject = streamObj;

                    loadingText.style.display = 'none';
                    btnStop.style.display = 'inline-block';

                    // Avvia Speech Recognition
                    if ('webkitSpeechRecognition' in window) {
                        recognition = new webkitSpeechRecognition();
                        recognition.continuous = true;
                        recognition.interimResults = true;
                        recognition.lang = 'it-IT';

                        recognition.onresult = (event) => {
                            let interim = '';
                            let final = '';

                            for (let i = event.resultIndex; i < event.results.length; ++i) {
                                if (event.results[i].isFinal) {
                                    final += event.results[i][0].transcript;
                                } else {
                                    interim += event.results[i][0].transcript;
                                }
                            }

                            // Aggiorna UI real-time
                            speechText.innerText = interim || final || "...";

                            // Accumula testo finale
                            if (final) {
                                accumulatedTranscript += final + " ";
                            }
                        };
                        recognition.start();
                    } else {
                        speechText.innerText = "Speech-to-text non supportato su questo browser.";
                    }

                    // Avvia Timer
                    timerDisplay.innerText = secondsLeft;
                    timerInterval = setInterval(() => {
                        secondsLeft--;
                        timerDisplay.innerText = secondsLeft;
                        if (secondsLeft <= 0) {
                            stopRecording();
                        }
                    }, 1000);

                    // Avvia Face Detection Loop
                    video.addEventListener('play', () => {
                        const displaySize = { width: video.clientWidth, height: video.clientHeight };
                        faceapi.matchDimensions(canvas, displaySize);

                        intervalId = setInterval(async () => {
                            // Se il video è in pausa o finito, esci
                            if (video.paused || video.ended) return;

                            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();

                            // Pulisci canvas
                            const ctx = canvas.getContext('2d');
                            ctx.clearRect(0, 0, canvas.width, canvas.height);

                            if (detections && detections.length > 0) {
                                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                                faceapi.draw.drawDetections(canvas, resizedDetections);

                                const expressions = detections[0].expressions;

                                // Accumula per media
                                frameCount++;
                                for (const [emo, val] of Object.entries(expressions)) {
                                    if (emotionSums[emo] !== undefined) {
                                        emotionSums[emo] += val;
                                    }
                                }

                                // Visualizza dominante real-time
                                const sorted = Object.keys(expressions).sort((a, b) => expressions[b] - expressions[a]);
                                const topEmotion = sorted[0];
                                const score = Math.round(expressions[topEmotion] * 100);

                                emotionLabel.innerText = LABELS_IT[topEmotion] || topEmotion;
                                emotionLabel.style.color = EMOTION_COLORS[topEmotion] || '#f1c40f';
                                emotionConf.innerText = score + "%";
                            }
                        }, 100);
                    });

                } catch (err) {
                    console.error(err);
                    alert("Errore avvio AI: " + err.message);
                    loadingText.innerText = "Errore durante il caricamento AI.";
                    // Mostra stop per permettere di uscire
                    btnStop.style.display = 'inline-block';
                }
            });

            // Gestione Pulsante Stop Manuale
            btnStop.addEventListener('click', stopRecording);

            // Gestione Pulsante Finale (Salva e procedi)
            btnFinish.addEventListener('click', () => {
                // Calcola medie finali per salvarle nei dati
                let finalStats = {};
                if (frameCount > 0) {
                    for (const [emo, sum] of Object.entries(emotionSums)) {
                        finalStats[emo] = sum / frameCount;
                    }
                }

                jsPsych.finishTrial({
                    ai_performed: true,
                    duration_seconds: MAX_SECONDS - secondsLeft,
                    transcript: accumulatedTranscript.trim(),
                    emotion_averages: finalStats,
                    frame_count: frameCount
                });
            });
        }
    };
}