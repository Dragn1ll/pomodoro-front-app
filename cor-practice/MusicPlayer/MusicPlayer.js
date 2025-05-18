const uploadInput = document.getElementById('audio-upload');
const uploadButton = document.getElementById('upload-button');
const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const playlist = document.getElementById('playlist');
const currentTimeElem = document.getElementById('current-time');
const durationElem = document.getElementById('duration');

let tracks = [];
let currentTrackIndex = 0;



uploadButton.addEventListener('click', () => uploadInput.click());

uploadInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
        tracks.push({ file, url: URL.createObjectURL(file) });
        const option = document.createElement('option');
        option.textContent = file.name;
        playlist.appendChild(option);
    });

    if (!audio.src && tracks.length > 0) {
        loadTrack(0);
    }
});

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = '⏸';
    } else {
        audio.pause();
        playPauseBtn.textContent = '▶️';
    }
});

prevBtn.addEventListener('click', () => {
    if (currentTrackIndex > 0) {
        loadTrack(currentTrackIndex - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentTrackIndex < tracks.length - 1) {
        loadTrack(currentTrackIndex + 1);
    }
});

playlist.addEventListener('change', (e) => {
    loadTrack(e.target.selectedIndex);
});

progress.addEventListener('input', () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});

audio.addEventListener('loadedmetadata', () => {
    durationElem.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
    currentTimeElem.textContent = formatTime(audio.currentTime);
    progress.value = (audio.currentTime / audio.duration) * 100 || 0;
});

audio.addEventListener('timeupdate', () => {
    progress.value = (audio.currentTime / audio.duration) * 100 || 0;
});