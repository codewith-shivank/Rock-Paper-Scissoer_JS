// Game state
let userScore = 0;
let compScore = 0;
let currentRound = 1;
let isSoundEnabled = true;
const TOTAL_ROUNDS = 5;

// DOM Elements
const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#comp-score");
const currentRoundSpan = document.querySelector("#current-round");
const resetBtn = document.querySelector("#reset-btn");
const toggleSoundBtn = document.querySelector("#toggle-sound");

// Audio elements
const clickSound = document.querySelector("#clickSound");
const winSound = document.querySelector("#winSound");
const loseSound = document.querySelector("#loseSound");
const drawSound = document.querySelector("#drawSound");

// Initialize particles
particlesJS('particles', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#2de2e6" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        move: { enable: true, speed: 2, direction: "none", random: true }
    }
});

// Play sound helper function
const playSound = (sound) => {
    if (isSoundEnabled) {
        sound.currentTime = 0;
        sound.play();
    }
};

// Create particles effect
const createParticles = (x, y, color) => {
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '5px';
        particle.style.height = '5px';
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        document.body.appendChild(particle);

        const angle = (i / 30) * 360;
        const velocity = 5;
        const vx = Math.cos(angle * Math.PI / 180) * velocity;
        const vy = Math.sin(angle * Math.PI / 180) * velocity;

        let posX = x;
        let posY = y;

        const animate = () => {
            posX += vx;
            posY += vy;
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = parseFloat(particle.style.opacity || 1) - 0.02;

            if (parseFloat(particle.style.opacity) > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };

        requestAnimationFrame(animate);
    }
};

const genCompChoice = () => {
    const options = ["rock", "paper", "scissors"];
    const randIdx = Math.floor(Math.random() * 3);
    return options[randIdx];
};

const drawGame = () => {
    msg.innerText = "IT'S A DRAW! 🤝";
    msg.style.backgroundColor = "#081b31";
    playSound(drawSound);
};

const showWinner = (userWin, userChoice, compChoice) => {
    if (userWin) {
        userScore++;
        userScorePara.innerText = userScore;
        msg.innerText = `YOU WIN! 🏆 ${userChoice} beats ${compChoice}`;
        msg.style.backgroundColor = "#4CAF50";
        playSound(winSound);
        createParticles(event.clientX, event.clientY, '#4CAF50');
    } else {
        compScore++;
        compScorePara.innerText = compScore;
        msg.innerText = `YOU LOSE! 💀 ${compChoice} beats ${userChoice}`;
        msg.style.backgroundColor = "#f44336";
        playSound(loseSound);
    }

    // Check if the game is over
    if (currentRound >= TOTAL_ROUNDS) {
        endGame();
    } else {
        currentRound++;
        currentRoundSpan.innerText = currentRound;
    }
};

const endGame = () => {
    const finalMessage = userScore > compScore 
        ? "🎊 CONGRATULATIONS! YOU WON THE GAME! 🎊"
        : userScore < compScore 
            ? "😢 GAME OVER! COMPUTER WINS! 😢"
            : "🤝 IT'S A TIE GAME! 🤝";
    
    msg.innerText = finalMessage;
    disableChoices();
};

const disableChoices = () => {
    choices.forEach(choice => {
        choice.style.pointerEvents = 'none';
        choice.style.opacity = '0.5';
    });
};

const enableChoices = () => {
    choices.forEach(choice => {
        choice.style.pointerEvents = 'auto';
        choice.style.opacity = '1';
    });
};

const playGame = (userChoice) => {
    playSound(clickSound);
    const compChoice = genCompChoice();

    if (userChoice === compChoice) {
        drawGame();
    } else {
        let userWin = true;
        if (userChoice === "rock") {
            userWin = compChoice === "paper" ? false : true;
        } else if (userChoice === "paper") {
            userWin = compChoice === "scissors" ? false : true;
        } else {
            userWin = compChoice === "rock" ? false : true;
        }
        showWinner(userWin, userChoice, compChoice);
    }
};

// Reset game function
const resetGame = () => {
    userScore = 0;
    compScore = 0;
    currentRound = 1;
    userScorePara.innerText = "0";
    compScorePara.innerText = "0";
    currentRoundSpan.innerText = "1";
    msg.innerText = "CHOOSE YOUR WEAPON!";
    msg.style.backgroundColor = "#081b31";
    enableChoices();
};

// Event listeners
choices.forEach((choice) => {
    choice.addEventListener("click", (e) => {
        const userChoice = choice.getAttribute("id");
        playGame(userChoice);
    });
});

resetBtn.addEventListener("click", resetGame);

toggleSoundBtn.addEventListener("click", () => {
    isSoundEnabled = !isSoundEnabled;
    toggleSoundBtn.innerText = isSoundEnabled ? "🔊" : "🔇";
});