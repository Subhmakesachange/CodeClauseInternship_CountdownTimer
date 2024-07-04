let days = document.getElementById('days');
let hours = document.getElementById('hours');
let minutes = document.getElementById('minutes');
let seconds = document.getElementById('seconds');

let dd = document.getElementById('dd');
let hh = document.getElementById('hh');
let mm = document.getElementById('mm');
let ss = document.getElementById('ss');

let day_dot = document.querySelector('.day_dot');
let hr_dot = document.querySelector('.hr_dot');
let min_dot = document.querySelector('.min_dot');
let sec_dot = document.querySelector('.sec_dot');

let countdownInterval;

function startCountdown() {
    clearInterval(countdownInterval);
    let endDate = document.getElementById('countdown-date').value;
    if (!endDate) {
        alert('Please enter a valid date and time');
        return;
    }

    countdownInterval = setInterval(function () {
        let now = new Date(endDate).getTime();
        let countDown = new Date().getTime();
        let distance = now - countDown;

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById("time").style.display = 'none';
            document.querySelector(".newYear").style.display = 'block';
            drawConfetti();
            return;
        }

        let d = Math.floor(distance / (1000 * 60 * 60 * 24));
        let h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let s = Math.floor((distance % (1000 * 60)) / 1000);

        days.innerHTML = d + "<br><span>Days</span>";
        hours.innerHTML = h + "<br><span>Hours</span>";
        minutes.innerHTML = m + "<br><span>Minutes</span>";
        seconds.innerHTML = s + "<br><span>Seconds</span>";

        dd.style.strokeDashoffset = 440 - (440 * d) / 365;
        hh.style.strokeDashoffset = 440 - (440 * h) / 24;
        mm.style.strokeDashoffset = 440 - (440 * m) / 60;
        ss.style.strokeDashoffset = 440 - (440 * s) / 60;

        day_dot.style.transform = `rotateZ(${d * 0.986}deg)`;
        hr_dot.style.transform = `rotateZ(${h * 15}deg)`;
        min_dot.style.transform = `rotateZ(${m * 6}deg)`;
        sec_dot.style.transform = `rotateZ(${s * 6}deg)`;
    }, 1000);
}

let W = window.innerWidth;
let H = window.innerHeight;
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const context = canvas.getContext("2d");
const maxConfettis = 150;
const particles = [];

const possibleColors = [
    "DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Gold", "Violet", 
    "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"
];

function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H - H;
    this.r = randomFromTo(11, 33);
    this.d = Math.random() * maxConfettis + 11;
    this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
    this.tilt = Math.floor(Math.random() * 33) - 11;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;

    this.draw = function () {
        context.beginPath();
        context.lineWidth = this.r / 2;
        context.strokeStyle = this.color;
        context.moveTo(this.x + this.tilt + this.r / 3, this.y);
        context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
        return context.stroke();
    };
}

function drawConfetti() {
    const results = [];
    requestAnimationFrame(drawConfetti);

    context.clearRect(0, 0, W, window.innerHeight);

    for (var i = 0; i < maxConfettis; i++) {
        results.push(particles[i].draw());
    }

    let particle = {};
    let remainingFlakes = 0;
    for (var i = 0; i < maxConfettis; i++) {
        particle = particles[i];

        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
        particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

        if (particle.y <= H) remainingFlakes++;

        if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
            particle.x = Math.random() * W;
            particle.y = -30;
            particle.tilt = Math.floor(Math.random() * 10) - 20;
        }
    }

    return results;
}

window.addEventListener("resize", function () {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}, false);

for (var i = 0; i < maxConfettis; i++) {
    particles.push(new confettiParticle());
}

canvas.width = W;
canvas.height = H;
