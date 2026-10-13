const API_URL = 'https://localhost:7200/api';
const TOKEN_KEY = 'tasktracker_token';

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}

function requireAuth() {
    if (!getToken()) {
        window.location.href = 'login.html';
    }
}

async function apiFetch(url, options = {}) {
    const token = getToken();

    if (!token) {
        window.location.href = 'login.html';
        throw new Error('No token');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
    };

    const response = await fetch(API_URL + url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        removeToken();
        window.location.href = 'login.html';
        throw new Error('Unauthorized');
    }

    return response;
}