let stats = {
    totalTasks: 0,
    totalMinutes: 0,
    todayTasks: 0,
    lastUpdateDate: null
};

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
    loadStats();

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

            updateStats(currentTask);

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
            toggleSettingsBtn.innerHTML = '<svg width="69" height="76" viewBox="0 0 69 76" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                '<g clip-path="url(#clip0_2003_128)">\n' +
                '<path d="M11.5 65.1109C10.9284 65.1101 10.3804 64.8633 9.97614 64.4248C9.57193 63.9862 9.34451 63.3916 9.34375 62.7714V49.7297C9.34582 49.1098 9.57309 48.5157 9.97625 48.0765L42.2941 13.0188C43.0204 12.2303 43.8827 11.6049 44.8318 11.1781C45.7809 10.7513 46.7982 10.5317 47.8256 10.5317C48.853 10.5317 49.8703 10.7513 50.8195 11.1781C51.7686 11.6049 52.6309 12.2303 53.3571 13.0188L57.3563 17.3577C58.083 18.1457 58.6595 19.0813 59.0528 20.111C59.4461 21.1408 59.6486 22.2446 59.6486 23.3593C59.6486 24.4739 59.4461 25.5777 59.0528 26.6075C58.6595 27.6372 58.083 28.5728 57.3563 29.3608L25.047 64.4246C24.8469 64.6427 24.609 64.8157 24.347 64.9335C24.0849 65.0512 23.804 65.1115 23.5204 65.1109H11.5ZM13.6562 50.6967V60.432H22.6262L45.3675 35.7584L36.3975 26.0262L13.6562 50.6967ZM48.4179 32.452L54.3145 26.0543C54.9716 25.3392 55.3406 24.3706 55.3406 23.3608C55.3406 22.351 54.9716 21.3824 54.3145 20.6673L50.3096 16.319C49.6509 15.6053 48.758 15.2044 47.8271 15.2044C46.8961 15.2044 46.0032 15.6053 45.3445 16.319L39.445 22.7198L48.4179 32.452Z" fill="#D49C5C"/>\n' +
                '</g>\n' +
                '<defs>\n' +
                '<clipPath id="clip0_2003_128">\n' +
                '<rect width="69" height="74.8629" fill="white" transform="translate(0 0.385712)"/>\n' +
                '</clipPath>\n' +
                '</defs>\n' +
                '</svg>\n';
        } else {
            settingsContent.classList.remove('collapsed');
            toggleSettingsBtn.innerHTML = '' +
                '<svg width="69" height="73" viewBox="0 0 69 73" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                '<path d="M51.75 18.25L17.25 54.75" stroke="#D49C5C" stroke-width="2" stroke-linecap="round"/>\n' +
                '<path d="M17.25 18.25L51.75 54.75" stroke="#D49C5C" stroke-width="2" stroke-linecap="round"/>\n' +
                '</svg>\n';
        }
    }

    switchMode('focus');
});

function updateStats(task) {
    const now = new Date();
    const today = now.toDateString();

    if (!stats.lastUpdateDate || stats.lastUpdateDate !== today) {
        stats.lastUpdateDate = today;
        stats.todayTasks = 0;
    }

    stats.totalTasks += 1;
    stats.todayTasks += 1;
    stats.totalMinutes += Math.floor(task.timeSpent / 60000); // Переводим миллисекунды в минуты

    saveStats();

    updateStatsDisplay();
}

function saveStats() {
    localStorage.setItem('pomodoroStats', JSON.stringify(stats));
}

function loadStats() {
    const savedStats = localStorage.getItem('pomodoroStats');
    if (savedStats) {
        stats = JSON.parse(savedStats);

        const today = new Date().toDateString();
        if (stats.lastUpdateDate !== today) {
            stats.todayTasks = 0;
            stats.lastUpdateDate = today;
            saveStats();
        }
    }
    updateStatsDisplay();
}

function updateStatsDisplay() {
    const statsContainer = document.querySelector('.stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat">
                <div>Total Tasks</div>
                <div>${stats.totalTasks || 0}</div>
            </div>
            <div class="stat">
                <div>Total Minutes</div>
                <div>${stats.totalMinutes || 0}</div>
            </div>
            <div class="stat">
                <div>Today Tasks</div>
                <div>${stats.todayTasks || 0}</div>
            </div>
        `;
    }
}