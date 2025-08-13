let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "purple", "green", "orange", "skyblue"];
let started = false;
let level = 0;

let highScore = localStorage.getItem("highScore") || 0;

let h2 = document.querySelector("h2");
let highScoreDisplay = document.createElement("h3");
highScoreDisplay.innerText = `High Score: ${highScore}`;
document.querySelector(".game").insertBefore(highScoreDisplay, document.getElementById("resetHighScore"));

let colorFrequencies = {
    red: 261,
    yellow: 293,
    green: 329,
    purple: 349,
    orange: 392,
    skyblue: 440
};

document.addEventListener("keypress", function() {
    if (!started) {
        started = true;
        levelUp();
    }
});

function levelUp() {
    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;

    let randomIdx = Math.floor(Math.random() * btns.length);
    let randColor = btns[randomIdx];
    let randBtn = document.querySelector(`.${randColor}`);
    gameSeq.push(randColor);
    btnFlash(randBtn);
}

function playSound(color) {
    let freq = colorFrequencies[color];
    let ctx = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    oscillator.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
}

function playGameOverSound() {
    let ctx = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = ctx.createOscillator();
    let gainNode = ctx.createGain();

    oscillator.type = 'square'; 
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.6);

    gainNode.gain.setValueAtTime(1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.6);
}

function btnFlash(btn) {
    let color = btn.getAttribute("id");
    playSound(color);
    btn.classList.add("flash");
    setTimeout(function() {
        btn.classList.remove("flash");
    }, 300);
}

function btnPress() {
    if (!started) return;
    let btn = this;
    btnFlash(btn);
    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);
    checkAns(userSeq.length - 1);
}


let allBtns = document.querySelectorAll(".btn");
for (let btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

function checkAns(idx) {
    if (gameSeq[idx] === userSeq[idx]) {
        if (userSeq.length === gameSeq.length) {
            setTimeout(levelUp, 1000);
        }
    } else {
        playGameOverSound();
        h2.innerHTML = `Game Over! Your score was <b>${level}</b><br>Press Any Key to Restart.`;
        document.querySelector("body").style.backgroundColor = "red";
        document.body.classList.add("shake");

        setTimeout(function() {
            document.querySelector("body").style.backgroundColor = "white";
            document.body.classList.remove("shake");
        }, 500);

        if (level > highScore) {
            highScore = level;
            localStorage.setItem("highScore", highScore);
            highScoreDisplay.innerText = `High Score: ${highScore}`;
            launchConfetti();
        }
        reset();
    }
}

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}

function launchConfetti() {
    var duration = 2 * 1000;
    var end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

document.getElementById("resetHighScore").addEventListener("click", function() {
    localStorage.removeItem("highScore");
    highScore = 0;
    highScoreDisplay.innerText = `High Score: ${highScore}`;
});
