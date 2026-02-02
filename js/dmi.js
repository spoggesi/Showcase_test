// ==========================================
// File: dmi.js
// Contiene: Dati Demografici (Genere ed Etnia Aggiornati)
// ==========================================

function generateDmiIntro() {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div class="sample-block" style="max-width: 800px; margin: 0 auto; text-align: left;">
                <h2 style="color: #8e44ad; text-align: center;">Fase 6: Clustering Demografico</h2>
                
                <p>Infine, raccogliamo i dati di base per incrociare tutte le metriche precedenti (Neuro, Sensoriale, Psicologico) con i cluster di mercato.</p>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 20px;">
                    <div style="background: #f4ecf7; padding: 15px; border-radius: 8px; width: 45%;">
                        <strong>Generazione</strong><br>
                        Gen Z vs Boomers
                    </div>
                    <div style="background: #f4ecf7; padding: 15px; border-radius: 8px; width: 45%;">
                        <strong>Geografia</strong><br>
                        Preferenze regionali
                    </div>
                </div>

                <p style="text-align: center; margin-top: 30px;">
                    Questi dati ci permettono di dirti: <br>
                    <em>"Il tuo vino piace alle donne della Gen Z estroverse del Nord Italia."</em>
                </p>
            </div>
        `,
        choices: ["Inserisci Dati"]
    };
}

// Variabile temporanea per salvare i dati mentre l'utente scrive/clicca
let tempDemoData = {
    year: "",
    birthProv: "",
    resProv: "",
    gender: "",
    ethnicity: ""
};

const dmiPage = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <div class="sample-block" style="max-width: 700px; margin: 0 auto; text-align: left;">
            <h3 style="text-align: center; margin-bottom: 30px;">Dati Demografici</h3>
            
            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; display: block; margin-bottom: 5px;">Anno di nascita:</label>
                <input type="number" id="demo-year" placeholder="Es. 1990" 
                    style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 1rem;">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; display: block; margin-bottom: 5px;">Provincia di nascita:</label>
                <input type="text" id="demo-birth-prov" placeholder="Es. Milano, Roma..." 
                    style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 1rem;">
            </div>

            <div style="margin-bottom: 30px;">
                <label style="font-weight: bold; display: block; margin-bottom: 5px;">Provincia di residenza:</label>
                <input type="text" id="demo-res-prov" placeholder="Es. Firenze, Napoli..." 
                    style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 1rem;">
            </div>

            <hr style="border:0; border-top:1px solid #eee; margin: 30px 0;">

            <div style="margin-bottom: 30px;">
                <label style="font-weight: bold; display: block; margin-bottom: 10px;">Con quale sesso ti identifichi maggiormente?</label>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <label class="radio-option"><input type="radio" name="gender" value="Maschio"> Maschio</label>
                    <label class="radio-option"><input type="radio" name="gender" value="Femmina"> Femmina</label>
                    <label class="radio-option"><input type="radio" name="gender" value="Non-binario"> Non-binario</label>
                    <label class="radio-option"><input type="radio" name="gender" value="Genderfluid"> Genderfluid</label>
                    <label class="radio-option"><input type="radio" name="gender" value="Agender"> Agender</label>
                    <label class="radio-option"><input type="radio" name="gender" value="Altro"> Altro</label>
                    <label class="radio-option" style="grid-column: span 2;"><input type="radio" name="gender" value="Preferisco non rispondere"> Preferisco non rispondere</label>
                </div>
            </div>

            <div style="margin-bottom: 30px;">
                <label style="font-weight: bold; display: block; margin-bottom: 10px;">Con quale etnia ti identifichi maggiormente?</label>
                
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label class="radio-option"><input type="radio" name="ethnicity" value="Caucasica"> Caucasica / Bianca</label>
                    <label class="radio-option"><input type="radio" name="ethnicity" value="Latina"> Ispanica / Latina</label>
                    <label class="radio-option"><input type="radio" name="ethnicity" value="Afrodiscendente"> Afrodiscendente / Nera</label>
                    <label class="radio-option"><input type="radio" name="ethnicity" value="Asiatica"> Asiatica</label>
                    <label class="radio-option"><input type="radio" name="ethnicity" value="Mediorientale"> Mediorientale / Nordafricana</label>
                    <label class="radio-option"><input type="radio" name="ethnicity" value="Mista"> Mista / Multi-etnica</label>
                    <label class="radio-option"><input type="radio" name="ethnicity" value="Altro"> Altro</label>
                    <label class="radio-option"><input type="radio" name="ethnicity" value="Preferisco non rispondere"> Preferisco non rispondere</label>
                </div>
            </div>

        </div>

        <style>
            .radio-option {
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                cursor: pointer;
                background: #f9f9f9;
                transition: background 0.2s, border-color 0.2s;
                font-size: 0.95rem;
            }
            .radio-option:hover { 
                background: #eef; 
                border-color: #b0c4de;
            }
            /* Aumenta la dimensione del pallino radio */
            input[type="radio"] { 
                margin-right: 8px; 
                transform: scale(1.2); 
            }
        </style>
    `,
    choices: ["Invia e Continua"],
    
    // ON LOAD: Attiviamo i listener per catturare le risposte
    on_load: function() {
        // Reset variabili
        tempDemoData = { year: "", birthProv: "", resProv: "", gender: "", ethnicity: "" };

        // 1. Ascoltatori per i campi di testo
        document.getElementById("demo-year").addEventListener('input', e => tempDemoData.year = e.target.value);
        document.getElementById("demo-birth-prov").addEventListener('input', e => tempDemoData.birthProv = e.target.value);
        document.getElementById("demo-res-prov").addEventListener('input', e => tempDemoData.resProv = e.target.value);

        // 2. Ascoltatori per GENERE (rileva il cambio di selezione)
        document.querySelectorAll('input[name="gender"]').forEach(radio => {
            radio.addEventListener('change', function() {
                if(this.checked) tempDemoData.gender = this.value;
            });
        });

        // 3. Ascoltatori per ETNIA (rileva il cambio di selezione)
        document.querySelectorAll('input[name="ethnicity"]').forEach(radio => {
            radio.addEventListener('change', function() {
                if(this.checked) tempDemoData.ethnicity = this.value;
            });
        });
    },

    // ON FINISH: Salviamo i dati finali nel dataset di jsPsych
    on_finish: function(data) {
        data.demographics_year = tempDemoData.year;
        data.demographics_birth_prov = tempDemoData.birthProv;
        data.demographics_res_prov = tempDemoData.resProv;
        data.demographics_gender = tempDemoData.gender;
        data.demographics_ethnicity = tempDemoData.ethnicity;
        
        // Tag per identificare questa prova nel CSV
        data.task = "demographics";
    }
};

// Wrapper per esportare il blocco
const dmiTimelineBlock = {
    timeline: [dmiPage]
};