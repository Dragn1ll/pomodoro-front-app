let tasksQueue = [];
let completedTasks = [];
let currentTask = null;

const addTaskBtn = document.querySelector('.add-task-btn');
const taskForm = document.querySelector('.task-form');
const saveTaskBtn = document.querySelector('.save-task');
const cancelTaskBtn = document.querySelector('.cancel-task');
const tasksList = document.querySelector('.tasks-list');
const completedList = document.querySelector('.completed-list');

addTaskBtn.addEventListener('click', showTaskForm);
saveTaskBtn.addEventListener('click', addNewTask);
cancelTaskBtn.addEventListener('click', hideTaskForm);

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
            startedAt: null,
            completed: false,
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
        currentTask.startedAt = new Date(); 
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
    
    const totalTime = completedTasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0);
    const totalMinutes = Math.floor(totalTime / 60000);
    
    const statsElement = document.createElement('div');
    statsElement.className = 'completed-stats';
    statsElement.innerHTML = `
        <p>Total time spent: ${totalMinutes} minutes</p>
        <p>Total tasks completed: ${completedTasks.length}</p>
    `;
    completedList.appendChild(statsElement);
    
    completedTasks.slice().reverse().forEach(task => {
        const minutesSpent = Math.floor(task.timeSpent / 60000);
        const startTime = task.startedAt ? task.startedAt.toLocaleTimeString() : 'N/A';
        const endTime = task.completedAt.toLocaleTimeString();

        const taskElement = document.createElement('div');
        taskElement.className = 'completed-task';
        taskElement.innerHTML = `
            <h4>${task.name}</h4>
            ${task.description ? `<p>${task.description}</p>` : ''}
            <div class="task-stats">
                <span>Time spent: ${minutesSpent} min</span>
                <span>Started: ${startTime}</span>
                <span>Completed: ${endTime}</span>
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

const API_BASE_URL = '/api/tasks';

async function loadTasks() {
    try {
        const response = await fetch(API_BASE_URL + '/get');

        if (!response.ok) throw new Error('Failed to load tasks');

        const tasks = await response.json();
        tasksQueue = tasks.filter(task => !task.isCompleted);
        completedTasks = tasks.filter(task => task.isCompleted);

        renderTasksList();
        renderCompletedTasks();

        if (tasksQueue.length > 0) {
            setNextTask();
        }
    } catch (error) {
        console.log('Error loading tasks:', error);
    }
}

// async function addNewTask() {
//     const taskName = document.getElementById('task-name').value.trim();
//     const taskDescription = document.getElementById('task-description').value.trim();

//     if (taskName) {
//         try {
//             const newTask = {
//                 name: taskName,
//                 description: taskDescription,
//                 addedAt: new Date().toISOString(),
//                 startedAt: null,
//                 completed: false,
//                 timeSpent: 0
//             };

//             const response = await fetch(API_BASE_URL + '/add', {
//                 method: 'POST',
//                 headers: getAuthHeaders(),
//                 body: JSON.stringify(newTask)
//             });

//             if (!response.ok) throw new Error('Failed to add task');

//             const createdTask = await response.json();
//             tasksQueue.push(createdTask);
//             renderTasksList();

//             if (!currentTask) {
//                 setNextTask();
//             }

//             hideTaskForm();
//         } catch (error) {
//             console.log('Error adding task:', error);
//         }
//     }
// }

async function updateTask(taskId, updates) {
    try {
        const response = await fetch(`${API_BASE_URL}/update/${taskId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updates)
        });

        if (!response.ok) throw new Error('Failed to update task');

        return await response.json();
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
}

// async function deleteTask(index) {
//     const taskId = tasksQueue[index].id;

//     try {
//         const response = await fetch(`${API_BASE_URL}/delete/${taskId}`, {
//             method: 'DELETE',
//             headers: getAuthHeaders()
//         });

//         if (!response.ok) throw new Error('Failed to delete task');

//         tasksQueue.splice(index, 1);
//         renderTasksList();

//         if (index === 0) {
//             setNextTask();
//         }
//     } catch (error) {
//         console.error('Error deleting task:', error);
//         alert('Failed to delete task');
//     }
// }