// Select DOM elements
const textInput = document.getElementById('text-input');
const speakButton = document.getElementById('speak-btn');
const pauseButton = document.getElementById('pause-btn');
const resumeButton = document.getElementById('resume-btn');
const clearButton = document.getElementById('clear-btn');
const voiceSelect = document.getElementById('voices');
const pitchInput = document.getElementById('pitch');
const rateInput = document.getElementById('rate');
const volumeInput = document.getElementById('volume');
const pitchValue = document.getElementById('pitch-value');
const rateValue = document.getElementById('rate-value');
const volumeValue = document.getElementById('volume-value');
const downloadButton = document.getElementById('download-btn');

let synth = window.speechSynthesis;
let voices = [];
let utterThis;

// Load available voices
function loadVoices() {
    voices = synth.getVoices();
    voiceSelect.innerHTML = '';
    
    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = index;
        voiceSelect.appendChild(option);
    });
}

// Event listeners for changing pitch, rate, and volume values
pitchInput.addEventListener('input', () => {
    pitchValue.textContent = pitchInput.value;
});

rateInput.addEventListener('input', () => {
    rateValue.textContent = rateInput.value;
});

volumeInput.addEventListener('input', () => {
    volumeValue.textContent = volumeInput.value;
});

// Speak the text input
speakButton.addEventListener('click', () => {
    if (synth.speaking) {
        console.error('Already speaking...');
        return;
    }
    
    if (textInput.value !== '') {
        utterThis = new SpeechSynthesisUtterance(textInput.value);

        // Set voice, pitch, rate, and volume
        const selectedVoiceIndex = voiceSelect.value;
        utterThis.voice = voices[selectedVoiceIndex];
        utterThis.pitch = pitchInput.value;
        utterThis.rate = rateInput.value;
        utterThis.volume = volumeInput.value;

        // Speak the text
        synth.speak(utterThis);

        utterThis.onend = () => {
            console.log('Speech finished.');
            pauseButton.disabled = true;
            resumeButton.disabled = true;
        };

        utterThis.onerror = () => {
            console.error('An error occurred while speaking.');
        };

        // Enable pause, resume, and download buttons
        pauseButton.disabled = false;
        downloadButton.disabled = false;
    }
});

// Pause speech synthesis
pauseButton.addEventListener('click', () => {
    if (synth.speaking && !synth.paused) {
        synth.pause();
        pauseButton.disabled = true;
        resumeButton.disabled = false;
    }
});

// Resume speech synthesis
resumeButton.addEventListener('click', () => {
    if (synth.paused) {
        synth.resume();
        resumeButton.disabled = false ;
        pauseButton.disabled = true;
    }
});

// Clear text input
clearButton.addEventListener('click', () => {
    textInput.value = '';
});

// Load voices when the page is ready
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
}
