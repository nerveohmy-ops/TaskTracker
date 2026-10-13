# TaskTracker

Full-stack приложение для управления личными задачами с полным CRUD-интерфейсом. Бэкенд на ASP.NET Core Web API, хранение в SQL Server, фронтенд на чистом HTML/CSS/JavaScript.

## Демо

<img width="1905" height="941" alt="Снимок экрана 2026-10-13 144542" src="https://github.com/user-attachments/assets/617de9e0-fe87-4928-bc7b-5c87487a9a08" />


## Возможности

- ✅ Просмотр списка всех задач
- ✅ Создание новой задачи через форму
- ✅ Отметка задачи как выполненной / возврат в активные
- ✅ Удаление задачи
- ✅ Данные сохраняются в базе данных (SQL Server)
- ✅ Адаптивный тёмный интерфейс

## Стек технологий

**Backend:**
- C# / .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server Express

**Frontend:**
- HTML5
- CSS3 (Flexbox, CSS-переменные, анимации)
- JavaScript (fetch API, async/await, DOM)

**Инструменты:**
- Git / GitHub
- Visual Studio 2022

## Архитектура

```
Браузер (HTML/CSS/JS)
    ↓ fetch (HTTP)
ASP.NET Core Web API (Controllers)
    ↓ EF Core
SQL Server (база данных)
```

## Структура проекта

```
TaskTracker/
├── TaskTracker/                    # Backend (.NET)
│   ├── Controllers/
│   │   └── TasksController.cs     # CRUD endpoints
│   ├── Data/
│   │   └── AppDbContext.cs        # DbContext для EF Core
│   ├── Dtos/
│   │   ├── CreateTaskDto.cs
│   │   └── UpdateTaskDto.cs
│   ├── Migrations/                # Миграции БД
│   ├── TaskItem.cs                # Модель задачи
│   ├── Program.cs                 # Точка входа, настройка сервисов
│   └── appsettings.json           # Строка подключения к БД
│
└── frontend/                       # Frontend
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

## API Endpoints

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/tasks` | Получить все задачи |
| GET | `/api/tasks/{id}` | Получить задачу по id |
| POST | `/api/tasks` | Создать задачу |
| PUT | `/api/tasks/{id}` | Обновить задачу |
| DELETE | `/api/tasks/{id}` | Удалить задачу |

## Как запустить

### Требования
- .NET 10 SDK
- SQL Server Express
- Visual Studio 2022 (или другая IDE)
- Любой современный браузер

### Шаги

1. **Клонировать репозиторий:**
   ```bash
   git clone https://github.com/nerveohmy-ops/TaskTracker.git
   cd TaskTracker
   ```

2. **Настроить строку подключения**

   Открой `TaskTracker/appsettings.json` и проверь строку подключения:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=TaskTrackerDb;Trusted_Connection=True;TrustServerCertificate=True;"
   }
   ```

3. **Применить миграции** (создаст таблицы в БД)

   В Visual Studio → `Сервис → Диспетчер пакетов NuGet → Консоль диспетчера пакетов`:
   ```powershell
   Update-Database
   ```

4. **Запустить бэкенд**

   Нажми `F5` в Visual Studio. Откроется Swagger на `https://localhost:7200/swagger`.

5. **Запустить фронтенд**

   Открой `frontend/index.html` в браузере.
   
   ⚠️ Убедись, что бэкенд запущен — иначе фронт не сможет загрузить данные.

## Что реализовано

- [x] Полный CRUD через API
- [x] База данных с миграциями EF Core
- [x] Валидация через DTO
- [x] CORS для связи фронта и бэка
- [x] Современный UI (тёмная тема)
- [x] Адаптивность под мобильные

## Планы развития

- [x] Валидация входных данных (Title не пустой, DueDate не в прошлом)
- [x] Асинхронные операции (async/await) в контроллере
- [ ] Авторизация пользователей (JWT)
- [ ] Поля для описания и дедлайна в форме
- [ ] Фильтры и поиск задач
- [ ] Деплой на сервер

## Автор

**nerveohmy-ops** — [github.com/nerveohmy-ops](https://github.com/nerveohmy-ops)

## Лицензия

Проект создан в учебных целях.
