async function handleRegister(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) return;

    try {
        const response = await fetch(API_URL + '/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert('Ошибка: ' + errorText);
            return;
        }

        window.location.href = 'login.html';
    } catch (error) {
        console.error(error);
        alert('Ошибка сети');
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) return;

    try {
        const response = await fetch(API_URL + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            alert('Неверный email или пароль');
            return;
        }

        const data = await response.json();
        setToken(data.token);

        window.location.href = 'index.html';
    } catch (error) {
        console.error(error);
        alert('Ошибка сети');
    }
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}