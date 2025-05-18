document.addEventListener('DOMContentLoaded', function() {
    let timer;
    let timeLeft = 25 * 60;
    let isRunning = false;
    let currentMode = 'focus';
    let timeSpentOnCurrentTask = 0;
    let timerStartTime = 0;
    let isSettingsCollapsed = true;
    let focusSessionsBeforeLongBreak = 0;
    
    let settings = {
        focusTime: 25,
        shortBreak: 5,
        longBreak: 15,
        cyclesBeforeLongBreak: 4 
    };
    
    const timerDisplay = document.querySelector('.timer');
    const startButton = document.querySelector('.timer-start');
    const pauseButton = document.querySelector('.timer-pause');
    const resumeButton = document.querySelector('.timer-resume');
    const doneButton = document.querySelector('.timer-done');
    const restartButton = document.querySelector('.timer-restart');
    const skipButton = document.querySelector('.timer-skip');
    
    const saveTimerSettingsBtn = document.querySelector('.save-timer-settings');
    const toggleSettingsBtn = document.querySelector('.toggle-settings');
    const settingsContent = document.querySelector('.settings-content');
    
    updateTimerDisplay();
    loadSettings();

    const focusModeBtn = document.querySelector('.focus-mode');
    const shortBreakModeBtn = document.querySelector('.short-break-mode');
    const longBreakModeBtn = document.querySelector('.long-break-mode');

    focusModeBtn.addEventListener('click', () => switchMode('focus', true));
    shortBreakModeBtn.addEventListener('click', () => switchMode('shortBreak', true));
    longBreakModeBtn.addEventListener('click', () => switchMode('longBreak', true));

    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resumeButton.addEventListener('click', resumeTimer);
    doneButton.addEventListener('click', completeTask);
    restartButton.addEventListener('click', restartTimer);
    skipButton.addEventListener('click', skipBreak);
    
    saveTimerSettingsBtn.addEventListener('click', saveTimerSettings);
    toggleSettingsBtn.addEventListener('click', toggleSettings);
    
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
            
            pauseButton.style.display = 'none';
            resumeButton.style.display = 'block';
            
            if (currentMode === 'focus') {
                restartButton.style.display = 'none';
                doneButton.style.display = 'block';
            }
        }
    }
    
    function resumeTimer() {
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
            
            resumeButton.style.display = 'none';
            pauseButton.style.display = 'block';
            doneButton.style.display = 'none';
            restartButton.style.display = 'block';
        }
    }
    
    function completeTask() {
        if (currentTask) {
            currentTask.timeSpent = timeSpentOnCurrentTask;
            currentTask.completedAt = new Date();
            currentTask.startedAt = currentTask.startedAt || new Date();
            currentTask.completed = true;
            
            completedTasks.push(currentTask);
            tasksQueue.shift();
            
            renderTasksList();
            renderCompletedTasks();

            setNextTask();

            timeSpentOnCurrentTask = 0;
            
            if (focusSessionsBeforeLongBreak >= 3) {
                switchMode('longBreak');
                focusSessionsBeforeLongBreak = 0;
            } else {
                switchMode('shortBreak');
            }
        }
    }
    
    function skipBreak() {
        switchMode('focus');
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
            focusSessionsBeforeLongBreak++;
            
            if (currentTask) {
                timeSpentOnCurrentTask += (settings.focusTime * 60 * 1000);
            }
            
            if (focusSessionsBeforeLongBreak >= settings.cyclesBeforeLongBreak) {
                switchMode('longBreak');
                focusSessionsBeforeLongBreak = 0;
            } else {
                switchMode('shortBreak');
            }
        } else {
            switchMode('focus');
        }
        
        startTimer();
    }
    
    function switchMode(mode, isManual = false) {
        if (isManual) {
            pauseTimer();
            focusSessionsBeforeLongBreak = 0; 
        }
        
        currentMode = mode;
    
        focusModeBtn.classList.remove('active');
        shortBreakModeBtn.classList.remove('active');
        longBreakModeBtn.classList.remove('active');
        
        if (mode === 'focus') focusModeBtn.classList.add('active');
        if (mode === 'shortBreak') shortBreakModeBtn.classList.add('active');
        if (mode === 'longBreak') longBreakModeBtn.classList.add('active');
        
        resetTimer();
        updateTimerDisplay();
        updateTimerButtons();
    }
    
    function updateTimerButtons() {
        startButton.style.display = 'none';
        pauseButton.style.display = 'none';
        resumeButton.style.display = 'none';
        doneButton.style.display = 'none';
        restartButton.style.display = 'none';
        skipButton.style.display = 'none';
        
        if (currentMode === 'focus') {
            if (isRunning) {
                pauseButton.style.display = 'block';
                restartButton.style.display = 'block';
            } else {
                if (resumeButton.style.display === 'block') {
                    resumeButton.style.display = 'block';
                    doneButton.style.display = 'block';
                } else {
                    startButton.style.display = 'block';
                    restartButton.style.display = 'block';
                }
            }
        } else {
            if (isRunning) {
                pauseButton.style.display = 'block';
                skipButton.style.display = 'block';
            } else {
                if (resumeButton.style.display === 'block') {
                    resumeButton.style.display = 'block';
                    skipButton.style.display = 'block';
                } else {
                    startButton.style.display = 'block';
                    skipButton.style.display = 'block';
                }
            }
        }
    }

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
    
    switchMode('focus');
});