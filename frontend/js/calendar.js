const Calendar = (() => {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = null;
    let calendarElement = null;
    let displayElement = null;
    let inputElement = null;
    let clearButton = null;
    let onSelectCallback = null;

    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    function init(options) {
        displayElement = options.display;
        inputElement = options.input;
        clearButton = options.clear;
        onSelectCallback = options.onSelect;

        createCalendarElement();
        attachEvents();
        render();
    }

    function createCalendarElement() {
        calendarElement = document.createElement('div');
        calendarElement.className = 'calendar hidden';
        calendarElement.innerHTML = `
            <div class="calendar-header">
                <button type="button" class="calendar-nav" data-nav="prev">←</button>
                <div class="calendar-month"></div>
                <button type="button" class="calendar-nav" data-nav="next">→</button>
            </div>
            <div class="calendar-weekdays">
                <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div>
                <div>Пт</div><div>Сб</div><div>Вс</div>
            </div>
            <div class="calendar-grid"></div>
        `;
        document.body.appendChild(calendarElement);
    }

    function attachEvents() {
        displayElement.addEventListener('click', toggle);
        clearButton.addEventListener('click', clear);

        calendarElement.querySelector('[data-nav="prev"]').addEventListener('click', (e) => {
            e.stopPropagation();
            changeMonth(-1);
        });
        calendarElement.querySelector('[data-nav="next"]').addEventListener('click', (e) => {
            e.stopPropagation();
            changeMonth(1);
        });

        document.addEventListener('click', (e) => {
            if (!calendarElement.classList.contains('hidden') &&
                !calendarElement.contains(e.target) &&
                e.target !== displayElement) {
                hide();
            }
        });
    }

    function toggle(e) {
        e.stopPropagation();
        if (calendarElement.classList.contains('hidden')) {
            show();
        } else {
            hide();
        }
    }

    function show() {
        calendarElement.classList.remove('hidden');
        positionCalendar();
    }

    function hide() {
        calendarElement.classList.add('hidden');
    }

    function positionCalendar() {
        const rect = displayElement.getBoundingClientRect();
        calendarElement.style.top = (rect.bottom + 8) + 'px';
        calendarElement.style.left = rect.left + 'px';
    }

    function changeMonth(delta) {
        currentMonth += delta;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        render();
    }

    function render() {
        const monthElement = calendarElement.querySelector('.calendar-month');
        monthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        const grid = calendarElement.querySelector('.calendar-grid');
        grid.innerHTML = '';

        const firstDay = new Date(currentYear, currentMonth, 1);
        let startDay = firstDay.getDay() - 1;
        if (startDay < 0) startDay = 6;

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 0; i < 42; i++) {
            const cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'calendar-day';

            const dayNumber = i - startDay + 1;

            if (dayNumber < 1 || dayNumber > daysInMonth) {
                cell.classList.add('empty');
                cell.disabled = true;
            } else {
                cell.textContent = dayNumber;
                cell.dataset.day = dayNumber;
                cell.addEventListener('click', () => selectDay(dayNumber));
            }

            grid.appendChild(cell);
        }
    }

    function selectDay(day) {
        selectedDate = new Date(currentYear, currentMonth, day);
        if (onSelectCallback) {
            onSelectCallback(selectedDate);
        }
        hide();
    }

    function clear() {
        selectedDate = null;
        inputElement.value = '';
        displayElement.textContent = 'Дата';
        displayElement.classList.remove('has-date');
        if (clearButton) clearButton.classList.remove('visible');
    }

    return { init };
})();