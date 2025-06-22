const authContainer = document.createElement('div');
authContainer.className = 'auth-container';
authContainer.innerHTML = `
    <button class="auth-btn login-btn">Войти</button>
    <button class="auth-btn register-btn">Регистрация</button>
`;

const modalOverlay = document.createElement('div');
modalOverlay.className = 'modal-overlay';
modalOverlay.style.display = 'none';

const loginModal = document.createElement('div');
loginModal.className = 'auth-modal';
loginModal.innerHTML = `
    <div class="modal-header">
        <h2>Login</h2>
        <button class="close-btn">&times;</button>
    </div>
    <form class="auth-form" id="loginForm">
        <div class="form-group">
            <label for="loginEmail">Email:</label>
            <input type="email" id="loginEmail" required>
        </div>
        <div class="form-group">
            <label for="loginPassword">Password:</label>
            <input type="password" id="loginPassword" required>
        </div>
        <button type="submit" class="submit-btn">Войти</button>
    </form>
`;

const registerModal = document.createElement('div');
registerModal.className = 'auth-modal';
registerModal.innerHTML = `
    <div class="modal-header">
        <h2>Register</h2>
        <button class="close-btn">&times;</button>
    </div>
    <form class="auth-form" id="registerForm">
        <div class="form-group">
            <label for="registerEmail">Email:</label>
            <input type="email" id="registerEmail" required>
        </div>
        <div class="form-group">
            <label for="registerPassword">Password:</label>
            <input type="password" id="registerPassword" required>
        </div>
        <div class="form-group">
            <label for="confirmPassword">Confirm Password:</label>
            <input type="password" id="confirmPassword" required>
        </div>
        <button type="submit" class="submit-btn">Sign up</button>
    </form>
`;

const style = document.createElement('style');
style.textContent = `
    .auth-container {
        position: fixed;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 10px;
        z-index: 1000;
    }

    .auth-btn {
        background: rgba(212, 156, 92, 1);
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        color: white;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.2s;
    }

    .auth-btn:hover {
        background: rgba(192, 136, 72, 1);
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    }

    .auth-modal {
        background: white;
        border-radius: 0.5rem;
        padding: 2rem;
        min-width: 400px;
        max-width: 500px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .modal-header h2 {
        color: rgba(212, 156, 92, 1);
        margin: 0;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .close-btn:hover {
        color: #333;
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-group label {
        color: rgba(212, 156, 92, 1);
        font-weight: bold;
    }

    .form-group input {
        padding: 0.75rem;
        border: 1px solid rgba(239, 185, 124, 1);
        border-radius: 0.5rem;
        font-size: 1rem;
    }

    .form-group input:focus {
        outline: none;
        border-color: rgba(212, 156, 92, 1);
        box-shadow: 0 0 0 2px rgba(212, 156, 92, 0.2);
    }

    .submit-btn {
        background: rgba(212, 156, 92, 1);
        border: none;
        border-radius: 0.5rem;
        padding: 0.75rem;
        color: white;
        cursor: pointer;
        font-size: 1rem;
        margin-top: 1rem;
        transition: background-color 0.2s;
    }

    .submit-btn:hover {
        background: rgba(192, 136, 72, 1);
    }

    .submit-btn:disabled {
        background: rgba(212, 156, 92, 0.5);
        cursor: not-allowed;
    }

    .error-message {
        color: #f44336;
        font-size: 0.9rem;
        margin-top: 0.5rem;
    }

    .success-message {
        color: #4CAF50;
        font-size: 0.9rem;
        margin-top: 0.5rem;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .user-email {
        color: rgba(212, 156, 92, 1);
        font-weight: bold;
        background: rgba(253, 222, 192, 1);
        border: 1px solid rgba(239, 185, 124, 1);
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
    }

    .logout-btn {
        background: #f44336;
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        color: white;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.2s;
    }

    .logout-btn:hover {
        background: #d32f2f;
    }
`;

document.head.appendChild(style);
document.body.appendChild(authContainer);
document.body.appendChild(modalOverlay);
modalOverlay.appendChild(loginModal);
modalOverlay.appendChild(registerModal);

let currentUser = null;

function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

function showModal(modal) {
    modalOverlay.style.display = 'flex';
    modal.style.display = 'block';
    const otherModal = modal === loginModal ? registerModal : loginModal;
    otherModal.style.display = 'none';
}

function hideModal() {
    modalOverlay.style.display = 'none';
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
}

function showError(form, message) {
    let errorDiv = form.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        form.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function showSuccess(form, message) {
    let successDiv = form.querySelector('.success-message');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        form.appendChild(successDiv);
    }
    successDiv.textContent = message;
}

function clearMessages(form) {
    const errorDiv = form.querySelector('.error-message');
    const successDiv = form.querySelector('.success-message');
    if (errorDiv) errorDiv.remove();
    if (successDiv) successDiv.remove();
}

function updateAuthUI() {
    if (currentUser) {
        authContainer.innerHTML = `
            <div class="user-info">
                <span class="user-email">${currentUser.email}</span>
                <button class="logout-btn">Exit</button>
            </div>
        `;
        authContainer.querySelector('.logout-btn').addEventListener('click', logout);
    } else {
        authContainer.innerHTML = `
            <button class="auth-btn login-btn">Login</button>
            <button class="auth-btn register-btn">Register</button>
        `;
        setupAuthButtons();
    }
}

function setupAuthButtons() {
    authContainer.querySelector('.login-btn').addEventListener('click', () => showModal(loginModal));
    authContainer.querySelector('.register-btn').addEventListener('click', () => showModal(registerModal));
}

function logout() {
    localStorage.removeItem('authToken');
    currentUser = null;
    updateAuthUI();
}

async function login(email, password) {
    try {
        const response = await fetch('http://localhost:5041/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            currentUser = { email };
            hideModal();
            updateAuthUI();
            showSuccess(loginModal, 'Login success!');
            setTimeout(() => clearMessages(loginModal), 2000);
        } else if (response.status === 404) {
            showError(loginModal, 'User not found');
        } else if (response.status === 400) {
            showError(loginModal, 'Wrong password');
        } else {
            showError(loginModal, 'Login error');
        }
    } catch (error) {
        showError(loginModal, 'Network error');
    }
}

async function register(email, password) {
    try {
        const response = await fetch('http://localhost:5041/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            showSuccess(registerModal, 'Register success');
            setTimeout(() => {
                clearMessages(registerModal);
                showModal(loginModal);
            }, 2000);
        } else {
            showError(registerModal, 'Register error');
        }
    } catch (error) {
        showError(registerModal, 'Network error');
    }
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearMessages(loginForm);
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    login(email, password);
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearMessages(registerForm);
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showError(registerForm, 'Passwords don\'t match');
        return;
    }

    register(email, password);
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        hideModal();
    }
});

document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', hideModal);
});

setupAuthButtons();

window.getAuthHeaders = getAuthHeaders; 