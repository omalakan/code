// Стан додатка
const state = {
    isEditing: false,
    activeFile: 'main.asm',
    files: {
        'main.asm': '; MULTIX System Assembly Entry Point\n\n_start:\n    NOP\n    ; Code goes here',
        'lib.asm': '; Library functions'
    }
};

// DOM Елементи
const ui = {
    editor: document.getElementById('code-editor'),
    editBtn: document.getElementById('btn-edit-mode'),
    tabsList: document.getElementById('tabs-list'),
    consoleOut: document.getElementById('console-output'),
    lineNumbers: document.getElementById('line-numbers')
};

// Ініціалізація
function init() {
    renderTabs();
    loadFile(state.activeFile);
    log('MULTIX Development Terminal Environment initialized.', 'sys');
    log('Ready to connect via WebUSB.', 'info');
    
    // Події
    ui.editBtn.addEventListener('click', toggleEditMode);
    
    ui.editor.addEventListener('input', updateLineNumbers);
    ui.editor.addEventListener('scroll', () => {
        ui.lineNumbers.scrollTop = ui.editor.scrollTop;
    });

    // PWA Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => log('Service Worker registered.', 'sys'))
            .catch(err => log('SW registration failed: ' + err, 'sys'));
    }
}

// Логіка редактора
function loadFile(filename) {
    state.activeFile = filename;
    ui.editor.value = state.files[filename];
    renderTabs();
    updateLineNumbers();
}

function toggleEditMode() {
    state.isEditing = !state.isEditing;
    ui.editor.readOnly = !state.isEditing;
    
    if (state.isEditing) {
        ui.editBtn.textContent = 'Save & Lock';
        ui.editBtn.style.backgroundColor = '#e0a000'; // Warning color
        log('Mode changed: EDITING', 'sys');
    } else {
        // Тут буде логіка збереження у віртуальну ФС
        state.files[state.activeFile] = ui.editor.value;
        ui.editBtn.textContent = 'Edit';
        ui.editBtn.style.backgroundColor = ''; // Reset color
        log('Mode changed: READ-ONLY. File saved.', 'sys');
    }
}

// Логіка вкладок
function renderTabs() {
    ui.tabsList.innerHTML = '';
    Object.keys(state.files).forEach(filename => {
        const tab = document.createElement('div');
        tab.className = `tab ${filename === state.activeFile ? 'active' : ''}`;
        tab.textContent = filename;
        tab.onclick = () => loadFile(filename);
        ui.tabsList.appendChild(tab);
    });
}

function updateLineNumbers() {
    const lines = ui.editor.value.split('\n').length;
    ui.lineNumbers.innerHTML = Array(lines).fill(0).map((_, i) => i + 1).join('<br>');
}

// Системний лог
function log(msg, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-msg log-${type}`;
    const time = new Date().toLocaleTimeString('uk-UA');
    entry.textContent = `[${time}] ${msg}`;
    ui.consoleOut.appendChild(entry);
    ui.consoleOut.scrollTop = ui.consoleOut.scrollHeight;
}

// Старт
window.addEventListener('DOMContentLoaded', init);
