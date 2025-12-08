// --- JAVASCRIPT / FUNCTIONALITY (script.js) ---

// Element references
const intro = document.getElementById('intro');
const nextBtn = document.getElementById('nextBtn');
const options = document.getElementById('options');
const optionBoxes = document.querySelectorAll('.option-box');
const linkSection = document.getElementById('linkSection');

const clickSound = document.getElementById('clickSound');
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggleBtn = document.getElementById('musicToggle');
const heroImageContainer = document.getElementById('heroImageContainer');
const vibrationCircle = document.getElementById('vibrationCircle');

let musicPlaying = false;
let audioContext;
let analyser;
let source;
const BASE_THRESHOLD = 150; // High volume level for 'bass' trigger

// WhatsApp group links
const links = {
    1: { url: 'https://chat.whatsapp.com/IJHIPCKfT0IBWxKKtYIXbU', text: 'Join SHADOW LIMITED 6V6' },
    2: { url: 'https://chat.whatsapp.com/CGK2VtyLg0J7a31Xg779dz', text: 'Join SHADOW UNLIMITED 6V6' },
    3: { url: 'https://chat.whatsapp.com/HmNU66a5yafJnnZ54pvZ7O', text: 'Community' }
};

// --- AUDIO VISUALIZER SETUP (for Volume/Bass Detection) ---

function setupAudioAnalysis() {
    if (!audioContext) {
        // Initialize AudioContext on user interaction
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source = audioContext.createMediaElementSource(backgroundMusic);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
    }
}

function analyzeAudio() {
    if (!musicPlaying || !analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray); // Get the time domain data (raw waveform)

    // Simple Volume Check (Average the waveform data)
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
        sum += Math.abs(dataArray[i] - 128); // 128 is the midpoint
    }
    const average = sum / bufferLength;

    // Trigger the VIBRATION/PULSE effect when volume is high (like a bass drop)
    if (average > BASE_THRESHOLD) {
        heroImageContainer.classList.add('vibrating');
        vibrationCircle.classList.remove('hidden');
    } else {
        heroImageContainer.classList.remove('vibrating');
        vibrationCircle.classList.add('hidden');
    }
    
    requestAnimationFrame(analyzeAudio);
}


// --- MUSIC AND SOUND FUNCTIONS ---

function startMusicOnInteraction() {
    if (!musicPlaying) {
         backgroundMusic.play().then(() => {
            setupAudioAnalysis(); // Setup analysis after play starts
            analyzeAudio(); // Start the loop
            musicToggleBtn.innerHTML = 'Music: ON 🔊';
            musicPlaying = true;
        }).catch(error => {
            console.warn("Music auto-play failed. User must manually toggle.");
        });
    }
    document.removeEventListener('click', startMusicOnInteraction);
}

musicToggleBtn.addEventListener('click', () => {
    if (musicPlaying) {
        backgroundMusic.pause();
        heroImageContainer.classList.remove('vibrating');
        vibrationCircle.classList.add('hidden');
        musicToggleBtn.innerHTML = 'Music: OFF 🔇';
        musicPlaying = false;
    } else {
        backgroundMusic.play().then(() => {
            setupAudioAnalysis();
            analyzeAudio();
            musicToggleBtn.innerHTML = 'Music: ON 🔊';
            musicPlaying = true;
        }).catch(error => {
            console.error("Music play failed:", error);
        });
    }
});

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
}

document.addEventListener('click', startMusicOnInteraction, { once: true });


// --- PAGE FLOW FUNCTIONS ---

// Show "Next" button after 3 seconds
setTimeout(() => {
    nextBtn.classList.remove('hidden');
}, 3000);

// Show Options Page with sequenced arrival
function showOptions() {
    playClickSound(); 
    intro.classList.add('hidden');
    options.classList.remove('hidden');

    // Slide in options one by one from different directions (Top, Left, Right)
    const optionsArray = [
        document.getElementById('option1'), // Top
        document.getElementById('option2'), // Left
        document.getElementById('option3')  // Right
    ];

    optionsArray.forEach((box, index) => {
        setTimeout(() => {
            box.classList.add('slide-in');
        }, index * 200); // 200ms delay for quick sequential arrival
    });
}

nextBtn.addEventListener('click', showOptions);

window.showLink = function(option) {
    playClickSound();
    options.classList.add('hidden');
    linkSection.classList.remove('hidden');

    // Update link content
    const linkTextElement = document.getElementById('linkText');
    const joinLinkElement = document.getElementById('joinLink');
    
    linkTextElement.textContent = links[option].text;
    joinLinkElement.href = links[option].url;
}
