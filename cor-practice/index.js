const apiKey = 'Amhx56sbjhSwWpIXAD2nTQ==eegfIrmh7TKx0KVG';
const quoteElement = document.querySelector('.quote-text');
const newQuoteBtn = document.querySelector('.quote-new');
const saveQuoteBtn = document.querySelector('.quote-save');

const fileInput = document.getElementById('bgUpload');
const resetBtn = document.getElementById('resetBtn');
const MAX_SIZE_MB = 5;

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

document.addEventListener('DOMContentLoaded', () => {
  const MAX_SIZE_MB = 5;
  
  // Создаём контейнер для фона
  const bgDiv = document.createElement('div');
  bgDiv.className = 'background-container';
  document.body.insertBefore(bgDiv, document.body.firstChild);
  
  // Создаём элементы управления
  const bgControlContainer = document.createElement('div');
  bgControlContainer.className = 'bg-control-container';
  
  // Кнопка загрузки
  const uploadBtn = document.createElement('button');
  uploadBtn.className = 'bg-upload-btn';
  uploadBtn.textContent = 'Изменить фон';
  
  // Скрытый input
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.id = 'bgUpload';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  
  // Кнопка сброса
  const resetBtn = document.createElement('button');
  resetBtn.className = 'bg-reset-btn';
  resetBtn.textContent = 'Сбросить фон';
  
  // Добавляем элементы
  bgControlContainer.appendChild(uploadBtn);
  bgControlContainer.appendChild(fileInput);
  bgControlContainer.appendChild(resetBtn);
  
  // Вставляем в DOM
  const quoteContainer = document.querySelector('.player-and-quote-container');
  if (quoteContainer) {
    quoteContainer.appendChild(bgControlContainer);
  } else {
    console.error('Контейнер не найден');
    document.body.appendChild(bgControlContainer);
  }
  
  // Обработчики событий
  uploadBtn.addEventListener('click', () => fileInput.click());
  
  fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;
    
    console.log('Загрузка файла:', file.name); // Для отладки
    
    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      alert('Только изображения (JPEG, PNG)');
      return;
    }
    
    // Проверка размера
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Максимум ${MAX_SIZE_MB}МБ`);
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      // Создаем временное изображение для проверки
      const testImg = new Image();
      testImg.onload = function() {
        // Устанавливаем фон только после успешной загрузки
        bgDiv.style.backgroundImage = `url('${e.target.result}')`;
        try {
          localStorage.setItem('customBackground', e.target.result);
          console.log('Фон сохранен');
        } catch (err) {
          console.error('Ошибка сохранения:', err);
        }
      };
      testImg.onerror = function() {
        alert('Ошибка загрузки изображения');
      };
      testImg.src = e.target.result;
    };
    
    reader.onerror = function() {
      alert('Ошибка чтения файла');
    };
    
    reader.readAsDataURL(file);
  });
  
  resetBtn.addEventListener('click', () => {
    bgDiv.style.backgroundImage = '';
    localStorage.removeItem('customBackground');
    fileInput.value = '';
  });
  
  // Восстановление фона
  try {
    const savedBg = localStorage.getItem('customBackground');
    if (savedBg) {
      // Проверяем валидность сохраненных данных
      if (savedBg.startsWith('data:image')) {
        bgDiv.style.backgroundImage = `url('${savedBg}')`;
      } else {
        localStorage.removeItem('customBackground');
      }
    }
  } catch (e) {
    console.error('Ошибка localStorage:', e);
  }
});