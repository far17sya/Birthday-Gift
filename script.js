// --- CONFIGURATION START ---
const story = [
    {
        text: "Huh? What's this? Looks like Snoopy has something to say to you...",
        image: "gifs/love snoopy.gif", 
        bgColor: "#ffccdd",
        buttonText: "Investigate"
    },
    {
        text: "You have a GIFT! Open gift?",
        image: "gifs/gift.gif",
        bgColor: "#ffb7b2",
        buttonText: "Open Gift"
    },
    {
        text: "Happy 23rd Birthday Sayangggggg!!! 🎉",
        image: "gifs/congratz.gif",
        bgColor: "#a2d2ff",
        buttonText: "Next..."
    },
    {
        text: "There is a secret message for you...",
        image: "gifs/secret_message.gif",
        bgColor: "#b9fbc0",
        buttonText: "Click Me!"
    },
    {
        text: "Hmm... it seems like you have a gift again. Open gift?",
        image: "gifs/snoopy_gift.gif",
        buttonText: "Find out..!"
    },
    {
        text: "But firstt.. Do you still love me? (berani cakap takk...)",
        image: "gifs/Suprise.gif",
        buttonText: "YES!",
        hasNoButton: true  // <--- FEATURE: RUNAWAY BUTTON
    },
    {
        text: "To the one who holds my heart... Happy Birthday Haziq!!. No matter where we are, you will always be my home. Thank you for being you, and for making my world so much brighter. I love you more than words can say!",
        image: "gifs/Snoopy_Peanuts.gif",  
        buttonText: "Habis dahhhh!"
    }
];
// --- CONFIGURATION END ---

let currentStep = 0;
let typingInterval;
let patCount = 0; 

function updateScreen() {
    // 1. Get the current story step
    const step = story[currentStep];
    const container = document.querySelector(".game-container");
    const textElement = document.getElementById("dialogue-text");
    const noBtn = document.getElementById("no-btn");

    // --- PROGRESS BAR LOGIC ---
    // --- FEATURE: DYNAMIC BATTERY ---
    const totalSteps = story.length;
    // Calculate percentage (e.g., Step 0 = 10%, Last Step = 100%)
    const chargePercentage = Math.round(((currentStep + 1) / totalSteps) * 100);
    
    const batteryFill = document.querySelector(".battery-charge");
    if (batteryFill) {
        batteryFill.style.width = `${chargePercentage}%`;

    // Change color based on charge
        if (chargePercentage < 20) {
            batteryFill.style.backgroundColor = "#ff0000"; // Red (Low)
        } else if (chargePercentage < 50) {
            batteryFill.style.backgroundColor = "#ffa500"; // Orange (Med)
        } else {
            batteryFill.style.backgroundColor = "#4cd137"; // Green (High)
        }
    }

    let meter = "";
    for (let i = 0; i < story.length; i++) {
        meter += (i <= currentStep) ? "❤️" : "🤍";
    }
    document.getElementById("heart-meter").innerText = meter;

    // --- VISUAL UPDATES ---
    document.body.style.backgroundColor = step.bgColor || "#ffccdd";
    document.getElementById("main-image").src = step.image;
    document.getElementById("next-btn").innerText = step.buttonText;

    // --- FEATURE: RUNAWAY BUTTON ---
    if (step.hasNoButton) {
        noBtn.style.display = "inline-block";
        noBtn.style.position = "absolute"; 
        noBtn.style.left = "120%"; 
        noBtn.style.top = "0";
    } else {
        noBtn.style.display = "none";
    }

    // --- FEATURE: RAINBOW BORDER & CONFETTI ---
    if (step.text.includes("Birthday")) {
        container.classList.add("rainbow-border");
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
        container.classList.remove("rainbow-border");
    }

    // --- TEXT LOGIC (NO WAITING) ---
    if (typingInterval) clearInterval(typingInterval);
    textElement.innerHTML = ""; // Clear text immediately

    let i = 0;
    typingInterval = setInterval(() => {
        if (i < step.text.length) {
            textElement.innerHTML += step.text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
        }
    }, 50); // Typing speed
}

function nextSlide() {
    // --- FLASH EFFECT ---
    const flashDiv = document.createElement("div");
    flashDiv.classList.add("flash-effect");
    document.body.appendChild(flashDiv);
    setTimeout(() => { flashDiv.remove(); }, 300);

    // --- NAVIGATION LOGIC ---
    if (currentStep < story.length - 1) {
        currentStep++;
    } else {
        // --- STORY FINISHED? SHOW ACHIEVEMENT! ---
        const achievement = document.getElementById("achievement");
        if (achievement) {
            achievement.style.bottom = "50px"; 
            setTimeout(() => { achievement.style.bottom = "-100px"; }, 4000);
        }
        currentStep = 0; 
    }
    updateScreen();
}

// --- FEATURE: HEADPATS & SQUISH ---
function spawnHearts() {
    const img = document.getElementById("main-image");
    
    // Squish Animation
    img.classList.remove("squish-active");
    void img.offsetWidth; // Trigger reflow
    img.classList.add("squish-active");

    // Headpat Counter
    patCount++;
    document.getElementById("pat-counter").innerText = `Headpats: ${patCount}`;

    // Confetti
    confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.4 },
        colors: ['#ff0000', '#ffa500', '#ffff00']
    });
}

