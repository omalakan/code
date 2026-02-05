// const — константа. Посилання на об'єкт не зміниться.
// let — змінна, яку можна переприсвоювати.
// Ніколи не використовуй var (це старий, небезпечний стиль).

// Зберігаємо посилання на елементи DOM, щоб не шукати їх щоразу (кешування DOM).
const UI = {
    editor: document.getElementById('code-editor'),
    lines: document.getElementById('line-numbers'),
    btnMode: document.getElementById('btn-mode'),
    console: document.getElementById('console-output')
};

// State (Стан) — це "мозок" програми. Дані живуть тут. 
// UI лише відображає цей стан.
const State = {
    isEditMode: false,
    code: "; MULTIX Asm Entry\n\n_start:\n    NOP"
};

// Головна функція ініціалізації
function init() {
    // Встановлюємо початкове значення
    UI.editor.value = State.code;
    updateLines();

    // Event Listeners (Слухачі подій)
    // Це асинхронність. Ми кажемо: "Коли станеться клік, виклич цю функцію".
    UI.btnMode.addEventListener('click', toggleMode);
    
    // Коли вводимо текст -> оновити номери рядків
    UI.editor.addEventListener('input', updateLines);
    
    // Синхронізація скролу: крутимо текст -> крутяться і номери
    UI.editor.addEventListener('scroll', () => {
        UI.lines.scrollTop = UI.editor.scrollTop;
    });

    log("Terminal initialized.");
}

function toggleMode() {
    // Інвертуємо булеве значення (true -> false, false -> true)
    State.isEditMode = !State.isEditMode;
    
    // Змінюємо властивість DOM елемента
    // readOnly = true означає, що писати не можна
    UI.editor.readOnly = !State.isEditMode;
    
    if (State.isEditMode) {
        UI.btnMode.textContent = "Save";
        UI.btnMode.style.background = "var(--accent)"; // Доступ до CSS змінних через JS
        log("Mode: EDIT");
    } else {
        UI.btnMode.textContent = "Edit";
        UI.btnMode.style.background = "";
        log("Mode: READ-ONLY (Saved)");
        // Тут ми потім додамо відправку State.code на Dev OS
    }
}

function updateLines() {
    // split('\n') розбиває текст на масив рядків по символу ентера.
    // .length дає кількість елементів.
    const count = UI.editor.value.split('\n').length;
    
    // Array(count).fill(0) створює масив [0,0,0...] потрібної довжини.
    // .map((_, i) => i + 1) перетворює його на [1, 2, 3...].
    // .join('<br>') склеює все в один HTML рядок з переносами.
    UI.lines.innerHTML = Array(count).fill(0).map((_, i) => i + 1).join('<br>');
}

function log(msg) {
    const time = new Date().toLocaleTimeString();
    // `` (backticks) — шаблонні рядки, дозволяють вставляти змінні через ${}
    const html = `<div><span style="color:var(--accent)">[${time}]</span> ${msg}</div>`;
    
    // insertAdjacentHTML швидше і безпечніше, ніж innerHTML += ...
    UI.console.insertAdjacentHTML('beforeend', html);
}

// Запускаємо init(), коли браузер повністю завантажив DOM дерево.
document.addEventListener('DOMContentLoaded', init);
