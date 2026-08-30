/* =========================================================
   JARVIS CORE
   ========================================================= */

const output = document.getElementById("commandOutput");
const input = document.getElementById("commandInput");
const history = document.getElementById("history");

const voiceState = document.getElementById("voiceState");
const voiceBar = document.getElementById("voiceBar");
const micIndicator = document.getElementById("micIndicator");
const listeningText = document.getElementById("listeningText");
const micButton = document.getElementById("micButton");

const cpu = document.getElementById("cpu");
const memory = document.getElementById("memory");

let recognition;
let listening = false;
let jarvisActive = false;


/* =========================================================
   BOOT SEQUENCE
   ========================================================= */

const bootMessages = [
    "INITIALIZING CORE...",
    "LOADING NEURAL ENGINE...",
    "CONNECTING VOICE SYSTEM...",
    "LOADING COMMAND MATRIX...",
    "CALIBRATING REACTOR...",
    "SYSTEM DIAGNOSTICS...",
    "ALL SYSTEMS NOMINAL..."
];

let bootIndex = 0;
let progress = 0;

const bootInterval = setInterval(() => {

    progress += Math.floor(Math.random() * 12) + 5;

    if (progress > 100) progress = 100;

    document.getElementById("bootProgress").style.width =
        progress + "%";

    document.getElementById("bootText").textContent =
        bootMessages[bootIndex % bootMessages.length];

    bootIndex++;

    if (progress >= 100) {

        clearInterval(bootInterval);

        setTimeout(() => {

            document.getElementById("bootScreen").style.opacity = "0";
            document.getElementById("interface").style.opacity = "1";

            setTimeout(() => {
                document.getElementById("bootScreen").remove();
            }, 1000);

            startJarvis();

        }, 700);
    }

}, 400);


/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {

    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString();

}

setInterval(updateClock, 1000);
updateClock();


/* =========================================================
   RANDOM TELEMETRY
   ========================================================= */

function telemetry() {

    const c = Math.floor(Math.random() * 35) + 15;
    const m = Math.floor(Math.random() * 35) + 30;

    cpu.textContent = c + "%";
    memory.textContent = m + "%";

    document.getElementById("cpuBar").style.width =
        c + "%";

    document.getElementById("memoryBar").style.width =
        m + "%";

    document.getElementById("coordX").textContent =
        Math.floor(Math.random() * 999);

    document.getElementById("coordY").textContent =
        Math.floor(Math.random() * 999);

    document.getElementById("coordZ").textContent =
        Math.floor(Math.random() * 999);
}

setInterval(telemetry, 1200);
telemetry();


/* =========================================================
   SPEECH SYNTHESIS
   ========================================================= */

function speak(text) {

    if (!("speechSynthesis" in window)) return;

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 1;
    speech.pitch = 0.85;
    speech.volume = 1;

    speechSynthesis.speak(speech);
}


/* =========================================================
   COMMAND DISPLAY
   ========================================================= */

function showCommand(text) {

    output.textContent = text;

    const item = document.createElement("div");

    item.className = "historyItem";

    item.innerHTML =
        `<b>></b> ${escapeHTML(text)}`;

    history.prepend(item);

    while (history.children.length > 8) {
        history.removeChild(history.lastChild);
    }
}


