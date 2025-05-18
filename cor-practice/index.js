// Добавляем элементы аутентификации динамически
const hostUrl = 'http://localhost:5054'
const authContainer = document.createElement('div');
authContainer.className = 'auth-buttons';
authContainer.style.position = 'absolute';
authContainer.style.top = '20px';
authContainer.style.right = '20px';
authContainer.style.display = 'flex';
authContainer.style.gap = '10px';

const loginBtn = document.createElement('button');
loginBtn.id = 'loginBtn';
loginBtn.textContent = 'Login';

const registerBtn = document.createElement('button');
registerBtn.id = 'registerBtn';
registerBtn.textContent = 'Register';

const logoutBtn = document.createElement('button');
logoutBtn.id = 'logoutBtn';
logoutBtn.textContent = 'Logout';
logoutBtn.style.display = 'none';

authContainer.appendChild(loginBtn);
authContainer.appendChild(registerBtn);
authContainer.appendChild(logoutBtn);
document.body.prepend(authContainer);

// Создаем модальное окно
const modal = document.createElement('div');
modal.id = 'authModal';
modal.className = 'modal';
modal.style.display = 'none';
modal.style.position = 'fixed';
modal.style.zIndex = '1000';
modal.style.left = '0';
modal.style.top = '0';
modal.style.width = '100%';
modal.style.height = '100%';
modal.style.backgroundColor = 'rgba(0,0,0,0.5)';

const modalContent = document.createElement('div');
modalContent.className = 'modal-content';
modalContent.style.backgroundColor = '#fff';
modalContent.style.margin = '15% auto';
modalContent.style.padding = '20px';
modalContent.style.border = '1px solid #d49c5c';
modalContent.style.borderRadius = '8px';
modalContent.style.width = '300px';
modalContent.style.position = 'relative';

const closeSpan = document.createElement('span');
closeSpan.className = 'close';
closeSpan.innerHTML = '&times;';
closeSpan.style.position = 'absolute';
closeSpan.style.right = '10px';
closeSpan.style.top = '10px';
closeSpan.style.fontSize = '20px';
closeSpan.style.cursor = 'pointer';

const modalTitle = document.createElement('h2');
modalTitle.id = 'modalTitle';
modalTitle.textContent = 'Login';

const authForm = document.createElement('form');
authForm.id = 'authForm';

const emailGroup = document.createElement('div');
emailGroup.className = 'form-group';

const emailLabel = document.createElement('label');
emailLabel.htmlFor = 'email';
emailLabel.textContent = 'Email:';

const emailInput = document.createElement('input');
emailInput.type = 'email';
emailInput.id = 'email';
emailInput.required = true;
emailInput.style.width = '100%';
emailInput.style.padding = '8px';
emailInput.style.border = '1px solid #d49c5c';
emailInput.style.borderRadius = '4px';

emailGroup.appendChild(emailLabel);
emailGroup.appendChild(emailInput);

const passwordGroup = document.createElement('div');
passwordGroup.className = 'form-group';

const passwordLabel = document.createElement('label');
passwordLabel.htmlFor = 'password';
passwordLabel.textContent = 'Password:';

const passwordInput = document.createElement('input');
passwordInput.type = 'password';
passwordInput.id = 'password';
passwordInput.required = true;
passwordInput.style.width = '100%';
passwordInput.style.padding = '8px';
passwordInput.style.border = '1px solid #d49c5c';
passwordInput.style.borderRadius = '4px';

passwordGroup.appendChild(passwordLabel);
passwordGroup.appendChild(passwordInput);

const submitBtn = document.createElement('button');
submitBtn.type = 'submit';
submitBtn.id = 'submitAuth';
submitBtn.textContent = 'Login';
submitBtn.style.width = '100%';
submitBtn.style.padding = '10px';
submitBtn.style.backgroundColor = '#d49c5c';
submitBtn.style.color = 'white';
submitBtn.style.border = 'none';
submitBtn.style.borderRadius = '4px';
submitBtn.style.cursor = 'pointer';

authForm.appendChild(emailGroup);
authForm.appendChild(passwordGroup);
authForm.appendChild(submitBtn);

modalContent.appendChild(closeSpan);
modalContent.appendChild(modalTitle);
modalContent.appendChild(authForm);
modal.appendChild(modalContent);
document.body.appendChild(modal);

// Логика работы
let isLoginMode = true;

function checkAuth() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
}

function showModal(isLogin) {
    isLoginMode = isLogin;
    modalTitle.textContent = isLogin ? 'Login' : 'Register';
    submitBtn.textContent = isLogin ? 'Login' : 'Register';
    modal.style.display = 'block';
}

function hideModal() {
    modal.style.display = 'none';
    authForm.reset();
}

loginBtn.addEventListener('click', () => showModal(true));
registerBtn.addEventListener('click', () => showModal(false));
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('jwtToken');
    checkAuth();
});

closeSpan.addEventListener('click', hideModal);
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        hideModal();
    }
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const endpoint = isLoginMode ? 'login' : 'register';
        const response = await fetch(`${hostUrl}/user/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data = await response.json();

        if (isLoginMode && data.token) {
            localStorage.setItem('jwtToken', data.token);
            checkAuth();
            hideModal();
        } else if (!isLoginMode) {
            alert('Registration successful! Please login.');
            showModal(true);
        }
    } catch (error) {
        console.error('Auth error:', error);
        alert(error.message);
    }
});

async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }
    return fetch(url, options);
}

// Проверяем авторизацию при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Оригинальный код остается без изменений
const apiKey = 'Amhx56sbjhSwWpIXAD2nTQ==eegfIrmh7TKx0KVG';
const quoteElement = document.querySelector('.quote-text');
const newQuoteBtn = document.querySelector('.quote-new');
const saveQuoteBtn = document.querySelector('.quote-save');

async function fetchQuote() {
    try {
        const response = await fetchWithAuth('https://api.api-ninjas.com/v1/quotes', {
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