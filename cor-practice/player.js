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
        playPauseBtn.innerHTML = '<svg width="63" height="91" viewBox="0 0 63 91" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
            '<rect x="40.7887" y="1.5" width="19.908" height="87.5328" rx="7.5" fill="white" stroke="#EFB97C" stroke-width="3"/>\n' +
            '<rect x="2.30334" y="1.5" width="19.908" height="87.5328" rx="7.5" fill="white" stroke="#EFB97C" stroke-width="3"/>\n' +
            '</svg>\n';
    } else {
        audio.pause();
        playPauseBtn.innerHTML = '<svg width="56" height="66" viewBox="0 0 56 66" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
            '<path d="M52.3555 30.292C54.494 31.6179 54.5614 34.6733 52.5566 36.1074L52.3555 36.2412L7.74219 63.9033C5.41069 65.3489 2.3977 63.6719 2.39746 60.9287V5.60451C2.39746 2.86112 5.41059 1.18424 7.74219 2.6299L52.3555 30.292Z" fill="white" stroke="#EFB97C" stroke-width="3"/>\n' +
            '</svg>';
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