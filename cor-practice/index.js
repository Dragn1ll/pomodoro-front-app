const apiKey = 'Amhx56sbjhSwWpIXAD2nTQ==eegfIrmh7TKx0KVG';
const quoteElement = document.querySelector('.quote-text');
const newQuoteBtn = document.querySelector('.quote-new');
const saveQuoteBtn = document.querySelector('.quote-save');

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

document.addEventListener('DOMContentLoaded', fetchQuote);

newQuoteBtn.addEventListener('click', fetchQuote);

saveQuoteBtn.addEventListener('click', copyToClipboard);

document.addEventListener('DOMContentLoaded', function() {
    // Timer variables
    let timer;
    let timeLeft = 25 * 60;
    let isRunning = false;
    let currentMode = 'focus';
    let cyclesCompleted = 0;
    let focusCyclesForCurrentTask = 0;
    let timeSpentOnCurrentTask = 0;
    let timerStartTime = 0;
    let isSettingsCollapsed = true;
    
    // Timer settings
    let settings = {
        focusTime: 25,
        shortBreak: 5,
        longBreak: 15,
        cyclesBeforeLongBreak: 3
    };
    
    // Tasks
    let tasksQueue = [];
    let completedTasks = [];
    let currentTask = null;
    
    // DOM elements
    const timerDisplay = document.querySelector('.timer');
    const startButton = document.querySelector('.timer-start');
    const pauseButton = document.querySelector('.timer-pause');
    const doneButton = document.querySelector('.timer-done');
    const restartButton = document.querySelector('.timer-restart');
    const currentModeDisplay = document.querySelector('.current-mode');
    const cyclesCount = document.querySelector('.cycles-count');
    
    // Timer settings elements
    const saveTimerSettingsBtn = document.querySelector('.save-timer-settings');
    const toggleSettingsBtn = document.querySelector('.toggle-settings');
    const settingsContent = document.querySelector('.settings-content');
    
    // Task elements
    const addTaskBtn = document.querySelector('.add-task-btn');
    const taskForm = document.querySelector('.task-form');
    const saveTaskBtn = document.querySelector('.save-task');
    const cancelTaskBtn = document.querySelector('.cancel-task');
    const tasksList = document.querySelector('.tasks-list');
    const completedList = document.querySelector('.completed-list');
    
    // Quote elements
    const quoteText = document.querySelector('.quote-text');
    const newQuoteBtn = document.querySelector('.quote-new');
    const copyQuoteBtn = document.querySelector('.quote-save');
    
    // Initialize
    updateTimerDisplay();
    loadSettings();
    
    // Event listeners
    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    doneButton.addEventListener('click', completeTask);
    restartButton.addEventListener('click', restartTimer);
    
    saveTimerSettingsBtn.addEventListener('click', saveTimerSettings);
    toggleSettingsBtn.addEventListener('click', toggleSettings);
    
    addTaskBtn.addEventListener('click', showTaskForm);
    saveTaskBtn.addEventListener('click', addNewTask);
    cancelTaskBtn.addEventListener('click', hideTaskForm);
    
    newQuoteBtn.addEventListener('click', fetchRandomQuote);
    copyQuoteBtn.addEventListener('click', copyQuote);
    
    // Timer functions
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            timerStartTime = Date.now();
            timer = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    isRunning = false;
                    timerComplete();
                }
            }, 1000);
            
            updateTimerButtons();
        }
    }
    
    function pauseTimer() {
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
            timeSpentOnCurrentTask += (Date.now() - timerStartTime);
            updateTimerButtons();
        }
    }
    
    function completeTask() {
        if (currentTask) {
            // Update task stats
            currentTask.focusCycles = focusCyclesForCurrentTask;
            currentTask.timeSpent = timeSpentOnCurrentTask;
            currentTask.completedAt = new Date();
            currentTask.completed = true;
            
            // Move to completed
            completedTasks.push(currentTask);
            tasksQueue.shift();
            
            // Render updates
            renderTasksList();
            renderCompletedTasks();
            
            // Set next task
            setNextTask();
            
            // Reset interface
            updateTimerButtons();
            
            // Reset timer
            restartTimer();
        }
    }
    
    function restartTimer() {
        pauseTimer();
        resetTimer();
        updateTimerDisplay();
        updateTimerButtons();
    }
    
    function resetTimer() {
        switch (currentMode) {
            case 'focus':
                timeLeft = settings.focusTime * 60;
                break;
            case 'shortBreak':
                timeLeft = settings.shortBreak * 60;
                break;
            case 'longBreak':
                timeLeft = settings.longBreak * 60;
                break;
        }
    }
    
    function timerComplete() {
        if (currentMode === 'focus') {
            cyclesCompleted++;
            focusCyclesForCurrentTask++;
            cyclesCount.textContent = cyclesCompleted;
            
            if (currentTask) {
                timeSpentOnCurrentTask += (settings.focusTime * 60 * 1000);
            }
            
            // Check if it's time for a long break
            if (cyclesCompleted % settings.cyclesBeforeLongBreak === 0) {
                switchMode('longBreak');
            } else {
                switchMode('shortBreak');
            }
        } else {
            switchMode('focus');
        }
        
        startTimer();
    }
    
    function switchMode(mode) {
        pauseTimer();
        currentMode = mode;
        currentModeDisplay.textContent = mode === 'focus' ? 'Focus' : 
                                      mode === 'shortBreak' ? 'Short Break' : 'Long Break';
        resetTimer();
        updateTimerDisplay();
        updateTimerButtons();
    }
    
    function updateTimerButtons() {
        if (isRunning) {
            startButton.style.display = 'none';
            pauseButton.style.display = 'block';
            doneButton.style.display = 'none';
            restartButton.style.display = 'block';
            restartButton.textContent = 'Stop';
        } else {
            if (currentTask && currentMode === 'focus') {
                startButton.style.display = 'block';
                pauseButton.style.display = 'none';
                doneButton.style.display = 'block';
                restartButton.style.display = 'block';
                restartButton.textContent = 'Stop';
            } else {
                startButton.style.display = 'block';
                pauseButton.style.display = 'none';
                doneButton.style.display = 'none';
                restartButton.style.display = 'block';
                restartButton.textContent = 'Stop';
            }
        }
    }
    
    // Task functions
    function showTaskForm() {
        taskForm.style.display = 'block';
        addTaskBtn.style.display = 'none';
    }
    
    function hideTaskForm() {
        taskForm.style.display = 'none';
        addTaskBtn.style.display = 'flex';
        document.getElementById('task-name').value = '';
        document.getElementById('task-description').value = '';
    }
    
    function addNewTask() {
        const taskName = document.getElementById('task-name').value.trim();
        const taskDescription = document.getElementById('task-description').value.trim();
        
        if (taskName) {
            const newTask = {
                id: Date.now(),
                name: taskName,
                description: taskDescription,
                addedAt: new Date(),
                completed: false,
                focusCycles: 0,
                timeSpent: 0
            };
            
            tasksQueue.push(newTask);
            renderTasksList();
            
            if (!currentTask) {
                setNextTask();
            }
            
            hideTaskForm();
        }
    }
    
    function setNextTask() {
        if (tasksQueue.length > 0) {
            currentTask = tasksQueue[0];
            focusCyclesForCurrentTask = 0;
            timeSpentOnCurrentTask = 0;
            renderTasksList();
        } else {
            currentTask = null;
        }
    }
    
    function renderTasksList() {
        tasksList.innerHTML = '';
        
        tasksQueue.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${index === 0 ? 'current' : ''}`;
            taskElement.innerHTML = `
                <div class="task-info">
                    <h4>${task.name}</h4>
                    ${task.description ? `<p>${task.description}</p>` : ''}
                </div>
                <div class="task-actions">
                    <button class="move-up-btn" ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button class="move-down-btn" ${index === tasksQueue.length - 1 ? 'disabled' : ''}>↓</button>
                    <button class="delete-task-btn">✕</button>
                </div>
            `;
            
            if (index > 0) {
                taskElement.querySelector('.move-up-btn').addEventListener('click', () => {
                    moveTaskUp(index);
                });
            }
            
            if (index < tasksQueue.length - 1) {
                taskElement.querySelector('.move-down-btn').addEventListener('click', () => {
                    moveTaskDown(index);
                });
            }
            
            taskElement.querySelector('.delete-task-btn').addEventListener('click', () => {
                deleteTask(index);
            });
            
            tasksList.appendChild(taskElement);
        });
    }
    
    function renderCompletedTasks() {
        completedList.innerHTML = '';
        
        completedTasks.slice().reverse().forEach(task => {
            const minutesSpent = Math.floor(task.timeSpent / 60000);
            const cycles = task.focusCycles;
            
            const taskElement = document.createElement('div');
            taskElement.className = 'completed-task';
            taskElement.innerHTML = `
                <h4>${task.name}</h4>
                ${task.description ? `<p>${task.description}</p>` : ''}
                <div class="task-stats">
                    <span>Time spent: ${minutesSpent} min</span>
                    <span>Cycles: ${cycles}</span>
                    <span>Completed: ${task.completedAt.toLocaleTimeString()}</span>
                </div>
            `;
            
            completedList.appendChild(taskElement);
        });
    }
    
    function moveTaskUp(index) {
        if (index > 0) {
            [tasksQueue[index], tasksQueue[index - 1]] = [tasksQueue[index - 1], tasksQueue[index]];
            renderTasksList();
            if (index === 1) {
                setNextTask();
            }
        }
    }
    
    function moveTaskDown(index) {
        if (index < tasksQueue.length - 1) {
            [tasksQueue[index], tasksQueue[index + 1]] = [tasksQueue[index + 1], tasksQueue[index]];
            renderTasksList();
            if (index === 0) {
                setNextTask();
            }
        }
    }
    
    function deleteTask(index) {
        tasksQueue.splice(index, 1);
        renderTasksList();
        if (index === 0) {
            setNextTask();
        }
    }
    
    // Settings functions
    function saveTimerSettings() {
        settings.focusTime = parseInt(document.getElementById('focus-time').value);
        settings.shortBreak = parseInt(document.getElementById('short-break').value);
        settings.longBreak = parseInt(document.getElementById('long-break').value);
        settings.cyclesBeforeLongBreak = parseInt(document.getElementById('cycles-before-long-break').value);
        
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
        restartTimer();
    }
    
    function loadSettings() {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
            document.getElementById('focus-time').value = settings.focusTime;
            document.getElementById('short-break').value = settings.shortBreak;
            document.getElementById('long-break').value = settings.longBreak;
            document.getElementById('cycles-before-long-break').value = settings.cyclesBeforeLongBreak;
        }
        resetTimer();
        updateTimerDisplay();
    }
    
    function toggleSettings() {
        isSettingsCollapsed = !isSettingsCollapsed;
        if (isSettingsCollapsed) {
            settingsContent.classList.add('collapsed');
            toggleSettingsBtn.textContent = 'Expand';
        } else {
            settingsContent.classList.remove('collapsed');
            toggleSettingsBtn.textContent = 'Collapse';
        }
    }
    
    // Initialize with focus mode
    switchMode('focus');
});