// --- FEATURE: RUNAWAY BUTTON ---
function moveButton() {
    const noBtn = document.getElementById("no-btn");
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 100);
    noBtn.style.position = "fixed"; 
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
}

// --- FEATURE: DAYS TOGETHER TIMER ---
const startDate = new Date("2024-11-25"); 
const timerElement = document.getElementById("timer");
if (timerElement) {
    setInterval(() => {
        const now = new Date();
        const diff = now - startDate;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        timerElement.innerText = `❤️ In love for: ${days} Days, ${hours} Hours ❤️`;
    }, 1000);
}

// --- FEATURE: MUSIC TOGGLE ---
function toggleMusic() {
    const music = document.getElementById("bg-music");
    const btn = document.getElementById("music-btn");
    if (music.paused) {
        music.play();
        btn.innerText = "🔇 Pause Music";
        btn.style.backgroundColor = "#ffdac1"; 
    } else {
        music.pause();
        btn.innerText = "🎵 Play Music";
        btn.style.backgroundColor = "#ffb7b2"; 
    }
}

// --- FEATURE: START SCREEN ---
function startGame() {
    const screen = document.getElementById("start-screen");
    screen.style.opacity = "0";
    setTimeout(() => { screen.style.display = "none"; }, 1000);

    const music = document.getElementById("bg-music");
    music.volume = 0.5; 
    music.play().catch(error => { console.log("Audio play failed"); });
    updateScreen();
}

// --- FEATURE: ANIMATED TITLE ---
const titles = ["For You ❤️", "Open Me 💌", "Surprise! 🎉", "I Love You 💖"];
let titleIndex = 0;
setInterval(() => {
    document.title = titles[titleIndex];
    titleIndex = (titleIndex + 1) % titles.length;
}, 2000); 

// --- FEATURE: FLOATING NOTES ---
setInterval(() => {
    const music = document.getElementById("bg-music");
    if (music && !music.paused) {
        createNote();
    }
}, 800); 

// --- FEATURE: CLICK TO KISS ---
document.body.addEventListener("click", (e) => {
    // Don't spawn a kiss if they clicked a button or the game card
    if (e.target.closest('button') || e.target.closest('.game-container')) return;

    const kiss = document.createElement("div");
    kiss.innerText = "💋"; 
    kiss.classList.add("kiss-mark");
    kiss.style.left = `${e.pageX}px`;
    kiss.style.top = `${e.pageY}px`;
    
    // Random rotation for realism
    const rotation = Math.random() * 40 - 20; // -20 to 20 degrees
    kiss.style.transform = `rotate(${rotation}deg)`;

    document.body.appendChild(kiss);

    // Remove after 2 seconds
    setTimeout(() => {
        kiss.remove();
    }, 2000);
});

function createNote() {
    const note = document.createElement("div");
    note.innerHTML = "🎵"; 
    note.classList.add("music-note");
    note.style.left = Math.random() * 100 + "vw"; 
    note.style.animationDuration = Math.random() * 3 + 2 + "s"; 
    document.body.appendChild(note);
    setTimeout(() => { note.remove(); }, 5000); 
}
// --- FEATURE: NIGHT MODE TOGGLE ---
function toggleNightMode() {
    document.body.classList.toggle("night-mode");
}

// --- FEATURE: RANDOM COMPLIMENT ---
const compliments = [
    "I LOVE YOU SAYANG!❤️❤️",
    "You have the cutest smile! 😊",
    "I'm so lucky to have you, sayang! 🍀",
    "You are my favorite person! ❤️",
    "Being with you is the best! 🏡",
    "I hope you enjoy my gift!!✨",
    "I miss you soo muchhh 😭",
    "Can't wait to be with you again~"
];

function showCompliment() {
    // 1. Remove existing bubble if any
    const oldBubble = document.querySelector(".speech-bubble");
    if (oldBubble) oldBubble.remove();

    // 2. Pick random text
    const text = compliments[Math.floor(Math.random() * compliments.length)];

    // 3. Create the bubble
    const bubble = document.createElement("div");
    bubble.className = "speech-bubble";
    bubble.innerText = text;

    // 4. Append it to the GAME CONTAINER (so it stays with the card)
    const container = document.querySelector(".game-container");
    container.appendChild(bubble);

    // 5. Remove after 3 seconds
    setTimeout(() => {
        bubble.style.opacity = "0";
        bubble.style.transition = "opacity 0.5s";
        setTimeout(() => bubble.remove(), 500);
    }, 3000);
}

// --- FEATURE: PAPER PLANE ---
// Spawn a plane every 15 seconds automatically
setInterval(() => {
    spawnPlane();
}, 15000);

function spawnPlane() {
    const plane = document.createElement("div");
    plane.innerText = "✈️💌"; 
    plane.classList.add("paper-plane");
    
    // Randomize vertical start position
    const randomY = Math.random() * 50 + 10; // Top 10% to 60%
    plane.style.top = `${randomY}%`;
    
    document.body.appendChild(plane);
    
    // Cleanup
    setTimeout(() => plane.remove(), 6000);
}