function escapeHTML(text) {

    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   RESPONSE
   ========================================================= */

function respond(text) {

    output.textContent = text;

    speak(text);
}


/* =========================================================
   COMMAND ENGINE
   ========================================================= */

function executeCommand(rawCommand) {

    let command = rawCommand
        .trim()
        .toLowerCase();

    if (!command) return;


    showCommand(rawCommand);


    /* Remove wake word */

    command = command
        .replace(/^jarvis[\s,:-]*/i, "")
        .trim();


    if (!command) {

        respond("Yes. I'm listening.");

        jarvisActive = true;

        return;
    }


    /* ================= SEARCH ================= */

    if (
        command.startsWith("search google for ") ||
        command.startsWith("google ")
    ) {

        let query;

        if (command.startsWith("search google for ")) {
            query = command.replace("search google for ", "");
        } else {
            query = command.replace("google ", "");
        }

        respond("Searching Google for " + query);

        setTimeout(() => {

            window.open(
                "https://www.google.com/search?q=" +
                encodeURIComponent(query),
                "_blank"
            );

        }, 500);

        return;
    }


    /* ================= YOUTUBE ================= */

    if (
        command === "open youtube" ||
        command === "youtube"
    ) {

        respond("Opening YouTube.");

        setTimeout(() => {
            window.open("https://www.youtube.com/", "_blank");
        }, 400);

        return;
    }


    /* ================= GOOGLE ================= */

    if (
        command === "open google" ||
        command === "google"
    ) {

        respond("Opening Google.");

        setTimeout(() => {
            window.open("https://www.google.com/", "_blank");
        }, 400);

        return;
    }


    /* ================= WHATSAPP ================= */

    if (
        command === "open whatsapp" ||
        command === "whatsapp"
    ) {

        respond("Opening WhatsApp.");

        setTimeout(() => {
            window.open("https://web.whatsapp.com/", "_blank");
        }, 400);

        return;
    }


    /* ================= GITHUB ================= */

    if (
        command === "open github" ||
        command === "github"
    ) {

        respond("Opening GitHub.");

        setTimeout(() => {
            window.open("https://github.com/", "_blank");
        }, 400);

        return;
    }


    /* ================= INSTAGRAM ================= */

    if (
        command === "open instagram" ||
        command === "instagram"
    ) {

        respond("Opening Instagram.");

        setTimeout(() => {
            window.open("https://www.instagram.com/", "_blank");
        }, 400);

        return;
    }


    /* ================= SEARCH YOUTUBE ================= */

    if (
        command.startsWith("search youtube for ")
    ) {

        const query =
            command.replace("search youtube for ", "");

        respond("Searching YouTube.");

        setTimeout(() => {

            window.open(
                "https://www.youtube.com/results?search_query=" +
                encodeURIComponent(query),
                "_blank"
            );

        }, 500);

        return;
    }


    /* ================= WEBSITE ================= */

    if (
        command.startsWith("open website ")
    ) {

        let site =
            command.replace("open website ", "").trim();

        if (!site.startsWith("http")) {
            site = "https://" + site;
        }

        respond("Opening website.");

        setTimeout(() => {
            window.open(site, "_blank");
        }, 400);

        return;
    }


    /* ================= TIME ================= */

    if (
        command.includes("what time") ||
        command === "time"
    ) {

        const now = new Date();

        respond(
            "The current time is " +
            now.toLocaleTimeString()
        );

        return;
    }


    /* ================= DATE ================= */

    if (
        command.includes("what date") ||
        command === "date" ||
        command.includes("today's date")
    ) {

        const now = new Date();

        respond(
            "Today is " +
            now.toLocaleDateString()
        );

        return;
    }


    /* ================= HELP ================= */

    if (
        command === "help" ||
        command === "what can you do"
    ) {

        respond(
            "I can open websites, search Google, search YouTube, open WhatsApp, read the time, and process commands."
        );

        return;
    }


    /* ================= SLEEP ================= */

    if (
        command === "sleep" ||
        command === "go to sleep" ||
        command === "stand by"
    ) {

        jarvisActive = false;

        respond("Entering standby mode.");

        voiceState.textContent = "STANDBY";

        return;
    }


    /* ================= WAKE ================= */

    if (
        command === "wake up" ||
        command === "activate"
    ) {

        jarvisActive = true;

        respond("Systems active.");

        voiceState.textContent = "ACTIVE";

        return;
    }


    /* ================= UNKNOWN ================= */

    respond(
        "I heard you, but I don't have an action for that command yet."
    );
}


/* =========================================================
   VOICE RECOGNITION
   ========================================================= */

function setupSpeechRecognition() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        voiceState.textContent = "UNSUPPORTED";

        listeningText.innerHTML =
            "VOICE RECOGNITION NOT SUPPORTED";

        return;
    }


    recognition = new SpeechRecognition();

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-IN";


    recognition.onstart = () => {

        listening = true;

        voiceState.textContent = "LISTENING";

        micIndicator.classList.add("active");

        listeningText.innerHTML =
            '<b>LISTENING...</b>';

        voiceBar.style.width = "90%";
    };


    recognition.onresult = (event) => {

        let finalText = "";

        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const transcript =
                event.results[i][0].transcript;

            if (event.results[i].isFinal) {
                finalText += transcript;
            }
        }


        if (!finalText) return;


        finalText = finalText.trim();

        console.log("VOICE:", finalText);


        /*
            Wake word detection.

            Example:

            "Jarvis open YouTube"

            becomes an executable command.
        */

        const lower =
            finalText.toLowerCase();


        if (
            lower.includes("jarvis")
        ) {

            jarvisActive = true;

            voiceState.textContent = "ACTIVE";


            const command =
                finalText.replace(
                    /jarvis/ig,
                    ""
                ).trim();


            if (command) {

                executeCommand(command);

            } else {

                respond(
                    "Yes. What would you like me to do?"
                );

            }

            return;
        }


        /*
            Once activated, the next spoken command
            can execute automatically.
        */

        if (jarvisActive) {

            executeCommand(finalText);

        }

    };


    recognition.onerror = (event) => {

        console.log(
            "Speech error:",
            event.error
        );

        voiceState.textContent = "RECOVERING";

    };


    recognition.onend = () => {

        listening = false;

        micIndicator.classList.remove("active");

        voiceBar.style.width = "30%";

        /*
            Automatically restart.
            This means you don't repeatedly press
            the microphone button.
        */

        setTimeout(() => {

            try {
                recognition.start();
            } catch (e) {}

        }, 300);

    };

}


/* =========================================================
   START JARVIS
   ========================================================= */

function startJarvis() {

    setupSpeechRecognition();

    setTimeout(() => {

        if (recognition) {

            try {
                recognition.start();
            } catch (e) {}

        }

    }, 1200);

}


/* =========================================================
   MANUAL COMMAND
   ========================================================= */

input.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        const command =
            input.value.trim();

        if (!command) return;

        executeCommand(command);

        input.value = "";
    }

});


/* =========================================================
   OPTIONAL MICROPHONE BUTTON
   ========================================================= */

micButton.addEventListener("click", () => {

    if (!recognition) return;

    try {

        recognition.start();

    } catch (e) {}

});
