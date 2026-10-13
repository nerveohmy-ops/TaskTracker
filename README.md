# TaskTracker

Full-stack приложение для управления личными задачами с авторизацией пользователей. Бэкенд на ASP.NET Core Web API с JWT-аутентификацией и SQL Server, фронтенд на чистом HTML/CSS/JavaScript в стиле японского минимализма.

## Демо

> ![Uploading Снимок экрана 2026-10-13 161636.png…]()


## Возможности

### Управление задачами
- ✅ Регистрация и вход по email + пароль
- ✅ JWT-авторизация
- ✅ Каждый пользователь видит только свои задачи
- ✅ Создание, просмотр, обновление и удаление задач
- ✅ Установка дедлайна через кастомный календарь
- ✅ Относительное время ("сегодня", "завтра", "через N дней")
- ✅ Цветовая индикация срочности (просрочено / сегодня / скоро)
- ✅ Отметка задач как выполненных

### Дизайн
- ✅ Японский минимализм (тёплая палитра, засечные шрифты)
- ✅ Плавные анимации без перегрузки
- ✅ Адаптивность под мобильные
- ✅ Glass-morphism и тонкие линии

## Стек технологий

**Backend:**
- C# / .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server Express
- JWT (System.IdentityModel.Tokens.Jwt)
- BCrypt для хеширования паролей

**Frontend:**
- HTML5
- CSS3 (Flexbox, CSS-переменные, анимации, backdrop-filter)
- JavaScript (fetch API, async/await, DOM, кастомный календарь)
- Google Fonts (Cormorant Garamond + Inter)

**Инструменты:**
- Git / GitHub
- Visual Studio 2022

## Архитектура

```
Браузер (HTML/CSS/JS)
    ↓ fetch с JWT в Authorization header
ASP.NET Core Web API (Controllers + JWT middleware)
    ↓ EF Core
SQL Server (Users + Tasks)
```

## Структура проекта

```
TaskTracker/
├── TaskTracker/                          # Backend (.NET)
│   ├── Controllers/
│   │   ├── TasksController.cs           # CRUD задач (требует авторизации)
│   │   └── AuthController.cs            # Регистрация и логин
│   ├── Data/
│   │   └── AppDbContext.cs              # DbContext
│   ├── Dtos/
│   │   ├── CreateTaskDto.cs
│   │   ├── UpdateTaskDto.cs
│   │   ├── RegisterDto.cs
│   │   └── LoginDto.cs
│   ├── Migrations/
│   ├── Services/
│   │   └── TokenService.cs              # Генерация JWT
│   ├── TaskItem.cs                      # Модель задачи
│   ├── User.cs                          # Модель пользователя
│   ├── Program.cs                       # Настройка JWT, DI, CORS
│   └── appsettings.json
│
└── frontend/                              # Frontend
    ├── index.html                        # Главная (защищена)
    ├── login.html                        # Страница входа
    ├── register.html                     # Страница регистрации
    ├── css/
    │   └── style.css
    └── js/
        ├── api.js                        # apiFetch + работа с токеном
        ├── auth.js                       # Логика login/register
        ├── calendar.js                   # Кастомный календарь
        └── app.js                        # Логика главной страницы
```

## API Endpoints

### Auth
| Метод | URL | Описание | Авторизация |
|-------|-----|----------|-------------|
| POST | `/api/auth/register` | Регистрация | ❌ |
| POST | `/api/auth/login` | Вход, возвращает JWT | ❌ |

### Tasks (требуют JWT)
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/tasks` | Получить все свои задачи |
| GET | `/api/tasks/{id}` | Получить одну задачу |
| POST | `/api/tasks` | Создать задачу |
| PUT | `/api/tasks/{id}` | Обновить задачу |
| DELETE | `/api/tasks/{id}` | Удалить задачу |

## Безопасность

- Пароли хешируются через BCrypt (никогда не хранятся в открытом виде)
- JWT-токены с истечением 7 дней
- Validation: issuer, audience, signing key, lifetime
- Каждый endpoint задач проверяет, что задача принадлежит текущему пользователю
- При попытке доступа к чужой задаче — 404 (не палим существование)
- Валидация входных данных через DataAnnotations

## Как запустить

### Требования
- .NET 10 SDK
- SQL Server Express
- Visual Studio 2022 (или Rider / VS Code)
- Любой современный браузер

### Шаги

1. **Клонировать репозиторий:**
   ```bash
   git clone https://github.com/nerveohmy-ops/TaskTracker.git
   cd TaskTracker
   ```

2. **Настроить строку подключения** в `TaskTracker/appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=TaskTrackerDb;Trusted_Connection=True;TrustServerCertificate=True;"
   }
   ```

3. **Проверить настройки JWT** в `TaskTracker/appsettings.json`:
   ```json
   "Jwt": {
     "Key": "ваш-секретный-ключ-минимум-32-символа",
     "Issuer": "TaskTracker",
     "Audience": "TaskTrackerUsers"
   }
   ```

4. **Применить миграции** (создаст таблицы Users и Tasks):
   В Visual Studio → `Сервис → Диспетчер пакетов NuGet → Консоль диспетчера пакетов`:
   ```powershell
   Update-Database
   ```

5. **Запустить бэкенд:**
   Нажмите `F5` в Visual Studio. Откроется Swagger на `https://localhost:7200/swagger`.

6. **Открыть фронтенд:**
   Откройте `frontend/index.html` в браузере.
   
   ⚠️ Убедитесь, что бэкенд запущен.

7. **Зарегистрироваться и войти.**

## Что реализовано

- [x] Полный CRUD через API
- [x] База данных с миграциями EF Core
- [x] Валидация входных данных
- [x] CORS
- [x] Регистрация пользователей
- [x] Хеширование паролей (BCrypt)
- [x] JWT-аутентификация
- [x] Защита endpoints через `[Authorize]`
- [x] Привязка задач к пользователю (связь 1:N)
- [x] Фильтрация — только свои задачи
- [x] Кастомный календарь на чистом JS
- [x] Дедлайны с относительным временем
- [x] Адаптивный UI в стиле японского минимализма

## Планы развития

- [ ] Фильтры (все / активные / выполненные)
- [ ] Поиск по названию
- [ ] Редактирование названия и описания задачи
- [ ] Сортировка (по дате / алфавиту)
- [ ] Асинхронные операции во всех методах
- [ ] Unit-тесты (xUnit)
- [ ] Docker-контейнеризация
- [ ] Деплой в облако

## Автор

**nerveohmy-ops** — [github.com/nerveohmy-ops](https://github.com/nerveohmy-ops)

## Лицензия

Проект создан в учебных целях.
