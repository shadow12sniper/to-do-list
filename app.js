// Responsive To-Do List Web App
// Features: Add, edit, delete, complete, category tags, animations, localStorage persistence

// ------- Constants and Selectors -------
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const categorySelect = document.getElementById('category-select');
const taskList = document.getElementById('task-list');
const taskTemplate = document.getElementById('task-template');

const STORAGE_KEY = 'todo-tasks-v2';

// ------- Utility Functions -------

// Get tasks from localStorage or return empty array
function getTasks() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

// Save tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Generate a unique ID for each task
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// ------- Render Functions -------

// Render all tasks to the list
function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskEl = createTaskElement(task);
        taskList.appendChild(taskEl);
    });
}

// Create a task <li> element from a task object
function createTaskElement(task) {
    // Clone the template
    const li = taskTemplate.content.firstElementChild.cloneNode(true);
    const tag = li.querySelector('.category-tag');
    const checkbox = li.querySelector('.task-complete');
    const text = li.querySelector('.task-text');
    const editBtn = li.querySelector('.edit-btn');
    const deleteBtn = li.querySelector('.delete-btn');

    // Set up category tag
    tag.setAttribute('data-category', task.category);

    // Set up text
    text.textContent = task.text;

    // Set up completed
    checkbox.checked = !!task.completed;
    if (task.completed) li.classList.add('completed');

    // Animation class (for adding)
    li.classList.add('adding');
    setTimeout(() => li.classList.remove('adding'), 350);

    // Event: Complete toggle
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        saveAndRender();
    });

    // Event: Edit task
    editBtn.addEventListener('click', () => {
        startEditTask(task.id, li);
    });

    // Event: Delete task
    deleteBtn.addEventListener('click', () => {
        removeTaskWithAnimation(task.id, li);
    });

    // Store task id for reference
    li.dataset.id = task.id;

    return li;
}

// ------- Task Operations -------

// Save current tasks and re-render
function saveAndRender() {
    saveTasks(tasks);
    renderTasks(tasks);
}

// Add a new task
function addTask(text, category) {
    tasks.push({
        id: generateId(),
        text,
        category,
        completed: false
    });
    saveAndRender();
}

// Edit an existing task
function startEditTask(id, li) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Replace text span with input
    const textSpan = li.querySelector('.task-text');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = task.text;
    input.className = 'edit-input';
    input.style.flex = '1';
    input.maxLength = 100;
    textSpan.replaceWith(input);
    input.focus();

    // Confirm on blur or Enter
    function finishEdit(save) {
        if (save && input.value.trim()) {
            task.text = input.value.trim();
        }
        saveAndRender();
    }
    input.addEventListener('blur', () => finishEdit(true));
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            input.blur();
        } else if (e.key === 'Escape') {
            finishEdit(false);
        }
    });
}

// Remove a task with animation
function removeTaskWithAnimation(id, li) {
    li.classList.add('removing');
    setTimeout(() => {
        tasks = tasks.filter(task => task.id !== id);
        saveAndRender();
    }, 320);
}

// ------- Event Listeners -------

// Handle new task submission
taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = taskInput.value.trim();
    const category = categorySelect.value;
    if (!text) return;
    addTask(text, category);
    taskInput.value = '';
});

// ------- App Initialization -------

// Load tasks from storage
let tasks = getTasks();

// Initial render
renderTasks(tasks);

// Listen for storage changes (sync across tabs)
window.addEventListener('storage', () => {
    tasks = getTasks();
    renderTasks(tasks);
});

/* 
  --- End of To-Do List App ---
  Features:
    - Add, edit, delete, complete tasks
    - Color-coded categories
    - Animations
    - LocalStorage persistence
    - Responsive design
  All code is commented for clarity.
*/