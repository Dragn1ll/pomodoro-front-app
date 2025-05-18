const apiKey = 'Amhx56sbjhSwWpIXAD2nTQ==eegfIrmh7TKx0KVG';
const quoteElement = document.querySelector('.quote-text');
const newQuoteBtn = document.querySelector('.quote-new');
const saveQuoteBtn = document.querySelector('.quote-save');

// для плеера
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

async function fetchQuote() {
    try {
        const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey
            }
        });
        
        if (!response.ok) throw new Error('Ошибка сети');
        
        const data = await response.json();
        
        if (data.length > 0) {
            const quote = data[0];
            quoteElement.textContent = `${quote.quote} — ${quote.author}`;
            quoteElement.dataset.quote = `${quote.quote} — ${quote.author}`; 
        } else {
            quoteElement.textContent = 'Цитаты не найдены.';
        }
    } catch (error) {
        console.error('Ошибка:', error);
        quoteElement.textContent = 'Не удалось загрузить цитату.';
    }
}

async function copyToClipboard() {
    try {
        const quoteToCopy = quoteElement.dataset.quote || quoteElement.textContent;
        await navigator.clipboard.writeText(quoteToCopy);
        
        const originalText = saveQuoteBtn.textContent;
        saveQuoteBtn.textContent = 'Copied!';
        setTimeout(() => {
            saveQuoteBtn.textContent = originalText;
        }, 2000);
        
    } catch (err) {
        console.error('Ошибка копирования:', err);
        alert('Не удалось скопировать цитату');
    }
}

function loadTrack(index) {
    if (tracks[index]) {
        currentTrackIndex = index;
        audio.src = tracks[index].url;
        playlist.selectedIndex = index;
        audio.play();
        playPauseBtn.textContent = '⏸';
    }
}

function formatTime(time) {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', fetchQuote);

newQuoteBtn.addEventListener('click', fetchQuote);

saveQuoteBtn.addEventListener('click', copyToClipboard);

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