const API_URL = 'https://localhost:7200/api/tasks';

async function loadTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();

    const list = document.getElementById('task-list');
    list.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');

        const titleSpan = document.createElement('span');
        titleSpan.textContent = task.title;

        if (task.isCompleted) {
            titleSpan.classList.add('completed');
        }

        const completeButton = document.createElement('button');
        completeButton.textContent = task.isCompleted ? '↺ Вернуть' : '✓ Выполнено';
        completeButton.addEventListener('click', () => toggleComplete(task));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '✕ Удалить';
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(titleSpan);
        li.appendChild(completeButton);
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}

async function createTask(title) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: title,
            description: '',
            isCompleted: false,
            dueDate: null
        })
    });

    if (!response.ok) {
        console.error('Ошибка при создании задачи:', response.status);
        return;
    }

    await loadTasks();
}

async function toggleComplete(task) {
    const response = await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        console.error('Ошибка при удалении задачи:', response.status);
        return;
    }

    await loadTasks();
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

loadTasks();