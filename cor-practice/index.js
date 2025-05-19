const apiKey = 'Amhx56sbjhSwWpIXAD2nTQ==eegfIrmh7TKx0KVG';
const quoteElement = document.querySelector('.quote-text');
const newQuoteBtn = document.querySelector('.quote-new');
const saveQuoteBtn = document.querySelector('.quote-save');

const fileInput = document.getElementById('bgUpload');
const resetBtn = document.getElementById('resetBtn');
const MAX_SIZE_MB = 5;
const selectors = ['.bg-control-container','.button','.player', '.quote', '.timer-container', '.stats-container','.tasks-queue'];

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

function formatTime(time) {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', fetchQuote);

newQuoteBtn.addEventListener('click', fetchQuote);

saveQuoteBtn.addEventListener('click', copyToClipboard);



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
  uploadBtn.textContent = 'Change background';
  
  // Скрытый input
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.id = 'bgUpload';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  
  // Кнопка сброса
  const resetBtn = document.createElement('button');
  resetBtn.className = 'bg-reset-btn';
  resetBtn.textContent = 'Reset background';
  
  // Добавляем элементы
  bgControlContainer.appendChild(uploadBtn);
  bgControlContainer.appendChild(fileInput);
  bgControlContainer.appendChild(resetBtn);
  
  // Вставляем в DOM
  const quoteContainer = document.querySelector('.bg-container');
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
        selectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(el => {
            el.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
          });
        });
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
    selectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(el => {
            el.style.backgroundColor = 'rgba(253, 222, 192, 1)';
          });
        });
  });
  
  // Восстановление фона
  try {
    const savedBg = localStorage.getItem('customBackground');
    if (savedBg) {
      // Проверяем валидность сохраненных данных
      if (savedBg.startsWith('data:image')) {
        bgDiv.style.backgroundImage = `url('${savedBg}')`;
        selectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(el => {
            el.style.backgroundColor = 'rgba(253, 222, 192, 0.7)';
          });
        });
      } else {
        localStorage.removeItem('customBackground');
        selectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(el => {
            el.style.backgroundColor = 'rgba(253, 222, 192, 1)';
          });
        });
      }
    }
  } catch (e) {
    console.error('Ошибка localStorage:', e);
  }
});
