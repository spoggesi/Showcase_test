# Sensory Analysis Showcase: JATOS & jsPsych Integration

This project is a high-performance demonstration of how to combine neuroscientific research methods with modern web technologies using **jsPsych** and **JATOS**. It serves as a comprehensive "all-in-one" demo for professional sensory analysis.

## 🧪 Included Research Modules

I have integrated three distinct methodologies into a single flow:

* **Implicit Association Task (IAT):** Measures subconscious emotional associations by capturing rapid reaction times (< 3s) to product stimuli.
* **Rate-All-That-Apply (RATA):** A modern sensory profiling method that reduces judge fatigue while maintaining high statistical discrimination. The UI uses a custom-engineered CSS Grid for perfect scale alignment.
* **Big Five Personality Traits (BFI-10):** Psychodemographic segmentation that correlates taste preferences with personality traits.
* **Automated Lead Generation:** Includes a dynamic contact form that sends data to a Google Sheets document and triggers an automatic email via a Google Apps Script Webhook.

## 🚀 Installation & Deployment

### Local Installation
To run this test on your local machine:
1.  Download and install the JATOS local instance from the [JATOS Installation Guide](https://www.jatos.org/Installation.html).
2.  Import the `.jzip` study file provided in this repository into your JATOS dashboard.
3.  Click **Run** to start the experiment.

### Server Deployment (Hetzner, AWS, etc.)
To publish this demo online for clients:
1.  Set up a VPS (e.g., a Hetzner Cloud instance).
2.  Follow the [JATOS Server Deployment Guide](https://www.jatos.org/Deploy-to-a-server-installation.html) to install JATOS on your server.
3.  **Important:** Ensure you use an encrypted connection (HTTPS) for features like digital signatures and secure data transmission.

## 🛠 Troubleshooting

If you encounter issues during setup, check the following:

* **Webhook Failures:** If contact data isn't reaching Google Sheets, verify the `GOOGLE_SCRIPT_URL` in `final_page.js` is correct and deployed as a "Web App" accessible to "Anyone".
* **Missing Styles/Plugins:** Ensure the `jspsych/` folder contains all necessary plugins (e.g., `plugin-survey-html-form.js`, `plugin-survey-likert.js`) or the modules will fail to load.
* **Mobile Scaling:** If the IAT buttons overlap, ensure the `custom.css` file is correctly linked in your HTML headers.
* **JATOS Memory:** On small VPS instances (like Hetzner CX11), ensure you have allocated enough RAM to the JATOS process by editing the `loader.sh` file.

## 🛠 Technical Stack
* **Frontend:** jsPsych 7.x.
* **Backend:** JATOS.
* **Graphics:** Chart.js for psychographic feedback.
* **Automation:** Google Apps Script Webhooks.

## 📄 License
This project is licensed under the **Apache 2.0 License**.

---
**Created by [Simone Poggesi R&D Manager Giotto Wine Listeners]**
**✉️ sensoriale@giottoconsulting.it 📞 +39 0438 971719**
