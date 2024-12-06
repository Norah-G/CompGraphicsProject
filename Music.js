// Music.js handles background music related logic.
// Ensure you have a music/background.mp3 file in a 'music' directory.

const backgroundMusic = new Audio('music/background.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.1;

function startMusic() {
    backgroundMusic.play().catch(err => console.log("Audio not allowed without user interaction.", err));
}

function stopMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}
