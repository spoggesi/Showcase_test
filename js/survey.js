// ============================================================
// FILE: js/survey.js
// DESCRIZIONE: BFI-10 (Big Five Inventory - 10 Items)
// VERSIONE: Calcolo automatico punteggi e salvataggio piatto
// ============================================================

function generateSurveyIntro() {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div class="sample-block" style="max-width: 800px; margin: 0 auto; text-align: left;">
                <h2 style="color: #2980b9; text-align: center;">Fase 5: Segmentazione Psicografica</h2>
                
                <div style="background: #eaf2f8; padding: 20px; border-radius: 8px; border-left: 5px solid #2980b9; margin: 20px 0;">
                    <p style="margin-top:0;"><strong>Chi è il tuo consumatore ideale?</strong></p>
                    <p>Non basta sapere "Donna, 35 anni". Dobbiamo sapere <em>come pensa</em>.</p>
                </div>

                <p>Utilizziamo il modello scientifico <strong>Big Five (BFI-10)</strong> per correlare i gusti alla personalità:</p>
                <ul style="font-size: 1.1rem; line-height: 1.6;">
                    <li><strong>Apertura all'esperienza:</strong> Chi cerca vini nuovi vs tradizionali.</li>
                    <li><strong>Coscienziosità:</strong> Chi cerca etichette dettagliate e certificazioni.</li>
                    <li><strong>Estroversione:</strong> Consumo sociale vs meditativo.</li>
                </ul>

                <p>Questo permette di creare campagne di marketing mirate sulla psicologia del cliente, non solo sull'anagrafica.</p>
            </div>
        `,
        choices: ["Vai al Questionario"]
    };
}

// --- 1. CONFIGURAZIONE ITEMS E LOGICA DI SCORING ---
// Definiamo qui le domande, a quale tratto appartengono e se vanno invertite (R)
const BFI_CONFIG = [
    { id: 1, text: "... è riservata", trait: "Extraversion", reverse: true },
    { id: 2, text: "... si fida in genere degli altri", trait: "Agreeableness", reverse: false },
    { id: 3, text: "... tende ad essere pigra", trait: "Conscientiousness", reverse: true },
    { id: 4, text: "... è rilassata, gestisce bene lo stress", trait: "Neuroticism", reverse: true },
    { id: 5, text: "... ha pochi interessi artistici", trait: "Openness", reverse: true },
    { id: 6, text: "... è estroversa, socievole", trait: "Extraversion", reverse: false },
    { id: 7, text: "... tende a trovare difetti negli altri", trait: "Agreeableness", reverse: true },
    { id: 8, text: "... fa un lavoro accurato", trait: "Conscientiousness", reverse: false },
    { id: 9, text: "... si innervosisce facilmente", trait: "Neuroticism", reverse: false },
    { id: 10, text: "... ha un'immaginazione attiva", trait: "Openness", reverse: false }
];

// Scala Likert 1-5
const BFI_ANCHORS = [
    "Fortemente in<br>disaccordo",
    "In disaccordo",
    "Né d'accordo<br>né disaccordo",
    "D'accordo",
    "Fortemente<br>d'accordo"
];

// --- 2. GENERATORE GRIGLIA HTML (Responsive & Mobile Friendly) ---
function createBFIGrid(itemsConfig, anchors) {
    let html = `
    <style>
        .bfi-container { 
            max-width: 900px; 
            margin: 0 auto; 
            text-align: left; 
            font-family: 'Arial', sans-serif;
        }
        /* Wrapper scrollabile per mobile */
        .table-responsive {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
            margin-bottom: 20px;
        }
        .bfi-table { 
            width: 100%; 
            min-width: 600px; 
            border-collapse: collapse; 
            margin-top: 10px; 
            font-size: 0.95rem; 
        }
        
        /* Intestazione Sticky */
        .bfi-table th { 
            position: sticky;
            top: 0;
            z-index: 10;
            text-align: center; 
            padding: 10px 5px; 
            background-color: #f1f3f5; 
            border-bottom: 2px solid #ccc;
            font-weight: bold;
            vertical-align: bottom;
            line-height: 1.2;
        }
        
        .bfi-table .question-col { 
            text-align: left; 
            padding: 12px 15px; 
            width: 40%; 
            font-weight: 500;
            border-right: 1px solid #eee;
            background-color: #fff;
        }

        .bfi-table td { 
            text-align: center; 
            padding: 10px; 
            border-bottom: 1px solid #eee; 
            vertical-align: middle;
        }

        /* Zebra Striping */
        .bfi-table tr:nth-child(even) td { background-color: #fafafa; }
        .bfi-table tr:hover td { background-color: #e8f0fe; transition: background 0.2s; }

        /* Radio Buttons */
        input[type=radio] { 
            transform: scale(1.5); 
            cursor: pointer; 
            margin: 0;
        }
        
        @media (max-width: 600px) {
            .bfi-table { font-size: 0.85rem; }
        }
    </style>

    <div class="bfi-container">
        <h3>Istruzioni</h3>
        <p>Qui di seguito trovi una serie di affermazioni che potrebbero descriverti. 
        Indica quanto sei d'accordo o in disaccordo con ciascuna affermazione.</p>
        
        <div style="background:#eef; padding:10px; border-radius:5px; margin-bottom:15px; text-align:center;">
            <strong>"Vedo me stesso come una persona che..."</strong>
        </div>

        <div class="table-responsive">
            <table class="bfi-table">
                <thead>
                    <tr>
                        <th class="question-col">Affermazione</th>
                        ${anchors.map(a => `<th>${a}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
    `;

    itemsConfig.forEach((item) => {
        let rowName = `bfi_${item.id}`; // Es: bfi_1

        html += `<tr>
            <td class="question-col">${item.id}. ${item.text}</td>`;

        anchors.forEach((_, valIndex) => {
            let val = valIndex + 1;
            html += `<td>
                <input type="radio" name="${rowName}" value="${val}" required>
            </td>`;
        });

        html += `</tr>`;
    });

    html += `</tbody></table></div></div>`;
    return html;
}

// --- 3. BLOCCO JSPSYCH (Configurato per jsPsychSurveyHtmlForm) ---
const surveyTimelineBlock = {
    // Usiamo il plugin survey-html-form
    type: jsPsychSurveyHtmlForm,

    // Generiamo l'HTML dinamicamente
    html: function () {
        return createBFIGrid(BFI_CONFIG, BFI_ANCHORS);
    },

    button_label: "Invia Risposte",

    data: {
        task: 'survey_bfi10'
    },

    on_finish: function (data) {
        // 1. Recupera le risposte grezze
        const responses = data.response;

        // Oggetto per accumulare i totali
        let totals = {
            Extraversion: 0,
            Agreeableness: 0,
            Conscientiousness: 0,
            Neuroticism: 0,
            Openness: 0
        };

        // 2. Calcolo punteggi (Gestione Reverse Items + Somma)
        BFI_CONFIG.forEach(item => {
            let key = `bfi_${item.id}`;

            if (responses && responses[key]) {
                let rawVal = parseInt(responses[key], 10);

                // Se è reverse (1 diventa 5, 5 diventa 1), formula: (Max+1) - Val
                let finalVal = item.reverse ? (6 - rawVal) : rawVal;

                totals[item.trait] += finalVal;
            }
        });

        // 3. Calcolo Medie e Salvataggio Dati "Piatti"
        // Ogni tratto ha 2 item. Media = Totale / 2.
        for (let trait in totals) {
            let averageScore = totals[trait] / 2;

            // A. Salva il dato numerico (Es: data.score_Extraversion = 3.5)
            // Questo è il dato cruciale per le analisi statistiche.
            data[`score_${trait}`] = averageScore;

            // B. Salva etichetta descrittiva (Es: data.label_Extraversion = "Alto")
            // Utile per un controllo rapido del dataset senza calcoli.
            let label = "Medio";
            if (averageScore <= 2.5) label = "Basso";
            else if (averageScore >= 3.5) label = "Alto";

            data[`label_${trait}`] = label;
        }

        // Debug console (visibile solo a te con F12)
        console.log("Dati salvati:", {
            Extraversion: data.score_Extraversion,
            Agreeableness: data.score_Agreeableness,
            Conscientiousness: data.score_Conscientiousness,
            Neuroticism: data.score_Neuroticism,
            Openness: data.score_Openness
        });
    }
};

// --- 4. FEEDBACK UTENTE (DESCRIZIONI OTTIMIZZATE PER CLIENT) ---
const BFI_DESCRIPTIONS = {
    Extraversion: {
        title: "Estroversione ed Energia",
        high: "Porti energia nei gruppi e tendi a cercare attivamente l'interazione. Sei percepito come una persona dinamica e comunicativa, capace di influenzare positivamente l'ambiente circostante con il tuo entusiasmo.",
        low: "Apprezzi l'ascolto e la riflessione profonda. Preferisci ambienti tranquilli dove puoi concentrarti e dai il meglio di te in interazioni individuali o in piccoli gruppi selezionati.",
        medium: "Sai adattarti con flessibilità: ti senti a tuo agio nelle situazioni sociali, ma rigeneri la tua energia anche attraverso momenti di piacevole tranquillità."
    },
    Agreeableness: {
        title: "Collaborazione e Amicalità",
        high: "Valorizzi l'armonia e la cooperazione. Sei naturalmente orientato al supporto degli altri e tendi a costruire relazioni basate sulla fiducia e sulla ricerca di soluzioni condivise.",
        low: "Ti distingui per il tuo spirito critico e la franchezza. Preferisci l'obiettività alla diplomazia e non temi di sostenere le tue idee, portando un punto di vista indipendente anche in situazioni competitive.",
        medium: "Mantieni un buon equilibrio tra l'essere collaborativo e il saper sostenere la tua posizione quando necessario, dosando empatia e pragmatismo."
    },
    Conscientiousness: {
        title: "Orientamento al Risultato e Metodo",
        high: "L'organizzazione è il tuo punto di forza. Sei affidabile, metodico e focalizzato sugli obiettivi a lungo termine. La tua disciplina ti permette di gestire progetti complessi con precisione.",
        low: "Ti muovi con naturalezza negli ambienti fluidi e preferisci la spontaneità alla pianificazione rigida. Questa flessibilità ti permette di reagire rapidamente agli imprevisti e di cogliere opportunità dell'ultimo minuto.",
        medium: "Riesci a essere organizzato senza perdere la capacità di adattamento. Sai quando seguire un piano rigoroso e quando è il momento di lasciar spazio alla flessibilità."
    },
    Neuroticism: {
        title: "Stabilità ed Equilibrio Emotivo",
        high: "Possiedi una grande sensibilità ed empatia verso l'ambiente circostante. Sei molto attento ai segnali esterni e la tua vivacità emotiva ti permette di vivere con intensità le sfide, portando passione in ciò che fai.",
        low: "Ti distingui per una notevole resilienza e stabilità. Mantieni la calma e l'obiettività anche sotto pressione, agendo come punto di riferimento equilibrato nelle situazioni di incertezza.",
        medium: "Gestisci bene le oscillazioni quotidiane dello stress. Sei consapevole delle tue emozioni e riesci generalmente a mantenere un approccio centrato e costruttivo di fronte alle difficoltà."
    },
    Openness: {
        title: "Apertura Mentale e Innovazione",
        high: "Sei un pensatore visionario e curioso. Ami esplorare nuovi concetti, valorizzi la creatività e cerchi costantemente modi originali per interpretare la realtà e risolvere problemi.",
        low: "Sei una persona concreta e pragmatica. Valorizzi l'esperienza consolidata e le tradizioni, preferendo soluzioni testate e affidabili che garantiscano stabilità e risultati tangibili.",
        medium: "Sai bilanciare innovazione e pragmatismo. Sei aperto al cambiamento ma solo se poggia su basi solide, integrando nuove idee con il valore della tradizione."
    }
};

function generateBigFiveFeedback() {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: function () {
            // Recupera l'ultimo trial del BFI
            const lastData = jsPsych.data.get().filter({ task: 'survey_bfi10' }).last(1).values()[0];

            if (!lastData || !lastData.score_Extraversion) {
                return "<p>Dati non disponibili.</p>";
            }

            return `
                <div style="max-width: 900px; margin: 0 auto; padding: 10px;">
                    <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">I tuoi risultati</h2>
                    
                    <div class="chart-container">
                        <canvas id="bfiRadarChart"></canvas>
                    </div>

                    <div class="bfi-feedback-grid">
                        ${["Extraversion", "Agreeableness", "Conscientiousness", "Neuroticism", "Openness"].map(trait => {
                const score = lastData[`score_${trait}`];
                const info = BFI_DESCRIPTIONS[trait];
                let color = score <= 2.5 ? "#e74c3c" : (score >= 3.5 ? "#27ae60" : "#f39c12");
                let desc = score <= 2.5 ? info.low : (score >= 3.5 ? info.high : info.medium);

                return `
                                <div style="background: white; border-radius: 12px; padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-top: 5px solid ${color};">
                                    <h4 style="margin: 0 0 10px 0; color: #34495e;">${info.title}</h4>
                                    <p style="font-size: 0.9rem; color: #555; line-height: 1.4; margin: 0;">${desc}</p>
                                </div>
                            `;
            }).join('')}
                    </div>
                </div>
            `;
        },
        on_load: function () {
            // Calcola i dati per il grafico
            const lastData = jsPsych.data.get().filter({ task: 'survey_bfi10' }).last(1).values()[0];

            // Per Stabilità Emotiva mostriamo il reciproco (6-X) così è tutto "High = Positive"
            const dataScores = [
                lastData.score_Extraversion,
                lastData.score_Agreeableness,
                lastData.score_Conscientiousness,
                (6 - lastData.score_Neuroticism), // Invertiamo per visualizzare "Stabilità"
                lastData.score_Openness
            ];

            const ctx = document.getElementById('bfiRadarChart').getContext('2d');
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Energia', 'Amicalità', 'Metodo', 'Stabilità', 'Innovazione'],
                    datasets: [{
                        label: 'Il tuo DNA Professionale',
                        data: dataScores,
                        fill: true,
                        backgroundColor: 'rgba(41, 128, 185, 0.2)',
                        borderColor: 'rgba(41, 128, 185, 1)',
                        pointBackgroundColor: 'rgba(41, 128, 185, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(41, 128, 185, 1)'
                    }]
                },
                options: {
                    scales: {
                        r: {
                            min: 1,
                            max: 5,
                            beginAtZero: false,
                            ticks: { stepSize: 1, display: false },
                            grid: { color: '#ddd' },
                            angleLines: { color: '#ddd' },
                            pointLabels: { font: { size: 14, weight: 'bold' }, color: '#2c3e50' }
                        }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        },
        choices: ["Prosegui"]
    };
}