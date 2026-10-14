requireAuth();

let currentFilter = localStorage.getItem('tasktracker_filter') || 'all';
let allTasks = [];

async function loadTasks() {
    const response = await apiFetch('/tasks');
    allTasks = await response.json();

    renderTasks();
    updateCounter();
}

function renderTasks() {
    const list = document.getElementById('task-list');
    list.innerHTML = '';

    let tasksToShow = allTasks;

    if (currentFilter === 'active') {
        tasksToShow = allTasks.filter(t => !t.isCompleted);
    } else if (currentFilter === 'completed') {
        tasksToShow = allTasks.filter(t => t.isCompleted);
    }

    tasksToShow.forEach(task => {
        const li = document.createElement('li');

        const titleSpan = document.createElement('span');
        titleSpan.textContent = task.title;

        if (task.isCompleted) {
            titleSpan.classList.add('completed');
        }

        li.appendChild(titleSpan);

        if (task.dueDate) {
            const dateSpan = document.createElement('span');
            dateSpan.className = 'task-deadline';
            dateSpan.textContent = formatDeadline(task.dueDate, task.isCompleted);

            const deadlineClass = getDeadlineClass(task.dueDate, task.isCompleted);
            if (deadlineClass) {
                dateSpan.classList.add(deadlineClass);
            }

            li.appendChild(dateSpan);
        }

        const completeButton = document.createElement('button');
        completeButton.textContent = task.isCompleted ? 'Вернуть' : 'Выполнено';
        completeButton.addEventListener('click', () => toggleComplete(task));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(completeButton);
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}

function updateCounter() {
    const counter = document.getElementById('task-counter');
    const activeCount = allTasks.filter(t => !t.isCompleted).length;
    const totalCount = allTasks.length;

    if (totalCount === 0) {
        counter.textContent = 'Пока нет задач';
    } else if (activeCount === 0) {
        counter.textContent = 'Все задачи выполнены';
    } else {
        counter.textContent = `${activeCount} из ${totalCount} активных`;
    }
}

function formatDeadline(dueDate, isCompleted) {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDay = new Date(due);
    dueDay.setHours(0, 0, 0, 0);

    const diffDays = Math.round((dueDay - today) / (1000 * 60 * 60 * 24));

    if (isCompleted) return `${due.getDate()}.${String(due.getMonth() + 1).padStart(2, '0')}`;
    if (diffDays === 0) return 'сегодня';
    if (diffDays === 1) return 'завтра';
    if (diffDays === -1) return 'вчера';
    if (diffDays < 0) return `${Math.abs(diffDays)} дн. назад`;

    return `${due.getDate()}.${String(due.getMonth() + 1).padStart(2, '0')}`;
}

function getDeadlineClass(dueDate, isCompleted) {
    if (isCompleted) return 'deadline-done';

    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'deadline-overdue';
    if (diffDays === 0) return 'deadline-today';
    if (diffDays <= 2) return 'deadline-soon';
    return '';
}

async function createTask(title) {
    const dueDate = dateInput.value || null;

    const response = await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            description: '',
            dueDate: dueDate
        })
    });

    if (!response.ok) {
        console.error('Ошибка при создании задачи:', response.status);
        return;
    }

    await loadTasks();

    dateClear.click();
}

async function toggleComplete(task) {
    const response = await apiFetch(`/tasks/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            title: task.title,
            description: task.description,
            isCompleted: !task.isCompleted,
            dueDate: task.dueDate
        })
    });

    if (!response.ok) {
        console.error('Ошибка при обновлении задачи:', response.status);
        return;
    }

    await loadTasks();
}

async function deleteTask(id) {
    const response = await apiFetch(`/tasks/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        console.error('Ошибка при удалении задачи:', response.status);
        return;
    }

    await loadTasks();
}

function handleLogout() {
    removeToken();
    window.location.href = 'login.html';
}

const form = document.getElementById('task-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const input = document.getElementById('task-title');
    const title = input.value.trim();

    if (!title) return;

    await createTask(title);
    input.value = '';
});

const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
}


const dateButton = document.getElementById('date-button');
const dateInput = document.getElementById('task-date');
const dateDisplay = document.getElementById('date-display');
const dateClear = document.getElementById('date-clear');

Calendar.init({
    display: dateButton,
    input: dateInput,
    clear: dateClear,
    onSelect: (date) => {
        updateDateDisplay(date);
    }
});

function updateDateDisplay(date) {
    if (!date) {
        dateDisplay.textContent = 'Дата';
        dateButton.classList.remove('has-date');
        dateClear.classList.remove('visible');
        return;
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const formatted = `${day}.${month}.${year}`;
    dateDisplay.textContent = formatted;

    const iso = `${year}-${month}-${day}`;
    dateInput.value = iso;

    dateButton.classList.add('has-date');
    dateClear.classList.add('visible');
}

function applyFilter(filter) {
    currentFilter = filter;
    localStorage.setItem('tasktracker_filter', filter);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    renderTasks();
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
});

applyFilter(currentFilter);


loadTasks();