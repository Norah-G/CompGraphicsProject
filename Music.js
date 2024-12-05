let music = new Audio('background-music.mp3');  // Replace with your music file

// Start music when the game starts
function playMusic() {
    music.loop = true;  // Loop the music
    music.volume = 0.1;  // Set volume to a low level
    music.play();
}

// Pause the music when the game is over or paused
function pauseMusic() {
    music.pause();
}

// Restart music when the game is reset
function restartMusic() {
    music.currentTime = 0;  // Restart from the beginning
    music.play();
}
